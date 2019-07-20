import ref from 'root/src/aws/util/ref'

import {
	RECORD_SET, VIDEO_BUCKET, CLOUDFRONT_DISTRIBUTION,
} from 'root/src/aws/staticHosting/resourceIds'

import {
	DOMAIN_NAME, VIDEO_UPLOAD_BUCKET, CLOUDFRONT_DISTRIBUTION_ARN,
} from 'root/src/aws/staticHosting/outputIds'

export default {
	[DOMAIN_NAME]: {
		Description: 'Route53 RecordSet domain name',
		Value: ref(RECORD_SET),
	},
	[VIDEO_UPLOAD_BUCKET]: {
		Description: 'Bucket for videos uploaded by streamers',
		Value: ref(VIDEO_BUCKET),
	},
	[CLOUDFRONT_DISTRIBUTION_ARN]: {
		Description: 'Cloudfront distribution',
		Value: ref(CLOUDFRONT_DISTRIBUTION),
	},
}
