
import mongoose, { ConnectionStates } from 'mongoose';
const Schema = mongoose.Schema;


const location = new Schema({
    name: { type: String },
  },
  {
    timestamps: true,
  }
);

mongoose.models = {}; //Prevents overwrite warning

const Location = mongoose.model('Location', location);

export default Location;

