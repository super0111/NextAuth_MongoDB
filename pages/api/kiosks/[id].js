import dbConnect from '../../../mongo/dbConnect';
import Kiosk from '../../../mongo/models/kiosk';

export default async function handler(req, res) {
	const {
		query: { id },
		method
	} = req;
	await dbConnect();

	switch (method) {
		case 'GET' /* Get a model by its ID */:
			try {
				const kiosk = await Kiosk.findOne({_id: id});
				if (!kiosk) {
					return res.status(422).json({ success: false, message:'No Kiosk Found' });
				}
				res.status(200).json({ success: true, kiosk: kiosk});
			} catch (error) {
				res.status(400).json({ success: false });
			}
			break;

		case 'PUT' /* Edit a model by its ID */:
			try {
				console.log(id)
				const {updateVal, updateKey} = req.body
				if(updateKey === 'name'){
                    console.log('Kiosk Name Update')
                  
                    const kiosk = await Kiosk.findByIdAndUpdate(id,{
                        name:  updateVal
                    }, {
                        new: true,
                        runValidators: true
                    });
                    console.log(kiosk)
                    res.status(200).json({ success: true, data: kiosk});
                    
				}else if (updateKey === 'location'){
                    console.log('Kiosk Location Update')
                    const kiosk = await Kiosk.findByIdAndUpdate(id,{
                        name:  updateVal
                    }, {
                        new: true,
                        runValidators: true
                    });
                    console.log(kiosk)
                    res.status(200).json({ success: true, data: kiosk});
                }else{
					
                    res.status(400).json({ success: false, message: 'Update Key Invalid'});
				}
			} catch (error) {
				res.status(400).json({ success: false });
			}
			break;

		case 'DELETE' /* Delete a model by its ID */:
			try {
				console.log('Delete Kiosk ',id)

				const deletedKiosk = await Kiosk.deleteOne({ _id: id });
				if (!deletedKiosk) {
					return res.status(400).json({ success: false });
				}
				res.status(200).json({ success: true, data: deletedKiosk });
			} catch (error) {
				res.status(400).json({ success: false });
			}
			break;

		default:
			res.status(400).json({ success: false });
			break;
	}
}
