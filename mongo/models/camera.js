
import mongoose, { ConnectionStates } from 'mongoose';
const Schema = mongoose.Schema;


const camera = new Schema({
    name: { type: String },
    model: { type: String },
    ip: { type: String, required: true },// IP Address or Domain
    port: { type: String , default: '554'},//Rtsp Port ('554' is default internal port of IP camera) 
    path: { type: String }, // Rtsp Stream Path
    // streamName: { type: String },//Not In Use Here
    antStreamId:{ type: String }, //Ant Media StreamID
    vxg:{
      rec: { type: String , default: 'off'}, //default recording off
      allToken: { type: String },
      watchToken: { type: String },
      channel_id: { type: String },
      source: { type: String }, //Souce URL Recieved/Saved to VXG
    }, //Ant Media StreamID
    timezone: { type: String },
    userName: { type: String, required: true },
    password:{ type: String, required: true },
    selectedWebrelay: {type: String}, //Ip Address only //Not in use here
    location: { type: String },
    isFavorite:  { type: Boolean, default: false },
    aiEnabled:  { type: Boolean, default: false },
    aiTypes: {type:Array}
  },
  {
    timestamps: true,
  }
);

mongoose.models = {}; //Prevents overwrite warning

const Camera = mongoose.model('Camera', camera);

export default Camera;

