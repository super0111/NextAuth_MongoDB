import dbConnect from '../../../mongo/dbConnect';
import Kiosk from '../../../mongo/models/kiosk';
import {nanoid} from "nanoid";

export default async function handler(req, res) {
	const { method } = req;

	await dbConnect();

	switch (method) {
		case 'GET':
			const {
				query: { id},
				method
			} = req;
			try {
				if(id){
					console.log('Get Kiosk by Kiosk_Id', id)
					const kiosk = await Kiosk.findOne(
						{kiosk_id: id}
					); 
					console.log('Got Kiosk',kiosk )
					return res.status(200).json({ success: true, kiosk: kiosk });
				}else{
					console.log('Get  All Kiosks')
					const kiosks = await Kiosk.find(
						{}
					).sort({ createdAt: -1 }); 
					return res.status(200).json({ success: true, kiosks: kiosks });
				}
			} catch (error) {
				res.status(400).json({ success: false });
			}
			break;
		case 'POST': //  Create Notes
			try {
				console.log(req.body)
				const kiosk = await Kiosk.create({
					kiosk_id: nanoid(9),
					name: req.body.name,
					location: req.body.location,
					webrelay_id: req.body.webrelay_id,
					camera_id: req.body.camera_id
				}); /* create a new model in the database */
				console.log(kiosk)
				res.status(201).json({ success: true, kiosk: kiosk});
				console.log('Note Created')
	
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
