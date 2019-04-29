import lambdaTestGetCredentials from 'root/src/testUtil/lambdaTestGetCredentials'
import fs from 'fs'
import path from 'path'

(async () => {
	const credentials = await lambdaTestGetCredentials()
	const credentialsBash = `AWS_REGION=${credentials.region}\nAWS_ACCESS_KEY_ID=${credentials.accessKeyId}\nAWS_SECRET_ACCESS_KEY=${credentials.secretAccessKey}`
	fs.writeFileSync(path.resolve(process.cwd(), 'AWSCredentials.txt'), credentialsBash)
})()
