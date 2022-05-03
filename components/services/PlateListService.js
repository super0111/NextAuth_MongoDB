import http from '../http-common';

//get All Locations
const updateListMembers = (list_id, members) => http.put('/lpr-lists',
    {
        list_id: list_id,
        members: members,
        updateType:'member'
    }
);

const deleteListMember = async(list_id, member) => {
    console.log('Ran Delete Plate', member, 'list', list_id)
    const res = await http.get('/lpr-lists');
    console.log(res)
    let filteredList = res.data.lists.filter((list) => list.list_id === list_id)[0]
    let filteredMembers = filteredList?.members.filter((plateNum) => plateNum !== member)
    if (!res.data.success || filteredList === undefined){
        return alert('Could Not Delete Plate')
    }else{
    console.log(filteredList, filteredMembers)
    const updateRes = await updateListMembers(list_id,filteredMembers !== (null || undefined) ? filteredMembers : filteredList.members) //IF FilteredMembers undefined dont update list
    return {success: updateRes.data.success}
           
    }
    
};


export default {
    updateListMembers,
    deleteListMember
  };
  