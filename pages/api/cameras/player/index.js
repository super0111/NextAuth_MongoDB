import axios from 'axios';
import dbConnect from '../../../../mongo/dbConnect';
import Camera from '../../../../mongo/models/camera';

export default async function handler(req, res) {
	const { method } = req;

	await dbConnect();

	switch (method) {
		case 'POST':
			const {
				query: { id, key},
				method
            } = req;
            
			try {
				if( key === 'recordedStart'){
                    const {start} =req.body;
                    const camera = await Camera.findOne({_id: id});
                    if(!camera){
                        return res.status(422).send({success:false , message:'No Camera Found'})
                    }
                    let limit ='25';
                    const vxgRes = await axios.get(
                        `${process.env.VXG_API_GATEWAY}/api/v4/storage/records?start=${start}&limit=${limit}`,{
                          headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Acc ${camera.vxg.allToken}`
                          }
                    })
                    res.status(200).send({success:true , clips: vxgRes.data})
                }
			} catch (error) {
				res.status(400).json({ success: false });
			}
			break;
		
		default:
			res.status(400).json({ success: false });
			break;
	}
}
