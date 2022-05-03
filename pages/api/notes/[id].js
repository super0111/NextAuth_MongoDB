import dbConnect from '../../../mongo/dbConnect';
import Note from '../../../mongo/models/note';

export default async function handler(req, res) {
	const {
		query: { id },
		method
	} = req;
	await dbConnect();

	switch (method) {
		case 'GET' /* Get a model by its ID */:
			try {
				// console.log('Get Note:',id)
				const note = await Note.findOne({_id: id});
				// if (!camera) {
				// 	return res.status(400).json({ success: false });
				// }
				res.status(200).json({ success: true, note: note});
			} catch (error) {
				res.status(400).json({ success: false });
			}
			break;

		case 'PUT' /* Edit a model by its ID */:
			try {
				const {updateVal, updateKey} = req.body
				if(updateKey === 'deviceName'){
					console.log('Camera Name Update')
					const camera = await Camera.findByIdAndUpdate(id,{
                        name:  updateVal
                    }, {
                        new: true,
                        runValidators: true
					});
					console.log(camera)
                    res.status(200).json({ success: true, data: camera});
				}else if (updateKey === 'deviceIp'){
					console.log('Camera Ip_Address Update')
					const camera = await Camera.findByIdAndUpdate(id,{
                        ip:  updateVal
                    }, {
                        new: true,
                        runValidators: true
                    });
                    res.status(200).json({ success: true, data: camera});
				}else if (updateKey === 'devicePort'){
					console.log('Camera Port_Address Update')
					const camera = await Camera.findByIdAndUpdate(id,{
                        port:  updateVal
                    }, {
                        new: true,
                        runValidators: true
                    });
                    res.status(200).json({ success: true, data: camera});
				}else if (updateKey === 'DeviceUsername'){
					console.log('Camera UserName Update')
					const camera = await Camera.findByIdAndUpdate(id,{
                        userName:  updateVal
                    }, {
                        new: true,
                        runValidators: true
                    });
                    res.status(200).json({ success: true, data: camera});
				}else if (updateKey === 'devicePassword'){
					console.log('Camera Password Update')
					const camera = await Camera.findByIdAndUpdate(id,{
                        password:  updateVal
                    }, {
                        new: true,
                        runValidators: true
                    });
                    res.status(200).json({ success: true, data: camera});
				}else{
					console.log('Camera Stream Path Update')
					const camera = await Camera.findByIdAndUpdate(id,{
                       path:  updateVal
                    }, {
                        new: true,
                        runValidators: true
                    });
                    res.status(200).json({ success: true, data: camera});
				}
			} catch (error) {
				res.status(400).json({ success: false });
			}
			break;

		case 'DELETE' /* Delete a model by its ID */:
			try {
				console.log(id)

				const deletedCamera = await Camera.deleteOne({ _id: id });
				if (!deletedCamera) {
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
