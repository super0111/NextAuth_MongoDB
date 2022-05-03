import dbConnect from '../../../../mongo/dbConnect';
import User from '../../../../mongo/models/user';
import AccessHash from '../../../../mongo/models/accessHash';
import {
	sendConfirmationEmail,
	sendResetPasswordEmail
} from '../../../../lib/mailer';
import { hash } from 'bcryptjs';

export default async function handler(req, res) {
	const {
		query: { id },
		method
	} = req;

	await dbConnect();

	switch (method) {
		case 'GET' /* Get a model by its ID */:
			try {
			} catch (error) {
				res.status(400).json({ success: false });
			}
			break;

		case 'POST' /* Edit a model by its ID */:
			const { email } = req.body;

			try {
				const user = await User.findOne({ email: email });
				if (!user) {
					return res.status(422).send("User doesn't exists!");
				}
				const hasHash = await AccessHash.findOne({ user_id: user._id });
				if (hasHash) {
					return res
						.status(422)
						.send('Email to reset password was already sent!');
				}
				const hash = new AccessHash({ user_id: user._id });
				await hash.save();
				
				 res.status(200).json({
					 	success:true,
						message:
							'Please check your email to reset the password!'
					});
				await sendResetPasswordEmail({ toUser: user, hash: hash._id }); //Mailgun Function

					console.log('ran ', res)
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
