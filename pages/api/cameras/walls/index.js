import axios from 'axios';
import dbConnect from '../../../../mongo/dbConnect';
import Wall from '../../../../mongo/models/wall';
import Camera from '../../../../mongo/models/camera';

import { customAlphabet } from 'nanoid'

export default async function handler(req, res) {
    const {
        query: { id, key, wallPin}, 
        method 
    } = req;
	
	await dbConnect();

	switch (method) {
        case 'GET':
			
            
			try {
                if(key === 'wallPinAuth'){
                    console.log('wallPinAuth',wallPin)
                    const wallFound = await Wall.findOne({ pin: wallPin })
                    const fetchedCameras = await Camera.find({})
                    console.log(fetchedCameras)
                    let matchedCams = []
                    //This returns null after stale todo: fix
                    wallFound.cameras.map((cam) => {
                        if( fetchedCameras.filter((camera) => camera._id.toString() === cam.camera_id).length > 0 ){
                            matchedCams.push(fetchedCameras.filter((camera) => camera._id.toString() === cam.camera_id)[0])
                        }
                    })
                    return  res.status(200).json({success:true , wall: wallFound, cameras: matchedCams })
                }
                
                const wallsFound = await Wall.find({})
                if(!wallsFound){
                    return res.status(422).json({success:false, message: 'No Walls Found'})
                }
                return  res.status(200).json({success:true , walls: wallsFound})
                
			} catch (error) {
                console.log('Wall Find Error', error)
				res.status(400).json({ success: false });
			}
			break;
		case 'POST':
            const { name, cameras } = req.body;

			try {
                const foundWall = await Wall.findOne({name: name});
                if(foundWall){
                    return res.status(422).json({success:false , message:'No Wall Found'})
                }
                const nanoid = customAlphabet('1234567890abcdef', 7)

                let camArr = []
                cameras.map((cam) => (
                    camArr.push({
                        camera_id: cam._id,
                        name: cam.name,
                        location:cam.location
                    })
                ))
                const wall = await Wall.create({
                    name: name,
                    cameras: camArr,
                    pin: nanoid()
                })
                console.log('Wall Created!')

               return  res.status(201).json({success:true , wall: wall})
                
			} catch (error) {
                console.log('Wall Create Error', error)
				res.status(400).json({ success: false });
			}
			break;
		
		default:
			res.status(400).json({ success: false });
			break;
	}
}
