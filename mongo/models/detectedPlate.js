
import mongoose, { ConnectionStates } from 'mongoose';
const Schema = mongoose.Schema;

// Incoming plate
const detected_plate = new Schema({
    plateNum: { type: String },
    list_id: { type: String },
    list_type: { type: String },
    hasInterest: {type: Boolean},
    alreadyDetected:  {type: Boolean},
    detectedAmt: {type: Number, default: 0},
    maxConsecutive:{type: Number, default: 2},   //Check If Plate is Consecutively Scanned (Stuck at Gate) && Acts as Buffer with pulse trigger
  },
  {
    timestamps: true,
  }
);

mongoose.models = {}; //Prevents overwrite warning

const DetectedPlate = mongoose.model('DetectedPlate',  detected_plate);

export default DetectedPlate;

