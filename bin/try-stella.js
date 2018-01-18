var stellaModule = require('../dist/stella.js')

var fakeLambdaContext = {
  succeed: function succeed (results) {
    console.log(results)
    process.exit(0)
  }
}

stellaModule.getChauchaValue({}, fakeLambdaContext)
