// components/common/MenuProvider.js
import { useSession } from 'next-auth/react';
import { createContext, useContext } from 'react'
import useSWR from 'swr';

// Create Context object.
const AuthContext = createContext()


async function fetcherFunc(url){
	const res = await fetch(url);
	return res.json();
  } 
  
// Export Provider
export function UserAuthProvider(props) {
    const { children} = props
    const {data: session, status} = useSession()
    const url = `/api/users?email=${session.user.email}`;
    const { data: userData,error } = useSWR(url, fetcherFunc, {initialProps: props});
    // console.log('Admin Session',session,status, user)

    if(error) return <h1>User Failed 2nd Verification Method</h1>
    if(!userData) return <h1>Validating User Session....</h1>
	return (
	   <AuthContext.Provider value={{ user: userData.user , status:status  }} >
	   	{children}
	   </AuthContext.Provider>
	)
}

// Export useContext Hook.
export function useAuthContext() {
	return useContext(AuthContext);
}

