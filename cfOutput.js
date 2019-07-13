let outputs

// #if !process.env.STAGE
outputs = require('./config/cfOutput-Dev')
// #endif
// #if process.env.STAGE === 'production'
outputs = require('./config/cfOutput-Production')
// #endif
// #if process.env.STAGE === 'testing'
outputs = require('./config/cfOutput-Testing')
// #endif
// #if process.env.STAGE === 'staging'
outputs = require('./config/cfOutput-Staging')
// #endif

export default outputs
