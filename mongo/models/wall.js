import mongoose, { ConnectionStates } from 'mongoose';
const Schema = mongoose.Schema;

const wall = new Schema({
	name: {
		type: String,
		
    },
    cameras:{
        type: Array,
    },
    pin:{
        type: String,
    }
	
},
{
    timestamps: true,
});

mongoose.models = {}; //Prevents overwrite warning

const Wall = mongoose.model('Wall', wall);

export default Wall;
