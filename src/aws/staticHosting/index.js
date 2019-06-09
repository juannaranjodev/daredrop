import cloudFrontDistribution from 'root/src/aws/staticHosting/resources/cloudFrontDistribution'
import staticBucket from 'root/src/aws/staticHosting/resources/staticBucket'
import recordSet from 'root/src/aws/staticHosting/resources/recordSet'
import ssl from 'root/src/aws/staticHosting/resources/ssl'
import publicBucketPolicy from 'root/src/aws/staticHosting/resources/publicBucketPolicy'
import videoBucket from 'root/src/aws/staticHosting/resources/videoBucket'
import videoBucketPolicy from 'root/src/aws/staticHosting/resources/videoBucketPolicy'

import outputs from 'root/src/aws/staticHosting/outputs'

export const staticHostingResources = {
	// ...cloudFrontDistribution,
	// ...recordSet,
	// ...ssl,
	...staticBucket,
	...publicBucketPolicy,
	...videoBucket,
	...videoBucketPolicy
}

export const staticHostingOutputs = outputs
