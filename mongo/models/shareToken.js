import mongoose, { ConnectionStates } from 'mongoose';
const Schema = mongoose.Schema;

const shareToken = new Schema({
    
    expiration: {
	  type: String,
		
    },
   camera_id: {
      type: String,
    },
    user_id:{
        type: String,
    }
    
	
},
{
    timestamps: true,
});

mongoose.models = {}; //Prevents overwrite warning

const ShareToken = mongoose.model('ShareToken', shareToken);

export default ShareToken;
