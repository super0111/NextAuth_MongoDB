import React, { useEffect } from 'react';
import Link from 'next/link';
import { LockClosedIcon } from '@heroicons/react/solid'
import { useRouter } from 'next/router';

export default function SignupForm() {
  const router = useRouter()
  const [registerEmail, setRegisterEmail] = React.useState('');
  const [registerPhone, setRegisterPhone] = React.useState('')
  const [registerPassword, setRegisterPassword] =React.useState('');
	const [userfName, setUserfName] = React.useState('');
  const [userlName, setUserlName] = React.useState('');
  const [isRegistered, setIsRegistered] = React.useState(false)
  
  useEffect(() => {
    if(isRegistered){
      alert('Thanks For Signing Up! Please Login')
      router.push('/auth/login')
    }
  }, [isRegistered])
  
  const register = async (e) => {
    e.preventDefault()
		// try {
			if(!registerEmail || !registerEmail.includes('@') || !registerPassword){
				alert('Invalid details');
				return;
			}
			const url = '/api/auth/signup';
			const res = await fetch(url, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					email: registerEmail,
          password: registerPassword,
          phone: registerPhone,
					fName: userfName,
					lName: userlName
				})
			})
				.then(function (res) {
					// The response is a Response instance.
          // You parse the data into a useable format using `.json()`
          if (res.ok) {
            return res.json();
          }
          return Promise.reject(res); 
				})
				.then(function (data) {
          console.log(data,'data')
					// `data` is the parsed version of the JSON returned from the above endpoint.
					setIsRegistered(true)
				}).catch((res) => {
          res.json().then((json) => {
           alert(json.message)
           console.log('Error:',json.message)
          })
        });
		// } catch (err) {
    //   alert(err)
		// 	console.log(err.message, 'err');
		// }
  };
  const handlefNameChange = (e) => {
    e.preventDefault();
    setUserfName(e.target.value)
  }
  const handlelNameChange = (e) => {
    e.preventDefault();
    setUserlName(e.target.value)
  }
  const handleEmailChange = (e) => {
    e.preventDefault();
    setRegisterEmail(e.target.value)
  }
  const handlePhoneChange = (e) => {
    e.preventDefault();
    setRegisterPhone(e.target.value)
  }
  const handlePasswordChange = (e) => {
    e.preventDefault();
    setRegisterPassword(e.target.value)
  }
    return (
      <div className="min-h-full flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 ">
        <div className="max-w-md w-full space-y-8">
          <div>
          <div className="p-2 shadow-2xl bg-white rounded-2xl">
            <img
                className="mx-auto h-28 w-auto"
                src={"/assets/comp-logo.png"}
                alt="Comp. Logo"
              />
           </div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Sign Up</h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Or{' '}
             <Link href="/auth/login" passHref>
                <a href="/auth/login" className="font-medium text-blue-500 hover:text-blue-500">
                    click here to login
                </a>
             </Link>
            </p>
          </div>
          <form className="mt-8 space-y-6" action="#" method="POST" onSubmit={(e) => register(e)}>
            <input type="hidden" name="remember" defaultValue="true" />
            <div className="rounded-md shadow-sm -space-y-px">
             <div>
                <label htmlFor="email-address" className="sr-only">
                  First Name
                </label>
                <input
                  id="first-name"
                  name="First-Name"
                  type="name"
                  autoComplete="given-name"
                  required
                  onChange={(e) => handlefNameChange(e)}
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                  placeholder="First Name"
                />
              </div>
              <div>
                <label htmlFor="email-address" className="sr-only">
                  Last Name
                </label>
                <input
                  id="last-name"
                  name="Last-Name"
                  type="name"
                  autoComplete="family-name"
                  required
                  onChange={(e) => handlelNameChange(e)}
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                  placeholder="Last Name"
                />
              </div>
              <div>
                <label htmlFor="email-address" className="sr-only">
                  Email address
                </label>
                <input
                  id="email-address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  onChange={(e) =>handleEmailChange(e)}
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                  placeholder="Email address"
                />
              </div>
              <div>
                <label htmlFor="phone" className="sr-only">
                  Phone Address
                </label>
                <input
                  id="phone-number"
                  name="phone"
                  type="phone"
                  // autoComplete="none"
                  required
                  onChange={(e) =>handlePhoneChange(e)}
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                  placeholder="Phone Number"
                />
              </div>
              <div>
                <label htmlFor="password" className="sr-only">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  onChange={(e) =>handlePasswordChange(e)}
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                  placeholder="Password"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-blue-500 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                  Remember me
                </label>
              </div>
              <div className="text-sm p-2">
                <a href="#" className="font-medium text-blue-500 hover:text-blue-500">
                  Forgot your password?
                </a>
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-500 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                  <LockClosedIcon className="h-5 w-5 text-blue-500 group-hover:text-indigo-400" aria-hidden="true" />
                </span>
                  Signup
              </button>
            </div>
          </form>
        </div>
      </div>
    )
}
