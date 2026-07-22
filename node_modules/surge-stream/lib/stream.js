
var path          = require("path")
var fs            = require("fs")
var url           = require("url")
var EventEmitter  = require('events')
var split         = require("split")
var tar           = require('tar')
var Ignore        = require('ignore')
var surgeIgnore   = require("surge-ignore")
var axios         = require("axios")


var stream = function(config){

  var creds = function(args){
    if(!args) return null

    if (typeof args === 'string'){
      return {
        username: "token",
        password: args
      }
    }
    return {
      username: args.username || args.user,
      password: args.password || args.pass
    }
  }

  // Helper: Recursively get all files in a directory
  var getFiles = function(dir, ig, prefix) {
    var results = []
    var entries = fs.readdirSync(dir)
    for (var i = 0; i < entries.length; i++) {
      var entry = entries[i]
      var fullPath = path.join(dir, entry)
      var relativePath = prefix ? prefix + "/" + entry : entry
      var stat = fs.statSync(fullPath)
      if (stat.isDirectory()) {
        // Check if directory itself should be ignored
        if (!ig.ignores(relativePath + "/")) {
          results = results.concat(getFiles(fullPath, ig, relativePath))
        }
      } else {
        // Check if file should be ignored
        if (!ig.ignores(relativePath)) {
          results.push(relativePath)
        }
      }
    }
    return results
  }

  // Helper: Create project read stream with tar + gzip
  var createProjectStream = function(projectPath){
    // Create ignore filter with default surge rules
    var ig = Ignore().add(surgeIgnore)

    // Load .surgeignore if it exists
    var surgeignorePath = path.join(projectPath, ".surgeignore")
    if (fs.existsSync(surgeignorePath)) {
      ig.add(fs.readFileSync(surgeignorePath, "utf8"))
    }

    // Get directory name and parent path for tar structure
    // Old implementation used: "dirname/file.txt" not "./file.txt"
    var absolutePath = path.resolve(projectPath)
    var dirName = path.basename(absolutePath)
    var parentDir = path.dirname(absolutePath)

    // Get all files (not directories) to pack, respecting ignore rules
    var files = getFiles(absolutePath, ig, "")

    // Prefix each file with the directory name for tar structure
    var tarFiles = files.map(function(f) { return path.join(dirName, f) })

    // Create gzipped tar stream with only file entries (no directory entries)
    // Use portable mode and epoch mtime to match old tarr output format
    return tar.c({
      gzip: true,
      cwd: parentDir,
      portable: true,
      mtime: new Date(0)
    }, tarFiles)
  }

  // Helper: Handle NDJSON response data and emit events
  var handleResponseData = function(emitter, data, successRef){
    try {
      var obj = JSON.parse(data)
      emitter.emit("data", obj)

      if (obj.type === "info") successRef.value = true

      var t = obj.type
      delete obj.type

      emitter.emit(t, obj)
    } catch(e) {
      // Ignore JSON parse errors (empty lines, etc)
    }
  }

  // Helper: Handle HTTP error status codes
  var handleErrorStatus = function(emitter, statusCode, headers){
    if (statusCode == 401) emitter.emit("unauthorized", headers["reason"] || "Unauthorized")
    if (statusCode == 403) emitter.emit("forbidden", headers["reason"] || "Forbidden")
    if (statusCode == 422) emitter.emit("invalid", headers["reason"] || "Invalid")
    if (statusCode == 429) emitter.emit("ratelimited", headers["reason"] || "Rate limited. Try again later.")
  }

  // ============================================================
  // AXIOS-BASED IMPLEMENTATIONS
  // ============================================================

  var _publishWithAxios = function(projectPath, projectDomain, userCreds, headers, argv){
    var success = { value: false }

    headers = Object.assign({ version: config.version }, headers || {})
    if (argv) headers.argv = JSON.stringify(argv)

    var emitter = new EventEmitter()

    var projectStream = createProjectStream(projectPath)

    // Set headers for streaming upload
    headers["content-type"] = "application/gzip"
    headers["accept"] = "application/x-ndjson"
    headers["transfer-encoding"] = "chunked"

    var credentials = creds(userCreds)

    axios({
      method: "PUT",
      url: url.resolve(config.endpoint, projectDomain),
      responseType: "stream",
      headers: headers,
      data: projectStream,
      auth: credentials,
      maxBodyLength: Infinity,
      maxContentLength: Infinity
    }).then(function(response){
      var responseStream = response.data

      responseStream.pipe(split()).on("data", function(data){
        handleResponseData(emitter, data, success)
      })

      responseStream.on('error', function(error){
        emitter.emit("error", error)
      })

      responseStream.on('end', function(){
        success.value === true
          ? emitter.emit("success")
          : emitter.emit("fail")
      })
    }).catch(function(error){
      // Handle axios errors
      if (error.response) {
        // Server responded with error status - emit status-specific event only
        // (matches request-based implementation behavior)
        handleErrorStatus(emitter, error.response.status, error.response.headers)
        emitter.emit("fail")
      } else if (error.request) {
        // Request made but no response received - this is a real error
        emitter.emit("fail")
      } else {
        // Error setting up request - this is a real error
        emitter.emit("fail")
      }
    })

    return emitter
  }

  var _encryptWithAxios = function(projectDomain, userCreds, headers, argv){
    var success = { value: false }

    headers = Object.assign({ version: config.version }, headers || {})
    if (argv) headers.argv = JSON.stringify(argv)

    var emitter = new EventEmitter()

    headers["accept"] = "application/x-ndjson"

    var credentials = creds(userCreds)

    axios({
      method: "PUT",
      url: url.resolve(config.endpoint, projectDomain + "/encrypt"),
      responseType: "stream",
      headers: headers,
      auth: credentials
    }).then(function(response){
      var responseStream = response.data

      responseStream.pipe(split()).on("data", function(data){
        handleResponseData(emitter, data, success)
      })

      responseStream.on('error', function(error){
        emitter.emit("error", error)
      })

      responseStream.on('end', function(){
        success.value === true
          ? emitter.emit("success")
          : emitter.emit("fail")
      })
    }).catch(function(error){
      if (error.response) {
        // Server responded with error status - emit status-specific event only
        handleErrorStatus(emitter, error.response.status, error.response.headers)
        emitter.emit("fail")
      } else if (error.request) {
        // Request made but no response received
        emitter.emit("fail")
      } else {
        // Error setting up request
        emitter.emit("fail")
      }
    })

    return emitter
  }

  var _sslWithAxios = function(pemPath, projectDomain, userCreds, headers, argv){
    var success = { value: false }

    headers = Object.assign({ version: config.version }, headers || {})
    if (argv) headers.argv = JSON.stringify(argv)

    var emitter = new EventEmitter()

    var pemStream = fs.createReadStream(pemPath)

    headers["content-type"] = "application/x-pem-file"
    headers["accept"] = "application/x-ndjson"

    var credentials = creds(userCreds)

    axios({
      method: "PUT",
      url: url.resolve(config.endpoint, projectDomain + "/ssl"),
      responseType: "stream",
      headers: headers,
      data: pemStream,
      auth: credentials,
      maxBodyLength: Infinity,
      maxContentLength: Infinity
    }).then(function(response){
      var responseStream = response.data

      responseStream.pipe(split()).on("data", function(data){
        handleResponseData(emitter, data, success)
      })

      responseStream.on('error', function(error){
        emitter.emit("error", error)
      })

      responseStream.on('end', function(){
        success.value === true
          ? emitter.emit("success")
          : emitter.emit("fail")
      })
    }).catch(function(error){
      if (error.response) {
        handleErrorStatus(emitter, error.response.status, error.response.headers)
        emitter.emit("fail")
      } else if (error.request) {
        emitter.emit("fail")
      } else {
        emitter.emit("fail")
      }
    })

    return emitter
  }

  // ============================================================
  // PUBLIC API
  // ============================================================

  return {
    encrypt: _encryptWithAxios,
    publish: _publishWithAxios,
    ssl: _sslWithAxios
  }
}

module.exports = stream
