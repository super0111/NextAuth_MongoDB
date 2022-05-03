import dbConnect from '../../../mongo/dbConnect';
import User from '../../../mongo/models/user';
import Vehicle from '../../../mongo/models/vehicle';


export default async function handler(req, res) {
	const { method } = req;

	await dbConnect();

	switch (method) {
		case 'GET':
			const {
				query: { id, email },
				method
			} = req;
			try {
				if(email){
					const user = await User.findOne(
						{email: email}
					); 
					console.log(`Get User By Email ${email}, ${user}`)
					return res.status(200).json({ success: true, user: user });
				}else{
					const users = await User.find(
						{}
					); 
					return res.status(200).json({ success: true, users: users });
				}
			} catch (error) {
				console.log('Get User Error', error)
				return res.status(400).json({ success: false });
			}
			break;
		case 'POST': // Add User Form
			try {
				const { allValues } = req.body;

				const userFound = await User.findOne( { email: allValues.email } )
				if(userFound){
					return res.status(400).json({ success:false, message: 'User Already Exists'});
				}
				if(allValues.hasVehicle === ('true' || true)){
					const plateFound = await Vehicle.findOne({ plateNum: allValues.plateNum })
					if(plateFound){ // Handle Vehicle Exists
						console.log('Existing Vehicle',plateFound)
						return res.status(400).json({ success:false, message: 'Plate Number Already Exists'});
					}


					// Create New Vehicle
					const newVehicle = await Vehicle.create({
						plateNum: allValues.plateNum.replace(/-|\s/g,"").toUpperCase(), // Save no hyphen or spaces
						make: allValues.make,
						model: allValues.model,
						year: allValues.year,
						list_id: allValues.list.list_id,
					})

					//Creat New User
					const user = await User.create({
						fName: allValues.fName,
						lName: allValues.lName,
						email: allValues.email,
						phone: allValues.phone,
						userType: allValues.userType,
						hasVehicle: allValues.hasVehicle === ('true' || true) ? true : false,
						vehicles:[
							{
								vehicle_id : newVehicle._id
							}
						]
					}); /* create a new model in the database */
					return res.status(200).json({ success: true, user: user });
				}else{
					const user = await User.create({
						fName: allValues.fName,
						lName: allValues.lName,
						email: allValues.email,
						phone: allValues.phone,
						hasVehicle: allValues.hasVehicle,
						userType: allValues.userType
					}); /* create a new model in the database */
					return res.status(200).json({ success: true, user: user });
				}
				
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
