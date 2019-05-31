import {
	VIDEO_BUCKET,
} from 'root/src/aws/staticHosting/resourceIds'

export default {
	[VIDEO_BUCKET]: {
		Type: 'AWS::S3::Bucket',
		Properties: {
			AccessControl: 'PublicRead',
			CorsConfiguration: {
				CorsRules: [{
					AllowedOrigins: process.env.stage === 'production'
						? ['https://daredrop.com', 'https://www.daredrop.com']
						: ['localhost:8585', 'http://localhost:8585', 'https://dev.watt.tv', 'https://www.dev.watt.tv'],
					AllowedMethods: ['GET', 'PUT'],
					AllowedHeaders: ['*'],
				}],
			},
		},
	},
}
