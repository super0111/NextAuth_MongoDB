import Document, { Html, Head, Main, NextScript } from 'next/document';

class MyDocument extends Document {
	render() {
		return (
			<Html>
				<Head>
					<link rel="manifest" href="/manifest.json" />
					<link rel="apple-touch-icon" href="/logo-128x128.png" />
					<link rel="theme-color" href="#fff" />
					
					<link rel="stylesheet" type="text/css" href="/vxgwebsdk/video-js.min.css"/>
					<link rel="stylesheet" type="text/css" href="/vxgwebsdk/CloudSDK.min.css"/>
					<script type="text/javascript" src="/vxgwebsdk/video.min.js"></script>
					<script type="text/javascript" src="/vxgwebsdk/video.js"></script>
					<script type="text/javascript" src="/vxgwebsdk/webrtc-adapter-latest.js"></script>
					<script type="text/javascript" src="/vxgwebsdk/CloudSDK.min.js"></script>
		
					<link rel="stylesheet"  href="https://cdn.jsdelivr.net/npm/react-time-picker@4.5.0/dist/TimePicker.css" /> 

				</Head>
				<body>
					<Main />
					<NextScript />
				</body>
			</Html>
		);
	}
}

export default MyDocument;
