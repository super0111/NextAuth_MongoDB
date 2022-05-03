import axios from 'axios';
import dbConnect from '../../../../mongo/dbConnect';
import Wall from '../../../../mongo/models/wall';

export default async function handler(req, res) {
    const {
        query: { id, key}, 
        method 
    } = req;
	
	await dbConnect();

	switch (method) {
        case 'GET':
			try {
                
                const wallFound = await Wall.findOne({_id: id})
                if(!wallFound){
                    return res.status(422).send({success:false , message:'No Wall Found'})
                }
               return  res.status(200).send({success:true , wall: wallFound})
                
			} catch (error) {
                console.log('Wall Find Error', error)
				res.status(400).json({ success: false });
			}
			break;
		case 'DELETE':
            const { name, cameras } = req.body;

			try {
               
                const deletedWall = await Wall.deleteOne({ _id: id });
				if (!deletedWall) {
					return res.status(422).json({ success: false , message: 'No Wall Deleted'});
				}
				res.status(200).json({ success: true, data: deletedWall });
                
			} catch (error) {
                console.log('Wall Create Error', error)
				res.status(400).json({ success: false });
			}
			break;
		
		default:
			res.status(400).json({ success: false });
			break;
	}
}
