import fs from 'fs'
import awsConfig from 'aws-config'
import { awsAdminProfile, awsRegion } from 'root/appConfig.json'

export default () => new Promise((resolve, reject) => {
	fs.readFile(`${process.env.HOME}/.aws/credentials`, (err, data) => {
		if (err) {
			console.warn(err)
		} else {
			const profileRegex = new RegExp(
				`[\\s\\S]*\\[${awsAdminProfile}\\][\\s\\S]+?aws_access_key_id = (.*)[\\s\\S]+?aws_secret_access_key = (.*)`,
				'g',
			)
			const match = profileRegex.exec(data.toString())

			const [, accessKeyId, secretAccessKey] = match

			resolve(awsConfig({
				region: awsRegion,
				accessKeyId,
				secretAccessKey,
			}))
		}
	})
})
