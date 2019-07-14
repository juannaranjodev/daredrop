import { map, contains } from 'ramda'
import UploadStream from 's3-stream-upload'
import fs from 'fs'
import { lookup } from 'mime-types'
import setContentEncoding from 'root/src/aws/util/cfCli/setContentEncoding'
import webpackCompressedFilenames from 'root/src/server/edge/origin/webpackCompressedFilenames'
import { isProdEnv } from 'root/src/aws/util/envSelect'

const uploadFileHof = (s3Client, bucket) => (
	localPath, fileName,
) => (
	new Promise(
		(resolve, reject) => {
			fs.createReadStream(localPath).pipe(
				UploadStream(
					s3Client,
					{
						Bucket: bucket,
						Key: fileName,
						// not 100% sure contentType works with s3-stream-upload
						ContentType: lookup(fileName),
						CacheControl: 'max-age=31104000',
						...((isProdEnv && contains(fileName, webpackCompressedFilenames))
							? {
								ContentEncoding: setContentEncoding(fileName),
							} : {}
						),
					},
				),
			).on('error', (err) => {
				reject(err)
			}).on('finish', () => {
				resolve()
			})
		},
	)
)

export default (s3Client, bucket, fileArr) => {
	const uploadFile = uploadFileHof(s3Client, bucket)
	return Promise.all(
		map(
			([localPath, s3FileName]) => uploadFile(localPath, s3FileName),
			fileArr,
		),
	)
}
