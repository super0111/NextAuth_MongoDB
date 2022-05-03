import dbConnect from '../../../mongo/dbConnect';
import Vehicle from '../../../mongo/models/vehicle';

export default async function handler(req, res) {
	const { 
            query:{id}, 
            method 
        } = req;

	await dbConnect();

	switch (method) {
		case 'GET':
			try {
				const AllVehicles = await Vehicle.find({})  
				return res.status(200).json({success:true , vehicles: AllVehicles})				
			} catch (error) {
				console.log('Get Vehicles Error')
				res.status(400).json({ success: false });
			}
			break;
		case 'POST':
			try {
				const AllVehicles = await Vehicle.find({})  
				return res.status(200).json({success:true , vehicles: AllVehicles})				
			} catch (error) {
				console.log('Get Vehicles Error')
				res.status(400).json({ success: false });
			}
			break;
		case 'DELETE':
			try {
				const AllVehicles = await Vehicle.find({})  
				return res.status(200).json({success:true , vehicles: AllVehicles})				
			} catch (error) {
				console.log('Get Vehicles Error')
				res.status(400).json({ success: false });
			}
			break;
		default:
			res.status(400).json({ success: false });
			break;
	}
}
