import mongoose, { ConnectionStates } from 'mongoose';
const Schema = mongoose.Schema;

// Not In Use, Todo: create add triggers UI and add triggers to List

const scheduledTrigger = new Schema({
   cron_id: { type: String },
   name: { type: String },
   description: { type: String },
   webrelay_id: { type: String },
   relay_id: { type: String },
   isEnabled: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  }
);

mongoose.models = {}; //Prevents overwrite warning

const ScheduledTrigger = mongoose.model('ScheduledTrigger', scheduledTrigger);

export default ScheduledTrigger;

