import http from '../http-common';

//get All Kiosks
const getAllKiosk = () => http.get('/kiosks');


// //create Kiosk
// const createKiosk = (data) => {
//   const kioskData = {
//     name: data.name,
//     model: data.model,
//     ip: data.ip,
//     streamName: data.streamName,
//     userName: data.userName,
//     password: data.password,
//     selectedWebrelay: data.selectedWebrelay,
//     location: data.location,
//   };

//   return http.post('/kiosks', cameraData);
// };

//delete Kiosk
const deleteKiosk = (id) => http.delete(`/kiosks/${id}`);



export default {
  getAllKiosk,
  // createKiosk,
  deleteKiosk,
  
};
