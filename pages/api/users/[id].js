import dbConnect from '../../../mongo/dbConnect';
import User from '../../../mongo/models/user';
import Vehicle from '../../../mongo/models/vehicle';

export default async function handler(req, res) {
	const {
		query: { id, key },
		method
	} = req;
	await dbConnect();

	switch (method) {
		case 'GET' /* Get a model by its ID */:
			try {
				console.log(id)

				const user = await User.findOne({_id: id});
				if (!user) {
					return res.status(400).json({ success: false, message:'No User Found' });
				}
				return res.status(200).json({ success: true, user: user });
			} catch (error) {
				res.status(400).json({ success: false });
			}
			break;

		case 'PUT' /* Edit a model by its ID */:
			try {
				const { allValues,vehicle_id, key } = req.body;		

				if(key === 'addVehicle'){ 
					// Add Additional User Vehicle
					const user = await User.findOne({_id: id});
					if (!user) {
						return res.status(400).json({ success: false });
					}
					const plateFound = await Vehicle.findOne({ plateNum: allValues.plateNum.replace(/-|\s/g,"").toUpperCase() })
					
					// Handle Vehicle Exists
					if(plateFound){ 
						return res.status(400).json({ success:false, message: 'Plate Number Already Exists'});
					}
					
					// Create New Vehicle
					const newVehicle = await Vehicle.create({
						plateNum: allValues.plateNum.replace(/-|\s/g,"").toUpperCase(),
						make: allValues.make,
						model: allValues.model,
						year: allValues.year,
						list_id: allValues.list.list_id,
					})
					
					// Handle Update User.hasVehicle 
					if(user.hasVehicle === false){
						user.hasVehicle = true;
						user.vehicles.push({vehicle_id: newVehicle._id})
					}else{
						user.vehicles.push({vehicle_id: newVehicle._id})
					}
					const updatedUser = await user.save()
					return res.status(200).json({ success: true, data: updatedUser });

				}else if (key === 'deleteVehicle'){

					console.log('ran delete user vehicle')
					const user = await User.findOne({_id: id});
					if (!user) {
						return res.status(400).json({ success: false });
					}
					user.vehicles = user.vehicles.filter( (v) => v.vehicle_id !== vehicle_id)
					if(user.vehicles.length === 0){
						user.hasVehicle = false; // Handle Deleted last vehicle
					}
					const updatedUser = await user.save();
					return res.status(200).json({ success: true, data: updatedUser });

				}else if (key === 'updatePhone'){ //Not Implemented
					const { phone } = req.body;
					console.log('ran update user phone')
					const user = await User.findOne({_id: id});
					if (!user) {
						return res.status(400).json({ success: false });
					}
					user.phone = phone;
					const updatedUser = await user.save();
					return res.status(200).json({ success: true, data: updatedUser });

				}else{
					return res.status(400).json({ success: false, message:'Not Found' });
				}
			} catch (error) {
				res.status(400).json({ success: false });
			}
			break;

		case 'DELETE' /* Delete a model by its ID */:
			try {
				console.log(id)
				// Should Delete All User vehicles from DB and LPR Lists
				const deletedUser = await User.deleteOne({ _id: id });
				if (!deletedUser) {
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
