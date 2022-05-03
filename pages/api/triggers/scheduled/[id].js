import axios from "axios";
import ScheduledTrigger from '../../../../mongo/models/scheduledTrigger';

export default async function handler(req, res) {
	const { 
            query:{id}, 
            method 
        } = req;


    const instance = axios.create({
        baseURL: process.env.CRON_API_URL,
        });

	switch (method) {
		
        case 'DELETE':
            try {

                const apiRes = await instance.get('delete', {
                  params: {
                    token: process.env.CRON_TOKEN,
                    id: id,
                  },
                })
                const deletedItem = await ScheduledTrigger.deleteOne({ cron_id: id }); // Scheduled Task
                if (!deletedItem) {
                    return res.status(400).json({ success: false });
				        }
                console.log('Deleted Schedule',deletedItem,apiRes.data)
                return res.status(200).json({success: true, schedules : apiRes.data});
            } catch (error) {
                console.log('Get Schedules Error',error)
                res.status(400).json({ success: false });
            }
            break;
        case 'PUT':
            try {
                const foundItem = await ScheduledTrigger.findOne({ cron_id: id }); // Scheduled Task
                if (!foundItem) {
                    return res.status(400).json({ success: false, message: 'No Schedule Trigger Found' });
                }
                if(foundItem.isEnabled === true){
                    foundItem.isEnabled = false
                    await foundItem.save()
                    const apiRes = await instance.get('disable', {
                        params: {
                          token: process.env.CRON_TOKEN,
                          id,
                        },
                    })
                    console.log('Edit Schedule Off',apiRes.data)
                    return res.status(200).json({success: true, schedules : apiRes.data});
                }else{
                    foundItem.isEnabled = true
                    await foundItem.save()
                    const apiRes = await instance.get('enable', {
                        params: {
                          token: process.env.CRON_TOKEN,
                          id,
                        },
                      })
                    console.log('Edit Schedule On',apiRes.data)
                    return res.status(200).json({success: true, schedules : apiRes.data});
                }
                
            } catch (error) {
                console.log('Get Schedules Error',error)
                res.status(400).json({ success: false });
            }
            break;
		default:
			res.status(400).json({ success: false });
			break;
	}
}
