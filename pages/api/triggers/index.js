import dbConnect from '../../../mongo/dbConnect';
import Trigger from '../../../mongo/models/trigger';

export default async function handler(req, res) {
	const { query:{trigger_id}, method } = req;

	await dbConnect();

	switch (method) {
		case 'GET':
			try {
				if(trigger_id){
					const findTriggerId = await Trigger.findOne({_id: trigger_id})
					if(findTriggerId){
						console.log('Got One Trigger', findTriggerId)
						return	res.status(200).json({success:true , trigger: findTriggerId })
					}else{
						return	res.status(400).json({success:false , message: 'No Trigger Found' })
					}
				}
				console.log('Get All Triggers')
				const allTriggers = await Trigger.find({})
				return res.status(200).json({success:true , triggers: allTriggers})
				
			} catch (error) {
				res.status(400).json({ success: false });
			}
			break;
		case 'POST': //  Create Trigger
			try {
				console.log(req.body)
				const newTrigger = await Trigger.create({
					name: req.body.triggerName,
					endpoint: req.body.triggerEndpoint,
					notifications: req.body.triggerNotifications === 'true' ? true : false,
					webrelay_id: req.body.webrelay_id,
					relay_id:req.body.relay_id,
					contact: req.body.contact
				}); /* create a new model in the database */
				res.status(201).json({ success: true, trigger: newTrigger});
				console.log('New Trigger Created')
	
			
			} catch (error) {
				console.log(error);
				res.status(400).json({ success: false });
			}
	
		case 'PUT': //  Create Trigger
		const { updateVal ,updateType} = req.body;
		console.log(`Update Key ${updateType}`,req.body)
			try {
				if(updateType === 'contact'){
					
					const updatedTrigger = await Trigger.findByIdAndUpdate(trigger_id,{
						contact:  updateVal
					}, {
						new: true,
						runValidators: true
					});
					
					console.log('Trigger Contact Updated',  updatedTrigger, updateVal)

				return res.status(201).json({ success: true, trigger: updatedTrigger});
				}else if(updateType === 'name'){
					console.log('name')
				}else{
					console.log('else')
			}
			} catch (error) {
				console.log(error);
				res.status(400).json({ success: false });
			}
			break;
		case 'DELETE': //  /api/lpr-lists
			try {
				const {item_id} = req.body;
                const deletedItem = await Trigger.deleteOne({ _id: item_id });
                if (!deletedItem) {
                    return res.status(400).json({ success: false });
				}
				console.log('Deleted Item', deletedItem)
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
