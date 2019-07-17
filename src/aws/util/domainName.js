import { stage } from 'root/src/aws/util/resourcePrefix'

export const apexDomain = process.env.STAGE === 'production' ? 'daredrop.com' : 'watt.tv'

export const hostedZoneId = process.env.STAGE === 'production' ? 'Z10DS6P5G65S82' : 'Z1Y1YRSE1A6N3N'

export default process.env.STAGE === 'production' ? apexDomain : `${stage.toLowerCase()}.${apexDomain}`

