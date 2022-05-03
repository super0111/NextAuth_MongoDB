import axios from 'axios';
import dbConnect from '../../../mongo/dbConnect';

export default async function handler(req, res) {
	const { method } = req;
	// await dbConnect();
    
    ////// CONFIGURE AWS API FETCHER ///////////
    const client_id = process.env.AWS_CLIENT_ID;
    const headers = {
        'Content-Type': 'application/json',
        'X-API-Key': process.env.AWS_X_API_KEY
    }
    const instance = axios.create({
        baseURL: process.env.AWS_API_GATEWAY_URL,
        headers: headers
    });
  
	switch (method) {
		case 'GET':
			const {
				query: { id},
				method
			} = req;
			try {
                console.log('ran get lists client' + client_id)
                let fetchedLists = []
                const apiRes =  await instance.get(`/lists?client_id=${client_id }`)
                return  res.status(200).json({success: true, lists: apiRes.data.lists})
			} catch (error) {
                res.status(400).json({ success: false });
                console.log('Get Lists',error)
			}
			break;
		case 'POST': 
			try {
                console.log('List Add Request',req.body)

                const apiRes =  await  instance.post('/lists', {
                    client_id: client_id,
                    group_id: 'test-group',// Necessary use default group_id unless specified
                    title: req.body.title,
                    type: req.body.listType,
                    members: req.body.members,
                    callback_url: `${process.env.APP_URL}/api/lpr-callbacks/?type=${req.body.listType}&trigger_id=${req.body.trigger_id}&plateNum={plateNum}`
                })
                console.log('res',apiRes.data)

                return res.status(200).send({status: true, message: 'Added List'})

			} catch (error) {
				console.log(error);
				res.status(400).json({ success: false });
			}
            break;
        case 'PUT': 
			try {
                console.log('Update Lpr List'+ req.body.list_id)
                // Replace With AddMember, DeleteMember To do
                if( req.body.updateType === 'member'){
                    console.log('Ran Update List Members')

                   const apiRes =  await instance.put('/lists',{
                        list_id: req.body.list_id,
                        members: req.body.members
                    }) 
                    console.log(apiRes)
                   return res.status(200).send({success: true, list: 'List updated'})

                }else if ( req.body.updateType === 'callback'){

                    console.log('Ran Update List Callback URL')
                    console.log(req.body)
                    const { list } = req.body;
                    const apiRes =  await instance.put('/lists',{
                         list_id: list.list_id,
                         callback_url: `${process.env.APP_URL}/api/lpr-callbacks/?type=${list.type}&trigger_id=${req.body.trigger_id}&plateNum={plateNum}`
                     }) 
                     console.log(apiRes)
                    return res.status(200).send({success: true, list: 'List updated'})
                }
			
			} catch (error) {
				console.log(error);
				res.status(400).json({ success: false });
			}
            break;
        case 'DELETE': //  /api/lpr-lists
			try {
                console.log('Delete Lpr List: '+ req.body.list_id)
               const apiRes =  await instance.delete('/lists',{
                    // data key necessary for axios.delete
                    data: {
                        list_id: req.body.list_id,
                    }
                }) 
                console.log(apiRes?.data)
                return res.status(200).send({status: true, message: 'List Deleted'})
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
