
var helpers      = require("../util/helpers")
var localCreds   = require("../util/creds.js")
var surgeSDK     = require("surge-sdk")
var path         = require("path")
var pkg          = require("../../package.json")

module.exports = function(req, next){

  var sdk = surgeSDK({
    endpoint: req.endpoint.format(),
    defaults: helpers.defaults
  })

  var domain  = req.argv["_"][0]
  var rev     = req.argv["_"][1] || null

  helpers.space()
  sdk.nuke({ user: "token", pass: req.creds.token }, function(error, response){
    if (error){
      helpers.displayErrors(error)
      helpers.space()
      return process.exit(1)
    }

    localCreds(req.endpoint).set(null)
    helpers.trunc(("Success").green + (" - " + response.msg).grey)
    helpers.space()
    return next()
  })

}