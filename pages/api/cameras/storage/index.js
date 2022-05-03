import axios from 'axios';
import dbConnect from '../../../../mongo/dbConnect';
import Camera from '../../../../mongo/models/camera';
import dateformat from 'dateformat';

export default async function handler(req, res) {
	const {
		query: { id,  key, next,start, nextUrl },
		method
	} = req;
	
	await dbConnect();
	switch (method) {
		case 'GET' /* Get a model by its ID */:
			try {
				if(key === 'getImages'){
					const camera = await Camera.findOne({_id: id});
					let currTime = new Date ().toLocaleString("en-US", {timeZone: "America/New_York"})
					// const timeStamp = currTime.getTime();
					// const yesterdayTimeStamp = timeStamp - 24*60*60*1000;
					// const yesterdayDate = new Date(yesterdayTimeStamp); // yesterday
					// let endTime = encodeURIComponent(dateformat(yesterdayTimeStamp, "yyyy-mm-dd'T'HH:MM:ss")) //Yesterday Time
					let endTime = encodeURIComponent(dateformat(currTime, "yyyy-mm-dd'T'HH:MM:ss", true)) //Current Time
                    let offset = '0'
                    let limit = '30'
					let order_by = '-time' 
                    const vxgRes = await axios.get(
                        `${process.env.VXG_API_GATEWAY}/api/v4/storage/images/?offset=${offset}&limit=${limit}&order_by=${order_by}`,{
                          headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Acc ${camera.vxg.allToken}`
                          }
                        })
					console.log('Get Camera Image Records', 'id: '+id, 'end ', endTime, 'Curr ', currTime)
				   return res.status(200).json({ success: true, camera: camera, events: vxgRes.data});
				}else if(  key === 'getImageSingle' ) {
					const camera = await Camera.findOne({_id: id});
					let currTime = new Date ().toLocaleString("en-US", {timeZone: "America/New_York"})
					// const timeStamp = currTime.getTime();
					// const yesterdayTimeStamp = timeStamp - 24*60*60*1000;
					// const yesterdayDate = new Date(yesterdayTimeStamp); // yesterday
					// let endTime = encodeURIComponent(dateformat(yesterdayTimeStamp, "yyyy-mm-dd'T'HH:MM:ss")) //Yesterday Time
					let endTime = encodeURIComponent(dateformat(currTime, "yyyy-mm-dd'T'HH:MM:ss", true)) //Current Time
                    let offset = '0'
                    let limit = '1'
					let order_by = '-time' 
                    const vxgRes = await axios.get(
                        `${process.env.VXG_API_GATEWAY}/api/v4/live/image/`,{
                          headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Acc ${camera.vxg.allToken}`
                          }
						})
						console.log(vxgRes)
					console.log('Get Camera Image Records', 'id: '+id, 'end ', endTime, 'Curr ', currTime)

					return res.status(200).json({ success: true, camera: camera, events: vxgRes.data});
				}else if(  key === 'video' ) {
					console.log('getClips', 'id: '+id)
					let startTime = encodeURIComponent(start) //Format Start Time
                    let offset = '1'
					let limit = '1'  //Return Single Clip
					let order_by = '-time' 
					const camera = await Camera.findOne({_id: id});
				
					//Get VXG Video Clip
					const vxgRes = await axios.get(
                        `${process.env.VXG_API_GATEWAY}/api/v4/storage/records/?end=${startTime}&limit=${limit}&order_by=${order_by}`,{
                          headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Acc ${camera.vxg.allToken}`
                          }
					})
					console.log(startTime)
					return	res.status(200).json({ success: true, camera: camera, events: vxgRes.data, });
				}else if(  key === 'nextVideo' ) {
					console.log('Get Next Clip', 'id: '+id)
					console.log(start)
					let startTime = encodeURIComponent(start) //Format Start Time
                    let offset = '1'
					let limit = '1'  //Return Single Clip
					let order_by = '-time'
					const camera = await Camera.findOne({_id: id});
					//Get VXG Video Clip
					const vxgRes = await axios.get(
                        `${process.env.VXG_API_GATEWAY}${start}&limit=${limit}&offset=${offset}`,{
                          headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Acc ${camera.vxg.allToken}`
                          }
						})
					console.log(vxgRes.data)
					return res.status(200).json({ success: true, camera: camera, events: vxgRes.data, });
				}else if (key === 'calender'){
					let daysincamtz = false; // Use Camera Local TimeZone
					let boundstime = true ; // Returns Full time instead of 
					const camera = await Camera.findOne({_id: id});
					const vxgRes = await axios.get(
                        `${process.env.VXG_API_GATEWAY}/api/v4/storage/calendar/?boundstime=${boundstime}&daysincamtz=${daysincamtz}`,{
                          headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Acc ${camera.vxg.allToken}`
                          }
					})
					return res.status(200).json({ success: true, camera: camera, calender: vxgRes.data, });
				}else{
				    return res.status(400).json({ success: false, message: `This Key (${key}) is invalid`  });
				}
			} catch (error) {
                console.log(error)
				res.status(400).json({ success: false });
			}
			break;
		case 'POST' :
				try {
					if(key === 'getNextImages'  ){
						const {nextUrl} = req.body;
						const camera = await Camera.findOne({_id: id});
						const vxgRes = await axios.get(
							`${process.env.VXG_API_GATEWAY}`+`${nextUrl}`,{
							  headers: {
								'Content-Type': 'application/json',
								'Authorization': `Acc ${camera.vxg.allToken}`
							  }
							})
						console.log('Got Next Image Set from', 'id: '+id, 'key: '+key, 'nextUrl :' + nextUrl)
						return res.status(200).json({ success: true, camera: camera, events: vxgRes.data, });
					}
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
				   return  res.status(200).json({ success: true, data: camera});
				   
				}else if (updateKey === 'deviceIp'){

					console.log('Camera Ip_Address Update')
					const camera = await Camera.findByIdAndUpdate(id,{
                        ip:  updateVal
                    }, {
                        new: true,
                        runValidators: true
                    });
					return res.status(200).json({ success: true, data: camera});
					
				}else if (updateKey === 'devicePort'){
					
					console.log('Camera Port_Address Update')
					const camera = await Camera.findByIdAndUpdate(id,{
                        port:  updateVal
                    }, {
                        new: true,
                        runValidators: true
                    });
					return res.status(200).json({ success: true, data: camera});
					
				}else if (updateKey === 'DeviceUsername'){

					console.log('Camera UserName Update')
					const camera = await Camera.findByIdAndUpdate(id,{
                        userName:  updateVal
                    }, {
                        new: true,
                        runValidators: true
                    });
					return res.status(200).json({ success: true, data: camera});
					
				}else if (updateKey === 'devicePassword'){

					console.log('Camera Password Update')
					const camera = await Camera.findByIdAndUpdate(id,{
                        password:  updateVal
                    }, {
                        new: true,
                        runValidators: true
                    });
					return res.status(200).json({ success: true, data: camera});
					
				}else{

					console.log('Camera Stream Path Update')
					const camera = await Camera.findByIdAndUpdate(id,{
                       path:  updateVal
                    }, {
                        new: true,
                        runValidators: true
                    });
                    return res.status(200).json({ success: true, data: camera});
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
