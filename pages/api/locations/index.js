import dbConnect from '../../../mongo/dbConnect';
import Location from '../../../mongo/models/location'; // Location Change ALL

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
					console.log('Ran Empty Res ')
				}else{
					const locations = await Location.find(
						{}
					).sort({ createdAt: -1 });  //Returns Latest Collection [0]
					res.status(200).json({ success: true, locations: locations });
				}
			} catch (error) {
				res.status(400).json({ success: false });
			}
			break;
		case 'POST': //  Create Notes
			try {
				console.log(req.body)
				const location = await Location.create({
					name: req.body.name,
				}); /* create a new model in the database */
				console.log(location)
				res.status(201).json({ success: true, location: location});
				console.log('Location Created')
	
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