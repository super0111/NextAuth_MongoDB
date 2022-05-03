import axios from 'axios';
import dbConnect from '../../../mongo/dbConnect';
import Camera from '../../../mongo/models/camera';

export default async function handler(req, res) {
	const { method } = req;
   ////// CONFIGURE AWS API FETCHER ///////////
   const client_id = process.env.AWS_CLIENT_ID;
   const headers = {
	   'Content-Type': 'application/json',
	   'X-API-Key': process.env.AWS_X_API_KEY
   }
   const instance = axios.create({
	   baseURL: process.env.AWS_API_GATEWAY_URL,
	   headers: headers
   });

	await dbConnect();

	switch (method) {
		case 'GET':
			const {
				query: { id, page},
				method
			} = req;
			try {
				if(id){
					const camera = await Camera.find(
						{_id: id}
					); 
					return res.status(200).json({ success: true, camera: camera });
				}else{
					const PAGE_SIZE = 10;
					const page = parseInt(req.query.page || "0");
					const total = await Camera.countDocuments({});
					const cameras = await Camera.find({})
					  .limit(PAGE_SIZE)
					  .skip(PAGE_SIZE * page);
					return res.status(200).json({
						success: true,
						totalPages: Math.ceil(total / PAGE_SIZE),
						cameras: cameras,
					});
				}
			} catch (error) {
				res.status(400).json({ success: false });
			}
			break;
		case 'POST': //  /api/auth/signup for registration
			try {
				console.log(req.body, client_id)
                const cameraFound = await Camera.findOne({
					ip: req.body.deviceIp,
					port: req.body.devicePort,
					path: req.body.devicePort

                }); /* find camera with ip address in DB  */
                 if(cameraFound){
					 console.log('Camera Found')
                    return res.status(300).json({ success: true, camera: cameraFound });
                 }else {
					
					const apiRes =  await  instance.post('/channels', { //Create AWSVXG Channel
						client_id: client_id,
						passthrough: req.body.passthrough === true ? 'true' : 'false', // Edge Ai Bypass
						name: req.body.deviceName,
						timezone: 'America/New_York',
						rec_mode: req.body.recording === 'on' ? 'on' : 'off', // VXG Record Mode
						meta: {},
						source: {
							url: `rtsp://${req.body.deviceIp}:${req.body.devicePort}/${req.body.deviceStreamPath.length > 0 ? req.body.deviceStreamPath :''}`, 
							username: req.body.deviceUsername,
							password: req.body.devicePassword
						}
						
					})
					console.log('Camera Created AWS ', apiRes.data)
					
					const amsRes = await axios.post(`${process.env.MEDIA_SERVER_URL}/WebRTCAppEE/rest/v2/broadcasts/create?autoStart=true`,{
						streamId: apiRes.data.channel_id,
						streamUrl: `rtsp://${process.env.EDGE_SERVER_IP}:${process.env.EDGE_SERVER_PORT}/${req.body.passthrough === true ? '' : 'ds-'}${apiRes.data.channel_id}`, 
						username: apiRes.data.source.url.username,
						password: apiRes.data.source.url.password,
						type:"streamSource",
						name: req.body.deviceName,
						description: req.body.deviceLocation,
						is360: false,
						// listenerHookURL: "string", IMPLEMENT WEBHOOK TO HANDLE STREAM PROGRESS/READINESS ON FRONTEND
						// publish: true,
						// date: 0,
						// plannedStartDate: 0,
						// plannedEndDate: 0,
						// duration: 0,
						// publicStream: true,
						// category: "string",
						// ipAddr: "string",
						// quality: "string",
						// speed: 0,
						// originAdress: "string",
						// mp4Enabled: 0,
						// webMEnabled: 0,
						
						}	
					  )
					console.log('Camera Created Ams ', amsRes.data)

					const camera = await Camera.create({
						name: req.body.deviceName,
						location: req.body.deviceLocation,
						timezone: apiRes.data.timezone,
						antStreamId: amsRes.data.dataId , //Ant Media StreamID Currently Equal To VXG Channel_ID
						passthrough: req.body.passthrough, // edge Ai Bypass
						vxg:{
							channel_id: apiRes.data.channel_id,
							allToken: apiRes.data.access_tokens.all,
							watchToken: apiRes.data.access_tokens.watch,
							source: apiRes.data.source.url,
							rec: req.body.recording === 'on' ? 'on' : 'off', // VXG Record Mode
						},
						ip: req.body.deviceIp,
						port: req.body.devicePort,
						userName: req.body.deviceUsername,
						password: req.body.devicePassword,
						path: req.body.deviceStreamPath,
					}); /* create a new model in the database */
					console.log(camera)
					return res.status(201).json({ success: true, camera: camera });
					console.log('Camera Created')
				}
			} catch (error) {
				console.log(error);
				res.status(400).json({ success: false });
			}
			break;
		case 'DELETE': //  /api/auth/signup for registration
			try {
				const camera = await Camera.findOne(
					{_id: id}
				);
				if(!camera){
					return res.status(422).json({success:false , message: 'No Camera Found'})
				}

				// Delete AWSVXG Channel
				const apiRes =  await  instance.delete('/channels', {
					channel_id: camera.channel_id // Need to Store in DB
				})
				return res.status(201).json({ success: true, message: 'Camera Delete'});

			} catch (error) {
				console.log(error);
				res.status(400).json({ success: false });
			}
			break;
		default:
			res.status(400).json({ success: false });
			break;
	}
}
