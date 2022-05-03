import http from '../http-common';
/* eslint-disable */

const findAllUsers = () => http.get('/users');

const findUserById = (id) => http.get(`/users/${id}`);

const userRegister = (data) => {
  const userData = {
    fName: data.fName,
    lName: data.lName,
    phone: data.phone,
    email: data.email,
    password: data.password
  };

  return http.post('/users', userData);
};


const deleteUser = (id) => http.delete(`/users/${id}`);

const deleteUserVehicle = (user_id, vehicle_id) => http.put(`/users/${user_id}`,{
  key: 'deleteVehicle',
  vehicle_id: vehicle_id
});

export default {
  findAllUsers,
  findUserById ,
  userRegister,
  deleteUser,
  deleteUserVehicle 
};
