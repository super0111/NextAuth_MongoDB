import dbConnect from '../../../mongo/dbConnect';
import Note from '../../../mongo/models/note';

export default async function handler(req, res) {
	const { method } = req;

	await dbConnect();

	switch (method) {
		case 'GET':
			const {
				query: { id},
				method
			} = req;
			try {
				if(id){
					const notes = await Note.find(
						{deviceId: id}
					); 
					console.log('Got Notes By Device  Id', id)
					res.status(200).json({ success: true, notes: notes });
				}else{
					const notes = await Note.find(
						{}
					); 
					res.status(200).json({ success: true, notes: notes });
				}
			} catch (error) {
				res.status(400).json({ success: false });
			}
			break;
		case 'POST': //  Create Notes
			try {
				console.log(req.body)
				const note = await Note.create({
					title: req.body.title,
					description: req.body.description,
					deviceId: req.body.deviceId
				}); /* create a new model in the database */
				console.log(note)
				res.status(201).json({ success: true, note: note});
				console.log('Note Created')
	
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
