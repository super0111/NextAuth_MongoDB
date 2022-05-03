import mongoose, { ConnectionStates } from 'mongoose';
const Schema = mongoose.Schema;

const user = new Schema({
	fName: {
		type: String,
		required: true
	},
	lName: {
		type: String,
		required: true
	},
	email: {
		type: String, // Handle Required on Frontend for User Accounts
	},
	phone: {
		type: String,
	},
	password: {
		type: String, // Handle Required on Frontend for User Accounts
	},
	stripeId: {
		type: String,
	},
	userType: {
		type: Number,
		default: 2 //  0 (admin)    1 (manager)  2 (staff)   3(tenant)  100(Register Form Select Error)
	},
	hasVehicle: {
		type: Boolean,
		default: false 
	},
	vehicles: [
		{
			vehicle_id: {type: String}, 
		}
	]
	
},{
	timestamp: true
}
);

mongoose.models = {}; //Prevents overwrite warning

const User = mongoose.model('User', user);

export default User;
