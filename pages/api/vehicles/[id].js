import dbConnect from '../../../mongo/dbConnect';
import Vehicle from '../../../mongo/models/vehicle';
import User from '../../../mongo/models/user';

export default async function handler(req, res) {
	const { 
            query:{id}, 
            method 
        } = req;

	await dbConnect();

	switch (method) {
		case 'GET':
			try{
				const foundVehicle = await Vehicle.findOne({_id: id})
				if(foundVehicle ){
					return	res.status(200).json({success:true , vehicle: foundVehicle  })
				}else{
					return	res.status(400).json({success:false , message: 'No Vehicle Found' })
				}			
			}catch (error) {
				res.status(400).json({ success: false });
			}
			break;
		case 'DELETE':
			try{
				// Delete User Vehicle From  Vehicles Collection
				const foundVehicle = await Vehicle.deleteOne({_id: id})
				if( !foundVehicle ){
					return	res.status(400).json({success:false , message: 'No Vehicle Found' })
				}else{
					return	res.status(200).json({success:true , message: 'Vehicle Deleted' })
				}			
			}catch (error) {
				console.log(error)
				res.status(400).json({ success: false });
			}
			break;

		default:
			res.status(400).json({ success: false });
			break;
	}
}
