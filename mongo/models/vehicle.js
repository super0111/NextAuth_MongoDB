import mongoose, { ConnectionStates } from 'mongoose';
const Schema = mongoose.Schema;

const vehicle = new Schema({
    year: {type: String},
    make: {type: String},
    model: {type: String},
    list_id: {type: String},
    plateNum: {type: String},	
    isParked: {type: Boolean, default: false}
},{
	timestamp: true
}
);

mongoose.models = {}; //Prevents overwrite warning

const Vehicle = mongoose.model('Vehicle', vehicle);

export default Vehicle;
