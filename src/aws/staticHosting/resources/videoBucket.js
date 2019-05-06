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
					AllowedOrigins: ['*'],
					AllowedMethods: ['GET', 'PUT'],
					AllowedHeaders: ['*'],
				}],
			},
		},
	},
}
