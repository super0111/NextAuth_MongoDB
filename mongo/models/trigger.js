
import mongoose, { ConnectionStates } from 'mongoose';
const Schema = mongoose.Schema;

// Not In Use, Todo: create add triggers UI and add triggers to List

const trigger = new Schema({
    name: { type: String },
    list_id: { type: String },
    endpoint: { type: String },
    webrelay_id: { type: String },
    relay_id: { type: String },
    notifications: { type: Boolean },
    contact: [{ phone: {type: String} }]
  },
  {
    timestamps: true,
  }
);

mongoose.models = {}; //Prevents overwrite warning

const Trigger = mongoose.model('Trigger', trigger);

export default Trigger;

