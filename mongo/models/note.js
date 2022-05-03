import mongoose, { ConnectionStates } from 'mongoose';
const Schema = mongoose.Schema;

const note = new Schema({
	  title: {
		type: String,
		
    },
    deviceId: {
      type: String,
    },
    description: {
		type: String,
		
    },
    timeSelected: {
        type: String,
    }
	
},
{
    timestamps: true,
});

mongoose.models = {}; //Prevents overwrite warning

const Note = mongoose.model('Note', note);

export default Note;
