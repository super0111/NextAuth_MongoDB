import axios from 'axios';
import dbConnect from '../../../mongo/dbConnect';
import WebRelay from '../../../mongo/models/webrelay';
import xml2js from 'xml2js';

export default async function handler(req, res) {
	const { method } = req;
	// await dbConnect();
    
  
	switch (method) {
		case 'GET':
			const {
				query: {id, relay_id, action, action_type, location, location_id},
				method
			} = req;
			try {

                if(action === 'retrieve'){
                    if(action_type === 'single'){
                        console.log('Get Webrelay by Device  Id', id)
                        const webrelay = await WebRelay.findOne(
                            {_id: id}
                        ); 
                            if(!webrelay){
                                return res.status(400).json({ success: false, webrelay: webrelay});
                            }
                        console.log('Got WebRelay', webrelay )
                        return res.status(200).json({ success: true, webrelay: webrelay});
                    }else if(action_type === 'all'){
                        if(location === 'true'){
                            console.log('Get WebRelays By LocationID',location_id)
                            const webrelays = await WebRelay.find({location: location_id}).sort({ createdAt: -1 });
                            return res.status(200).json({ success: true, webrelays: webrelays });
                        }else{
                           
                            const PAGE_SIZE = 10;
                            const page = parseInt(req.query.page || "0");
                            const total = await WebRelay.countDocuments({});
                            const webrelays = await  WebRelay.find({}).sort({ createdAt: -1 })
                            .limit(PAGE_SIZE)
                            .skip(PAGE_SIZE * page);
                            
                            return res.status(200).json({
                                success: true,
                                totalPages: Math.ceil(total / PAGE_SIZE),
                                webrelays: webrelays,
                            });
                        }
                    }else{
                        return res.status(400).json({ success: false, message: 'Retrieval type not specified' });
                    }
                }else if(action === 'state'){

                    const foundWebRelay  = await WebRelay.findOne({_id: id})
                    if(!foundWebRelay){
                        return res.status(400).json({success:true, message: 'No WebRelay Found'})
                    }

                    if(foundWebRelay.model === 'Quad_OLD'){
    
                        let webRelayState = {};
                        const response = await axios.get(`http://${foundWebRelay.ip}:${foundWebRelay.port}/stateFull.xml`)
                        xml2js.parseString(response.data, (err, result) => {
                            if(err) {
                                throw err;
                            }
                            // `result` is a JavaScript object
                            // convert it to a JSON string
                            const json = JSON.stringify(result, null, 4);
                            // Set WebRelayState to current values;
                            webRelayState = Object.entries(result.datavalues);    //For webRelaxy Quad (og), cnvrt array{} => object[]
                        });
                        console.log('Retrieved WebRelay State',foundWebRelay?._id, webRelayState)
                        return res.status(200).json({success:true, webrelay: webRelayState})

                    }else if (foundWebRelay.model === 'X401'){
                       
                        let webRelayState = {};
                        const response = await axios.get(`http://${foundWebRelay.ip}:${foundWebRelay.port}/customState.json`)
                        webRelayState = [
                            response.data.relay1,
                            response.data.relay2,
                        ]
                        console.log('Retrieved WebRelay State',foundWebRelay?._id,response.data)
                        return res.status(200).json({success:true, webrelay: response.data})

                    }else if (foundWebRelay.model === 'X410'){
                       
                        let webRelayState = {};
                        const response = await axios.get(`http://${foundWebRelay.ip}:${foundWebRelay.port}/customState.json`)
                        webRelayState = [
                            response.data.relay1,
                            response.data.relay2,
                            response.data.relay3,
                            response.data.relay4
                        ]
                        console.log('Retrieved WebRelay State',foundWebRelay?._id, response.data)
                        return res.status(200).json({success:true, webrelay:  webRelayState})

                    }else{
                        return res.status(422).json({success:true, message: 'WebRelay Model Invalid'})
                    }
                   
                }else if (action === 'toggle'){
                    const foundWebRelay  = await WebRelay.findOne({_id: id}) 
                    if(!foundWebRelay){
                        return res.status(400).json({success:true, message: 'No WebRelay Found'})
                    }

                    if (action_type === 'on'){

                        if(foundWebRelay.model === 'Quad_OLD'){
                            let webRelayState = {};
                            const response = await axios.get(`http://${foundWebRelay.ip}:${foundWebRelay.port}/stateFull.xml?${relay_id}=1`) 
                            console.log( 'response error',response.status,response.data,)
                            xml2js.parseString(response.data, (err, result) => {
                                if(err) {
                                    throw err;
                                }
                                // `result` is a JavaScript object
                                // convert it to a JSON string
                                const json = JSON.stringify(result, null, 4);
                                // Set WebRelayState to current values;
                                // webRelayState = Object.entries(result.datavalues);    //For webRelaxy Quad (og), cnvrt array{} => object[]
                            });
                            console.log('Toggled On','state='+webRelayState,`relay_id: ${relay_id}`)
                            return res.status(200).json({success:true, webrelay: webRelayState})
                        }else if (foundWebRelay.model === 'X401'){
                       
                            let webRelayState = {};
                            const response = await axios.get(`http://${foundWebRelay.ip}:${foundWebRelay.port}/customState.json?${relay_id}=1.0000`)
                            webRelayState = [
                                response.data.relay1,
                                response.data.relay2,
                            ]
                            console.log('Retrieved WebRelay State',foundWebRelay?._id,response.data)
                            return res.status(200).json({success:true, webrelay: response.data})
    
                        }else if (foundWebRelay.model === 'X410'){
                            let webRelayState = {};
                            const response = await axios.get(`http://${foundWebRelay.ip}:${foundWebRelay.port}/customState.json?${relay_id}=1.0000`)
                            webRelayState = [
                                response.data.relay1,
                                response.data.relay2,
                                response.data.relay3,
                                response.data.relay4
                            ]
                            console.log('Retrieved WebRelay State',foundWebRelay?._id, response.data)
                            return res.status(200).json({success:true, webrelay:  webRelayState})
    
                        }else{
                            return res.status(422).json({success:true, message: 'WebRelay Model Invalid'})
                        }
                        
                    }else if (action_type === "off"){
                        if(foundWebRelay.model === 'Quad_OLD'){
                            let webRelayState = {};
                            const response = await axios.get(`http://${foundWebRelay.ip}:${foundWebRelay.port}/stateFull.xml?${relay_id}=0`) 
                            console.log( 'response error',response.status,response.data,)
                            xml2js.parseString(response.data, (err, result) => {
                                if(err) {
                                    throw err;
                                }
                                // `result` is a JavaScript object
                                // convert it to a JSON string
                                const json = JSON.stringify(result, null, 4);
                                // Set WebRelayState to current values;
                                // webRelayState = Object.entries(result.datavalues);    //For webRelaxy Quad (og), cnvrt array{} => object[]
                            });
                            console.log('Toggled On','state='+webRelayState,`relay_id: ${relay_id}`)
                            return res.status(200).json({success:true, webrelay: webRelayState})
                        }else if (foundWebRelay.model === 'X401'){
                       
                            let webRelayState = {};
                            const response = await axios.get(`http://${foundWebRelay.ip}:${foundWebRelay.port}/customState.json?${relay_id}=0.0000`)
                            webRelayState = [
                                response.data.relay1,
                                response.data.relay2,
                            ]
                            console.log('Retrieved WebRelay State',foundWebRelay?._id,response.data)
                            return res.status(200).json({success:true, webrelay: response.data})
    
                        }else if (foundWebRelay.model === 'X410'){
                            let webRelayState = {};
                            const response = await axios.get(`http://${foundWebRelay.ip}:${foundWebRelay.port}/customState.json?${relay_id}=0.0000`)
                            webRelayState = [
                                response.data.relay1,
                                response.data.relay2,
                                response.data.relay3,
                                response.data.relay4
                            ]
                            console.log('Retrieved WebRelay State',foundWebRelay?._id, response.data)
                            return res.status(200).json({success:true, webrelay:  webRelayState})
    
                        }else{
                            return res.status(422).json({success:true, message: 'WebRelay Model Invalid'})
                        }

                    }else if(action_type === "pulse"){
                        
                        if(foundWebRelay.model === 'Quad_OLD'){
                            let webRelayState = {};
                            const response = await axios.get(`http://${foundWebRelay.ip}:${foundWebRelay.port}/stateFull.xml?${relay_id}=2`) 
                            console.log( 'response error',response.status,response.data,)
                            xml2js.parseString(response.data, (err, result) => {
                                if(err) {
                                    throw err;
                                }
                                // `result` is a JavaScript object
                                // convert it to a JSON string
                                const json = JSON.stringify(result, null, 4);
                                // Set WebRelayState to current values;
                                // webRelayState = Object.entries(result.datavalues);    //For webRelaxy Quad (og), cnvrt array{} => object[]
                            });
                            console.log('Toggled On','state='+webRelayState,`relay_id: ${relay_id}`)
                            return res.status(200).json({success:true, webrelay: webRelayState})

                        }else if (foundWebRelay.model === 'X401'){
                       
                            let webRelayState = {};
                            const response = await axios.get(`http://${foundWebRelay.ip}:${foundWebRelay.port}/customState.json?${relay_id}=2.0000`)
                            webRelayState = [
                                response.data.relay1,
                                response.data.relay2,
                            ]
                            console.log('Retrieved WebRelay State',foundWebRelay?._id,response.data)
                            return res.status(200).json({success:true, webrelay: response.data})
    
                        }else if (foundWebRelay.model === 'X410'){
                            
                            let webRelayState = {};
                            const response = await axios.get(`http://${foundWebRelay.ip}:${foundWebRelay.port}/customState.json?${relay_id}=2.0000`)
                            webRelayState = [
                                response.data.relay1,
                                response.data.relay2,
                                response.data.relay3,
                                response.data.relay4
                            ]
                            console.log('Retrieved WebRelay State',foundWebRelay?._id, response.data)
                            return res.status(200).json({success:true, webrelay:  webRelayState})
    
                        }else{
                            return res.status(422).json({success:true, message: 'WebRelay Model Invalid'})
                        }
                    }else{
                        //  Missing Action Type
                        return res.status(400).json({success: false , message: 'No Action Type Defined!'})
                    }
                }

			} catch (error) {
                res.status(400).json({ success: false });
                console.log('WebRelay Get Error',error)
			}
            break;
        case 'POST': //  Create WebRelay
			try {
				const body = req.body
 
                const webRelayExist = await WebRelay.findOne({
                    ip: body.ip,
                    port: body.port
                });
				if (webRelayExist) {
                    console.log('Found ',webrelay)
					return res.status(301).json({ success: false, message:'Webrelay Already Exists' });
				} else {
					const webrelay = await WebRelay.create({
						name: body.name,
						location: body.location,
						ip: body.ip,
                        port: body.port,
                        model: body.model,
                        userName: body.userName,
                        password: body.password,
                        relays: body.relays
					}); /* create a new model in the database */
					return res.status(201).json({ success: true, webrelay: webrelay });
				}
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
