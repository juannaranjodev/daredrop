import { stage } from 'root/src/aws/util/resourcePrefix'

export const apexDomain = process.env.stage === 'production' ? 'daredrop.com' : 'watt.tv'

export const hostedZoneId = process.env.stage === 'production' ? 'Z10DS6P5G65S82' : 'Z1Y1YRSE1A6N3N'

export default process.env.stage === 'production' ? apexDomain : `${stage.toLowerCase()}.${apexDomain}`

// i leave those for my own convenience of use -Dominik Piekarski
// export const apexDomain = 'lambdatestt.co.uk'
// export const hostedZoneId = 'Z32WQEXUK1N4LN'
// export default apexDomain
