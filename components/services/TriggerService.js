import http from '../http-common';


const getAllTriggers = () => http.get("triggers")


const deleteScheduledTrigger = async(id) => {
    const res = await http.delete(`/triggers/scheduled/${id}`)
    if(!res.data.success){
        return alert('Error Deleting Trigger')
    }
    return {success: res.data.success, message: res.data.message }
    
};

//Not Coreected To Do
const createScheduledTrigger = async(allValues,cron) => {
    const res = await http.post('/triggers/scheduled/',{
        cronTime: cron,
        endpoint: allValues.triggerEndpoint,
        name: allValues.triggerName,
        description: allValues.triggerDescription,
        webrelay_id: allValues.webRelay_id,
        relay_id: allValues.relay_id
    })
    if(!res.data.success){
        return alert('Error Creating Trigger')
    }
    return {success: res.data.success, message: res.data.message }
    
};


const editTriggerStatus = async(id) => {
    const res = await http.put(`/triggers/scheduled/${id}`)
    if(!res.data.success){
        return alert('Error Updating Trigger')
    }
    return {success: res.data.success, message: res.data.message }
    
};

   


export default {
    getAllTriggers,
    deleteScheduledTrigger,
    createScheduledTrigger,
    editTriggerStatus
 
  };
  