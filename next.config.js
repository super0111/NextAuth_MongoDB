const withPWA = require('next-pwa');

module.exports = withPWA({
	pwa: {
		dest: 'public',
		register: false,
		skipWaiting: true,
		disable: process.env.NODE_ENV === 'development',
	},
	eslint: {
		// Warning: This allows production builds to successfully complete even if
		// your project has ESLint errors.
		ignoreDuringBuilds: true,
	},
	images: {
	domains: [
		's3.wasabisys.com',
		`${process.env.S3_UPLOAD_BUCKET}.s3.wasabisys.com`,
		`${process.env.S3_UPLOAD_BUCKET}.s3.${process.env.S3_UPLOAD_REGION}.wasabisys.com`,
		'vxg.gomidl.com',
		'skyvr-av-auth2-rel.s3.amazonaws.com'
	],

	},
});
