import { stage } from 'root/src/aws/util/resourcePrefix'

export const apexDomain = process.env.STAGE === 'production' ? 'lambdatestt-prod.co.uk' : 'lambdatestt.co.uk'
export const hostedZoneId = process.env.STAGE === 'production' ? 'Z1PV0OVAEG9A5Y' : 'Z32WQEXUK1N4LN'

export default apexDomain
