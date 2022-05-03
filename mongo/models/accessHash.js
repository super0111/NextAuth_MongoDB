import mongoose, { ConnectionStates } from 'mongoose';
const Schema = mongoose.Schema;

const accessHash = new Schema({
	user_id: {
		type: String
	},
	session_id: {
		type: String
	},
	payment_id: {
		type: String
	},
	expiresAt: {
		type: Date,
		default: Date.now
	}
});

mongoose.models = {}; //Prevents overwrite warning

const AccessHash = mongoose.model('AccessHash', accessHash);

export default AccessHash;

// Used for Reset Password AND Stripe Payment Cancel