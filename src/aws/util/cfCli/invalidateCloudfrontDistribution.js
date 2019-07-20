import outputs from 'root/cfOutput'
import { CloudFront } from 'aws-sdk'

const { cloudfrontDistributionArn } = outputs

export default () => {
	const cloudFront = new CloudFront()
	const params = {
		DistributionId: cloudfrontDistributionArn,
		InvalidationBatch: {
			CallerReference: new Date().getTime().toString(),
			Paths: {
				Quantity: 1,
				Items: [
					'/index.html',
				],
			},
		},
	}
	return cloudFront.createInvalidation(params).promise()
}
