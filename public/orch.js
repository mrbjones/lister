
module.exports = 
{
  getkey: function (name, surname) 
  {
  var orchestrate = require('orchestrate');

if (process.env.VCAP_SERVICES) {
  var services = JSON.parse(process.env.VCAP_SERVICES);
  var orchestrateConfig = services["orchestrate"];
  if (orchestrateConfig) {
    var node = orchestrateConfig[0];
    orchestrate_api_key = node.credentials.ORCHESTRATE_API_KEY
    orchestrate_api_url = node.credentials.ORCHESTRATE_API_HOST
  }
}
};

