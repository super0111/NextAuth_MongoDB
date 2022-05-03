import http from '../http-common';
/* eslint-disable */

//get All WebRelays
const getAllWebRelay = () => http.get('/webrelays?action=retrieve&action_type=all');

//get All WebRelays
const getAllWebRelayLocation = (location) => http.get(`/webrelays?action=retrieve&action_type=all&location=true&location_id=${location}` );

//get Single WebRelay
const getWebRelay = (id) => http.get(`/webrelays/${id}`);



//create WebRelay
const createWebRelay = (data) => {
  const webRelayData = {
    name: data.name,
    model: data.model,
    ip: data.ip,
    streamName: data.streamName,
    userName: data.userName,
    password: data.password,
    selectedWebrelay: data.selectedWebrelay,
    location: data.location,
  };

  return http.post('/webrelays', webRelayData);
};

//delete Camera
const deleteWebRelay = (id) => http.delete(`/webrelays/${id}`);



export default {
  getAllWebRelay,
  getAllWebRelayLocation,
  getWebRelay,
  createWebRelay,
  deleteWebRelay,
};
