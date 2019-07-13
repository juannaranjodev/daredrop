/* eslint-disable import/no-dynamic-require */
const stage = process.env.STAGE || 'dev'
const capitalize = str => str.charAt(0).toUpperCase() + str.slice(1)
const outputs = require(`./config/cfOutput-${capitalize(stage)}`)

export default outputs
