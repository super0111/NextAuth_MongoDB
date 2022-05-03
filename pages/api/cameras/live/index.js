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
		         if(  key === 'imageSingle' ) {
				  
					const camera = await Camera.findOne({_id: id}) 
					console.log(camera.vxg.allToken)
                    const vxgRes = await axios.get(
                        `${process.env.VXG_API_GATEWAY}/api/v4/live/image/`,{    // Live Screenshot 
                          headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Acc ${camera.vxg.allToken}`
                          }
						})
					console.log('Recieved Image Single', vxgRes.data)					
					return res.status(200).json({ success: true, camera: camera, events: vxgRes.data});
					
				}else if(  key === 'watch' ) {
                    
                    const camera = await Camera.findOne({_id: id})
                    //Get VXG Watch Tokens
					const vxgRes = await axios.get(
                        `${process.env.VXG_API_GATEWAY}/api/v4/live/watch/`,{
                          headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Acc ${camera.vxg.allToken}`
                          }
					})
                    console.log('Recieved Camera Watch Urls', vxgRes.data)					
					return res.status(200).json({ success: true, camera: camera, watch: vxgRes.data, });

				}else{
				    res.status(400).json({ success: false, message: `This Key (${key}) is invalid`  });
				}
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
