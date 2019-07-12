import { concat, map, find, propEq, prop, last, split } from 'ramda'
import fs from 'fs'

import s3Upload from 'root/src/aws/util/cfCli/s3Upload'
import { STATIC_BUCKET } from 'root/src/aws/staticHosting/resourceIds'
import listAllStackResources from 'root/src/aws/util/cfCli/listAllStackResources'


export const getHostingBucket = (
	cloudFormationClient, stackName,
) => (
	listAllStackResources(cloudFormationClient, stackName).then(res => (
		prop(
			'PhysicalResourceId',
			find(propEq('LogicalResourceId', STATIC_BUCKET), res),
		)
	))
)

export const clientFiles = path => new Promise((resolve, reject) => {
	fs.readdir(path, (err, fileArr) => {
		if (err) {
			reject(err)
		} else {
			resolve(map(concat(`${path}/`), fileArr))
		}
	})
})

export const uploadStatics = (
	s3Client, projectRoot, bucket,
) => clientFiles(`${projectRoot}/dist/build-web-client`).then(
	fileArr => s3Upload(s3Client, bucket, map(
		localDir => [
			localDir,
			last(split('/', localDir)),
		],
		fileArr,
	)),
)


export default ({
	cloudFormationClient, stackName, projectRoot, s3Client,
}) => getHostingBucket(cloudFormationClient, stackName).then(
	hostingBucket => uploadStatics(
		s3Client, projectRoot, hostingBucket,
	),
)
