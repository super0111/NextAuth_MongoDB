import axios from 'axios';
import dbConnect from '../../../../mongo/dbConnect';
import Camera from '../../../../mongo/models/camera';
import ShareToken from '../../../../mongo/models/shareToken';


// NOT IMPLEMENTED , CAMERA SHARE EXPIRING VIEWING LINK 
export default async function handler(req, res) {
	const {
		query: { id},
		method
	} = req;

	
	await dbConnect();
	switch (method) {
		case 'GET' /* Get a model by its ID */:
			try {
				console.log('Share Camera:',id)
                const camera = await Camera.findOne({_id: id});
        
                // Add Expiration and Share Token
				const hash = new ShareToken({ camera_id: camera._id });
				await hash.save();
				res.status(200).json({ success: true, camera: camera });
				
			} catch (error) {
				res.status(400).json({ success: false });
			}
			break;
		default:
			res.status(400).json({ success: false });
			break;
	}
}
