import axios from 'axios';
import dbConnect from '../../../mongo/dbConnect';
import Camera from '../../../mongo/models/camera';

export default async function handler(req, res) {
	const {
		query: { id},
		method
	} = req;

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
		case 'GET' /* Get a model by its ID */:
			try {
				// console.log('Get Camera:',id)
				const camera = await Camera.findOne({_id: id});
				res.status(200).json({ success: true, camera: camera });
				
			} catch (error) {
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
				}else if (updateKey === 'deviceLocation'){
					console.log('Camera Location  Update')
					const camera = await Camera.findByIdAndUpdate(id,{
                        location:  updateVal
                    }, {
                        new: true,
                        runValidators: true
                    });
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
				}else if (updateKey === 'recording'){
					//IMplement todo frontend
					console.log('Camera Recording Update')
					const camera = await Camera.findByIdAndUpdate(id,{
                        vxg:{
							rec: updateVal // on or off 
						}
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
				const camera = await Camera.findOne({_id: id});
				
				//Delete From APIVXG
				console.log('Deleting Channel From API-G',camera._id,'cID:',camera.vxg.channel_id)
				const apiRes = await instance.delete('/channels', {
					// headers: {
					// 	Authorization: authorizationToken
					//   },
					data: { // data {} necessary for axios.delete req.body to be sent
						channel_id: camera.vxg.channel_id
					  }
				}
				)	
				console.log('Deleting Channel From AMS',camera._id)

				//Delte from AMS		
				const amsRes = await axios.delete(`${process.env.MEDIA_SERVER_URL}/WebRTCAppEE/rest/v2/broadcasts/${camera.antStreamId}`)

				console.log('Deleting Channel From DB',camera._id)
				const deletedCamera = await Camera.deleteOne({ _id: id });
				if (!deletedCamera) {
					console.log('No DB Camera Found to delete')
					return res.status(400).json({ success: false });
				}
				res.status(200).json({ success: true, data: {} });
			} catch (error) {
				console.log(error)
				res.status(400).json({ success: false });
			}
			break;

		default:
			res.status(400).json({ success: false });
			break;
	}
}
