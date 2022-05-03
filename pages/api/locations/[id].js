import dbConnect from '../../../mongo/dbConnect';
import Location from '../../../mongo/models/location';

export default async function handler(req, res) {
	const {
		query: { id },
		method
	} = req;
	await dbConnect();

	switch (method) {
		case 'GET' /* Get a model by its ID */:
			try {
				const location = await Location.findOne({_id: id});
				// if (!camera) {
				// 	return res.status(400).json({ success: false });
				// }
				res.status(200).json({ success: true, location: location});
			} catch (error) {
				res.status(400).json({ success: false });
			}
			break;

		case 'PUT' /* Edit a model by its ID */:
			try {
				console.log(id)
				const {updateVal, updateKey} = req.body
				if(updateKey === 'name'){
					const sameName = await Location.findOne({name: updateVal})
					console.log(sameName)
					if(sameName !== null && sameName?._id.toString() !== id){
						console.log('Existing Location Name', sameName, updateVal)
						return res.status(400).json({ success: false, message: "Location Already Exist"})
					}
					const location = await Location.findByIdAndUpdate(id,{
						name:  updateVal
					}, {
						new: true,
						runValidators: true
					});
					console.log(location)
					return res.status(200).json({ success: true, data: location});

				}else{
                    res.status(400).json({ success: false, message: 'Update Key Invalid'});
				}
			} catch (error) {
				console.log(error)
				res.status(400).json({ success: false });
			}
			break;

		case 'DELETE' /* Delete a model by its ID */:
			try {
				console.log(id)

				const deletedLocation  = await Location.deleteOne({ _id: id });
				if (!deletedLocation) {
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
