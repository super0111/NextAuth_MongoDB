
import mongoose, { ConnectionStates } from 'mongoose';
const Schema = mongoose.Schema;

// Kiosk
const kiosk = new Schema({
    kiosk_id: { type: String },
    camera_id: { type: String },
    webrelay_id: { type: String },
    name: {type: String},
    location: {type: Object},
    deviceType: {type: String, default:'Ipad'}, 
  },
  {
    timestamps: true,
  }
);

mongoose.models = {}; //Prevents overwrite warning

const Kiosk = mongoose.model('Kiosk', kiosk);

export default Kiosk;

