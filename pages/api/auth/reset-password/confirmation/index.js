import dbConnect from '../../../../../mongo/dbConnect';
import User from '../../../../../mongo/models/user';
import AccessHash from '../../../../../mongo/models/accessHash';
import { hash } from 'bcryptjs';

export default async function handler(req, res) {
	const {
		query: { id },
		method
	} = req;

	await dbConnect();

	switch (method) {
		case 'POST' /* Edit a model by its ID */:
			const { password, confirmation_hash } = req.body;
			console.log('Ran Password Confirm');
			try {
				const aHash = await AccessHash.findOne({
					_id: confirmation_hash
				});
				if (!aHash || !aHash.user_id) {
					return res.status(422).send('Cannot reset a password!');
				}
				console.log(aHash);
				const userFound = await User.findOne({ _id: aHash.user_id });
				if (!userFound) {
					return res
						.status(422)
						.send({
							success: false,
							message: 'Cannot reset a password!'
						});
				}
				await aHash.remove();
				const hashedPass = await hash(password, 12);
				userFound.password = hashedPass;
				const updatedUser = await userFound.save();
				// const updatedUser = new User({...userFound, hashedPass});
				return res
					.status(200)
					.json({
						success: true,
						message: 'Password has been reset!'
					});
			} catch (error) {
				res.status(400).json({ success: false });
				console.log(error);
			}
			break;

		default:
			res.status(400).json({ success: false });
			break;
	}
}
