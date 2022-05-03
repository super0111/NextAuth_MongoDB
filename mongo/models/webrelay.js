const mongoose = require('mongoose');

const { Schema } = mongoose;

const webrelay = new Schema({
  name: {type: String},
  model: {type: String},  // Quad_OLD (4relay) ; X401 (2relay) 
  relays: [
    {
      name: {type: String},
      relay_id: {type: String},
    },
  ],
  ip: {type: String},  // Ip Address or Domain 
  port: {type: String},
  location:{type: String},
  userName: {type: String},
  password: {type: String},
  credentials: {type: String},
},
{
  timestamps: true,
});

mongoose.models = {}; //Prevents overwrite warning

const WebRelay = mongoose.model('WebRelay', webrelay);

module.exports = WebRelay;
