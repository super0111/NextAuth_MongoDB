import axios from "axios";
import dbConnect from '../../../../mongo/dbConnect';
import ScheduledTrigger from '../../../../mongo/models/scheduledTrigger';

export default async function handler(req, res) {
	const { 
            query:{id}, 
            method 
        } = req;

    
    const instance = axios.create({
        baseURL: process.env.CRON_API_URL,
        });
    
    await dbConnect();
	switch (method) {
		case 'GET':
			try {
                console.log('Get Scheduled Triggers',`"${process.env.CRON_TOKEN}"`,`"${process.env.CRON_GROUP_ID}"`)
               const apiRes = await instance.get('list', {
                    params: {
                        token: process.env.CRON_TOKEN,
                        group_id: process.env.CRON_GROUP_ID,
                        sortby: 'cronId',
                        order: 'asc',
                    },
                })
                const allTriggers = await ScheduledTrigger.find({})                
                console.log('Fetched Schedules',apiRes.data)
                return res.status(200).json({success: true , schedules : apiRes.data.cron_jobs, dbSchedules: allTriggers});
                
			} catch (error) {
				console.log('Get Schedules Error', error)
				res.status(400).json({ success: false });
            }
            break;
        case 'POST':
            try {
               
            const {
               endpoint, description ,  name, cronTime,  webrelay_id, relay_id
                } = req.body;
                console.log('Create Schedule Trigger Request')
                // Handle Per WebRelay Model
                // Generate the URL for controlling relay
                const url = endpoint;
            
                // Schedule the task
                const apiRes = await instance.get('add', 
                    { params: {
                            token: process.env.CRON_TOKEN,
                            cron_expression: cronTime,
                            timezone_from : "1",
                            description: description,
                            url: endpoint,
                            cron_job_name: name,
                            group_id: process.env.CRON_GROUP_ID,
                        },
                    })
                console.log(apiRes.data)
                if(!apiRes.data.status === 'success'){
                    return res.status(429).json({success: false, message : 'Could Not Create Schedule'});
                }else{
                    const newTrigger = await ScheduledTrigger.create({
                        name: name,
                        description: description,
                        webrelay_id: webrelay_id,
                        relay_id: relay_id,
                        cron_id: apiRes.data.cron_job_id
                    }); /* create a new model in the database */
                    return res.status(200).json({success: true, schedules : apiRes.data});
            }
                
            } catch (error) {
                console.log(error)
                console.log('Create Schedules Error')
                res.status(400).json({ success: false });
            }
            break;   

           
		default:
			res.status(400).json({ success: false });
			break;
	}
}
