import axios from 'axios';
import xml2js from 'xml2js';
import dbConnect from '../../../mongo/dbConnect';
import DetectedPlate from '../../../mongo/models/detectedPlate';
import Trigger from '../../../mongo/models/trigger';
import {sendCallbackText, sendCallbackAlertText} from '../../../components/lib/sms/callbacksms';

export default async function handler(req, res) {
	const { method } = req;
    
  
	await dbConnect();

	switch (method) {
		case 'GET':
			const {
				query: {id, type, notifications,trigger_id, plateNum},
				method
			} = req;
			try {
				console.log('List Type: '+type, 'Notifications: '+notifications, 'Plates: '+ plateNum , 'trigger_id: ',trigger_id)	
				
				// Handle Plate DB Insert
				const lastPlateDetected = await DetectedPlate.find({}).sort({ createdAt: -1 }).limit(1)  
				if(lastPlateDetected?.length > 0){
					if( lastPlateDetected[0].plateNum !== plateNum){

						console.log('Ran latestPlate Insert')
						/* create a new model in the database */
						const newDetection = await DetectedPlate.create({
							plateNum: plateNum,
							list_type: type
						})
						
					}else{
						const filter = {  plateNum: plateNum };
						let sameLastPlate = await DetectedPlate.findOne(filter);
						if(sameLastPlate.detectedAmt  < 1){
							// Updates MongoDB Timestamp
							const update = { plateNum: plateNum , detectedAmt: 1 };
							let sameLastPlateUpdated = await DetectedPlate.findOneAndUpdate(filter, update);
						}else if (sameLastPlate.detectedAmt < sameLastPlate.maxConsecutive){
							console.log('Callback Limit Increment', plateNum)
							const update = { plateNum: plateNum , detectedAmt: sameLastPlate.detectedAmt + 1  };
							let sameLastPlateUpdated = await DetectedPlate.findOneAndUpdate(filter, update);
						}else{
							console.log('Callback Limit Reached Succesfully', plateNum)
							const update = { plateNum: plateNum , detectedAmt: sameLastPlate.maxConsecutive };
							let sameLastPlateUpdated = await DetectedPlate.findOneAndUpdate(filter, update);
							return res.status(200).json({status: true, message: 'Callback Limit Reached Succesfully'})
						}
					
					}
				}else{

					console.log('Ran latestPlate Insert')
					/* create a new model in the database */
					const newDetection = await DetectedPlate.create({
						plateNum: plateNum,
						list_type: type
					})

				}

					//////////////////////////////////// List Trigger Handlers ///////////////////////////  //Todo These should be handled first to reduce failure possibility

				const triggerFound = await Trigger.findOne({_id: trigger_id})
				if(!triggerFound){
					return res.status(429).json({status: false, message:'Trigger Not Found'})
				}
				// Handle Whitelist Callbacks
				if(type === 'whitelist'){

					if(triggerFound.notifications){
						console.log('Whitelist with Notifications')
						
						let webRelayState = {}
						const apiRes = await axios.get(`${triggerFound.endpoint}`)
						xml2js.parseString(apiRes.data, (err, result) => {
							if(err) {
								throw err;
							}
							// `result` is a JavaScript object
							// convert it to a JSON string
							const json = JSON.stringify(result, null, 4);
							// Set WebRelayState to current values;
							webRelayState = Object.entries(result.datavalues);    //For webRelaxy Quad (og), cnvrt array{} => object[]
						});

						 triggerFound.contact.map((member) => {
							sendCallbackText(member, plateNum).then((res) => 	console.log('sms res',res)).catch((err) => console.log('sms err',err))
						
						 })

						console.log(apiRes.status,'Webrelay Result: ',webRelayState)
						return res.status(200).json({status: true, message: 'Callback Hit Succesfully, Notifs Sent'})

					}else{	
						console.log('Whitelist No Notifications')
						
						let webRelayState = {}
						const apiRes = await axios.get(`${triggerFound.endpoint}`)
						xml2js.parseString(apiRes.data, (err, result) => {
							if(err) {
								throw err;
							}
							// `result` is a JavaScript object
							// convert it to a JSON string
							const json = JSON.stringify(result, null, 4);
							// Set WebRelayState to current values;
							webRelayState = Object.entries(result.datavalues);    //For webRelaxy Quad (og), cnvrt array{} => object[]
						});
						console.log(apiRes.status,'Webrelay Endpoint Hit: ',webRelayState)
						
						return res.status(200).json({status: true, message: 'Callback Hit Succesfully'})
					}

				// Handle Blacklist Callbacks
				}else if ( type === 'blacklist'){

					if(triggerFound.notifications){	
						console.log('Blacklist with Notifications')
		
						let webRelayState = {}
						const apiRes = await axios.get(`${triggerFound.endpoint}`)
						xml2js.parseString(apiRes.data, (err, result) => {
							if(err) {
								throw err;
							}
							// `result` is a JavaScript object
							// convert it to a JSON string
							const json = JSON.stringify(result, null, 4);
							// Set WebRelayState to current values;
							webRelayState = Object.entries(result.datavalues);    //For webRelaxy Quad (og), cnvrt array{} => object[]
						});
						console.log('ALERT!!! BLIST HIT Succesfully')
						console.log(apiRes.status,'Webrelay Result: ',webRelayState)
						
						triggerFound.contact.map((member) => {
							sendCallbackAlertText(member, plateNum).then((res) => 	console.log('sms res',res)).catch((err) => console.log('sms err',err))
						
						 })
						return res.status(200).json({status: true, message: 'BList Callback Hit Succesfully'})
					}else{
						console.log('Blacklist No Notifications')
						
						let webRelayState = {}
						const apiRes = await axios.get(`${triggerFound.endpoint}`)
						xml2js.parseString(apiRes.data, (err, result) => {
							if(err) {
								throw err;
							}
							// `result` is a JavaScript object
							// convert it to a JSON string
							const json = JSON.stringify(result, null, 4);
							// Set WebRelayState to current values;
							webRelayState = Object.entries(result.datavalues);    //For webRelaxy Quad (og), cnvrt array{} => object[]
						});
						console.log('ALERT!!! BLIST HIT No Notifications')
						console.log(apiRes.status,'Webrelay Result: ',webRelayState)

						return res.status(200).json({status: true, message: 'BList Callback Hit Succesfully'})
					}

				// Handle Custom List Type /// No FrontEnd Yet
				}else{
					if(notifications === 'true'){
						console.log('Custom List Type')
						return  res.status(200).json({status: true, message: 'Custom Callback Hit Succesfully, Notifications Sent'})
					}else{
						console.log('Custom List Type Notifications')
						return res.status(200).json({status: true, message: 'Custom Callback Hit Succesfully'})
					}
				}
				///////////////////////////////////////////////////////////////////////////////////////////

			} catch (error) {
                res.status(400).json({ success: false });
                console.log('LPR List Callback',error)
			}
			break;
		default:
			res.status(400).json({ success: false });
			break;
	}
}
