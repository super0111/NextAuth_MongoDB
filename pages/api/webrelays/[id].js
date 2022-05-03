import dbConnect from '../../../mongo/dbConnect';
import WebRelay from '../../../mongo/models/webrelay';

export default async function handler(req, res) {
	const {
		query: { id },
		method
	} = req;
	await dbConnect();

	switch (method) {
		case 'GET' /* Get a model by its ID */:
			try {
				const webrelay = await WebRelay.findOne({_id: id});
				if (!webrelay) {
					return res.status(422).json({ success: false, message:'No WebRelay Found' });
				}
				
				return res.status(200).json({ success: true, webrelay: webrelay});
				
			} catch (error) {
				res.status(400).json({ success: false });
			}
			break;

		case 'PUT' /* Edit a model by its ID */:
			try {
				console.log(id)
				const {updateVal, updateKey} = req.body
				if(updateKey === 'name'){
                    console.log('Location Name Update')
					const webrelay = await WebRelay.findByIdAndUpdate(id,{
						name:  updateVal
					}, {
						new: true,
						runValidators: true
					});
					console.log(webrelay)
					res.status(200).json({ success: true, data: webrelay});
				
				}else{
                    res.status(400).json({ success: false, message: 'Update Key Invalid'});
				}
			} catch (error) {
				res.status(400).json({ success: false });
			}
			break;

		case 'DELETE' /* Delete a model by its ID */:
			try {
				console.log('Delete ',id)

				const deletedWebRelay = await WebRelay.deleteOne({ _id: id });
				if (!deletedWebRelay) {
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
