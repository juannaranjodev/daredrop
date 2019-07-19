import ref from 'root/src/aws/util/ref'
import split from 'root/src/aws/util/split'
import select from 'root/src/aws/util/select'
import getAtt from 'root/src/aws/util/getAtt'
import getCacheBehaviors from 'root/src/aws/util/getCacheBehaviors'
import domainName from 'root/src/aws/util/domainName'
import { isProdEnv, isDevEnv } from 'root/src/aws/util/envSelect'

import {
	CLOUDFRONT_DISTRIBUTION, SSL, STATIC_BUCKET,
} from 'root/src/aws/staticHosting/resourceIds'
import {
	LAMBDA_EDGE_VIEWER_VERSION, LAMBDA_EDGE_ORIGIN_VERSION,
} from 'root/src/aws/lambdaEdge/resourceIds'

import {
	AUTHENTICATION_LAYER_VERSION,
} from 'root/src/aws/authenticationLayer/resourceIds'

export default {
	[CLOUDFRONT_DISTRIBUTION]: {
		Type: 'AWS::CloudFront::Distribution',
		DependsOn: [
			STATIC_BUCKET,
			...(isProdEnv ? [
				LAMBDA_EDGE_VIEWER_VERSION,
				LAMBDA_EDGE_ORIGIN_VERSION,
			] : []),
			...(isDevEnv ? [
				AUTHENTICATION_LAYER_VERSION,
			] : []),
		],
		Properties: {
			DistributionConfig: {
				Aliases: [
					domainName,
				],
				Enabled: true,
				PriceClass: 'PriceClass_All',
				DefaultCacheBehavior: {
					TargetOriginId: ref(STATIC_BUCKET),
					ViewerProtocolPolicy: 'redirect-to-https',
					MinTTL: 0,
					AllowedMethods: ['HEAD', 'GET'],
					CachedMethods: ['HEAD', 'GET'],
					ForwardedValues: {
						QueryString: true,
						Cookies: {
							Forward: 'none',
						},
					},
					...(isProdEnv ? {
						LambdaFunctionAssociations: [
							{
								EventType: 'origin-request',
								LambdaFunctionARN: ref(LAMBDA_EDGE_ORIGIN_VERSION),
							},
							{
								EventType: 'viewer-request',
								LambdaFunctionARN: ref(LAMBDA_EDGE_VIEWER_VERSION),
							},
						],
					} : {}),
					...(isDevEnv ? {
						LambdaFunctionAssociations: [
							{
								EventType: 'viewer-request',
								LambdaFunctionARN: ref(AUTHENTICATION_LAYER_VERSION),
							},
						],
					} : {}),
				},
				...(isDevEnv ? {
					CacheBehaviors: getCacheBehaviors(['jpg', 'png', 'svg'],
						{
							AllowedMethods: ['HEAD', 'GET'],
							CachedMethods: ['HEAD', 'GET'],
							ForwardedValues: {
								QueryString: true,
								Cookies: {
									Forward: 'none',
								},
							},
							MinTTL: 0,
							PathPattern: '*.jpg',
							TargetOriginId: ref(STATIC_BUCKET),
							ViewerProtocolPolicy: 'redirect-to-https',
						}),
				} : {}),
				Origins: [
					{
						DomainName: select(2, split('/', getAtt(STATIC_BUCKET, 'WebsiteURL'))),
						Id: ref(STATIC_BUCKET),
						CustomOriginConfig: {
							HTTPPort: '80',
							HTTPSPort: '443',
							OriginProtocolPolicy: 'http-only',
						},
					},
				],
				DefaultRootObject: 'index.html',
				CustomErrorResponses: [
					{
						ErrorCode: '404',
						ResponsePagePath: '/index.html',
						ResponseCode: '200',
						ErrorCachingMinTTL: '30',
					},
				],
				ViewerCertificate: {
					SslSupportMethod: 'sni-only',
					AcmCertificateArn: ref(SSL),
				},
				HttpVersion: 'http2',
			},
		},
	},
}
