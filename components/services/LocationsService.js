import http from '../http-common';

//get All Locations
const getAllLocation = () => http.get('/locations');

//get One Lcoation
const getLocation = (id) => http.get(`/locations/${id}`)

//create Location
const createLocation = (data) => {
  const locationData = {
    name: data.name,
    
  };

  return http.post('/locations', locationData);
};


//update Location
const updateLocation = (data) => {
    const locationData = {
      updateKey: data.updateKey,
      updateValue: data.updateValue,
      
    };
  
    return http.post('/locations', locationData);
  };

//delete Location
const deleteLocation = (id) => http.delete(`/locations/${id}`);



export default {
  getAllLocation,
  getLocation,
  createLocation,
  updateLocation,
  deleteLocation,
  
};
