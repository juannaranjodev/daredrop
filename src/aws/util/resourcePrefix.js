import { camelCase } from 'root/src/shared/util/stringCase'
import packageJson from 'root/appConfig.json'

let stage = process.env.STAGE || 'dev'
if (stage === 'staging') {
	stage = 'dev'
}

export default camelCase(`${packageJson.name} ${stage}`)
export { stage }
