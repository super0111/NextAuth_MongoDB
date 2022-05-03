import axios from 'axios';
import dbConnect from '../../../../mongo/dbConnect';
import Camera from '../../../../mongo/models/camera';
import dateformat from 'dateformat';

export default async function handler(req, res) {
	const {
		query: { id,  event,next, nextUrl },
		method
	} = req;

	await dbConnect();
	switch (method) {
		case 'GET' /* Get a model by its ID */:
			try {
				console.log('Get Camera Ai',id)
				const camera = await Camera.findOne({_id: id});
				//Time Settings for Search Filtering
				let currTime = new Date ().toLocaleString("en-US", {timeZone: "America/New_York"})
				// const timeStamp = currTime.getTime();
				// const yesterdayTimeStamp = timeStamp - 24*60*60*1000;
				// const yesterdayDate = new Date(yesterdayTimeStamp); // yesterday
				// let endTime = encodeURIComponent(dateformat(yesterdayTimeStamp, "yyyy-mm-dd'T'HH:MM:ss")) //Yesterday Time
				let startTime = encodeURIComponent(dateformat(currTime, "yyyy-mm-dd'T'HH:MM:ss")) //Current Time
				//////End Time Settings ////////
				let offset = '0'
				let limit = '30' 
				let order_by = '-time' // Newsest at top of response
				
				if(camera.aiEnabled ){
					console.log(camera)
					// No events query returns all event types 
					let objectEvt = 'object_and_scene_detection'
					const vxgRes = await axios.get(
						`${process.env.VXG_API_GATEWAY}/api/v2/storage/events/?limit=${limit}&offset=${offset}&events=${camera.aiTypes[0]}&include_filemeta_download=true&include_meta=true&order_by=-time`,{
							headers: {
							'Content-Type': 'application/json',
							'Authorization': `Acc ${camera.vxg.allToken}`
							}
						})
				console.log('Get Camera Ai Records Recent', event ? `Event specififed: ${event}`: 'No Event Specified')
				return res.status(200).json({ success: true, camera: camera, events: vxgRes.data});

				}else if(camera.aiEnabled  && next === 'true' ){
						
					// No events query returns all event types 
					let objectEvt = 'object_and_scene_detection'
					const vxgRes = await axios.get(
							`${process.env.VXG_API_GATEWAY}${nextUrl}&include_meta=true`,{
								headers: {
								'Content-Type': 'application/json',
								'Authorization': `Acc ${camera.vxg.allToken}`
								}
							})
					console.log('Get Camera Ai Records', event ? `Event specififed: ${event}`: 'No Event Specified')
					return res.status(200).json({ success: true, camera: camera, events: vxgRes.data});

				}
				return res.status(422).json({ success: false, camera: camera, message:'No Ai Enabled For This Camera'});
			} catch (error) {
                console.log(error)
				res.status(400).json({ success: false });
			}
			break;
		case 'POST' /* Get a model by its ID */:
			try {

				const camera = await Camera.findOne({_id: id});
				const {nextUrl} = req.body;
				const vxgRes = await axios.get(
					`${process.env.VXG_API_GATEWAY}${nextUrl}&include_meta=true`,{
						headers: {
						'Content-Type': 'application/json',
						'Authorization': `Acc ${camera.vxg.allToken}`
						}
					})
					console.log('Got Next Ai Clips nextUrl :' + nextUrl)
			return res.status(200).json({ success: true, camera: camera, events: vxgRes.data});
			} catch (error) {
                console.log(error)
				res.status(400).json({ success: false });
			}
			break;

		case 'PUT' /* Edit a model by its ID */:
			try {
				console.log(id)
				const {updateVal, updateKey} = req.body
				if(updateKey === 'deviceName'){
					console.log('Camera Name Update')
					const camera = await Camera.findByIdAndUpdate(id,{
                        name:  updateVal
                    }, {
                        new: true,
                        runValidators: true
					});
					console.log(camera)
                    res.status(200).json({ success: true, data: camera});
				}else if (updateKey === 'deviceIp'){
					console.log('Camera Ip_Address Update')
					const camera = await Camera.findByIdAndUpdate(id,{
                        ip:  updateVal
                    }, {
                        new: true,
                        runValidators: true
                    });
                    res.status(200).json({ success: true, data: camera});
				}else if (updateKey === 'devicePort'){
					console.log('Camera Port_Address Update')
					const camera = await Camera.findByIdAndUpdate(id,{
                        port:  updateVal
                    }, {
                        new: true,
                        runValidators: true
                    });
                    res.status(200).json({ success: true, data: camera});
				}else if (updateKey === 'DeviceUsername'){
					console.log('Camera UserName Update')
					const camera = await Camera.findByIdAndUpdate(id,{
                        userName:  updateVal
                    }, {
                        new: true,
                        runValidators: true
                    });
                    res.status(200).json({ success: true, data: camera});
				}else if (updateKey === 'devicePassword'){
					console.log('Camera Password Update')
					const camera = await Camera.findByIdAndUpdate(id,{
                        password:  updateVal
                    }, {
                        new: true,
                        runValidators: true
                    });
                    res.status(200).json({ success: true, data: camera});
				}else{
					console.log('Camera Stream Path Update')
					const camera = await Camera.findByIdAndUpdate(id,{
                       path:  updateVal
                    }, {
                        new: true,
                        runValidators: true
                    });
                    res.status(200).json({ success: true, data: camera});
				}
			} catch (error) {
				res.status(400).json({ success: false });
			}
			break;

		case 'DELETE' /* Delete a model by its ID */:
			try {
				console.log(id)

				const deletedCamera = await Camera.deleteOne({ _id: id });
				if (!deletedCamera) {
					return res.status(400).json({ success: false });
				}
				res.status(200).json({ success: true, data: {} });
			} catch (error) {
				res.status(400).json({ success: false });
			}
			break;

		default:
			res.status(400).json({ success: false });
			break;
	}
}
