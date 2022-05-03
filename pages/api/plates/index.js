import dbConnect from '../../../mongo/dbConnect';
import DetectedPlate from '../../../mongo/models/detectedPlate';

export default async function handler(req, res) {
    const { 
        query:{ id, fetch },
        method 
    } = req;

    await dbConnect();
    // const allDetections = await DetectedPlate.find({})
    // const latestPlatesDetected = await DetectedPlate.find().sort({ createdAt: -1 }).limit(10)  
    // const lastPlateDetected = await DetectedPlate.find({}).sort({ createdAt: -1 }).limit(1)  

	switch (method) {
		case 'GET':
			try {

                if(fetch === 'latest_plate'){
                    console.log('Fetch Latest Plate')
                    const lastPlateDetected = await DetectedPlate.find({}).sort({ createdAt: -1 }).limit(1)  
                    return res.status(200).json({success: true, plate: lastPlateDetected[0]})
                }else{
                    const allDetections = await DetectedPlate.find({}).sort({ createdAt: -1 })
                    return res.status(200).json({success: true, plates: allDetections})
                }
				
			} catch (error) {
                console.log(error)
				res.status(400).json({ success: false });
			}
			break;
		case 'POST': //  Create Trigger
			try {
			
				console.log('Trigger Created')
	
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
