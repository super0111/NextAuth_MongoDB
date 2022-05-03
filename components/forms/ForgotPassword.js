import React from 'react';
import Link from 'next/link';
import { MailIcon } from '@heroicons/react/solid';
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import axios from 'axios';

export default function ForgotPassword() {
	const [loginEmail, setLoginEmail] = React.useState('');
	const router = useRouter();

	const onSubmit = async (e) => {
		e.preventDefault();
		try{
			const res = await axios.post('/api/auth/reset-password', {
			email: loginEmail
			})
			if(res.data.success){
				alert('Check Email Inbox, Password Reset Sent')
			}
		}
		catch(err){
			alert('Password Reset Email Already Sent')
			console.log(err)
		}
	};

	const handleEmailChange = (e) => {
		e.preventDefault();
		setLoginEmail(e.target.value);
	};
	const handlePasswordChange = (e) => {
		e.preventDefault();
		setLoginPassword(e.target.value);
	};
	return (
		<div className="min-h-full flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 ">
			<div className="max-w-md w-full space-y-8">
				<div>
					<div className=" py-4 bg-white rounded-3xl shadow-2xl">
						<img
							className="mx-auto h-28 w-auto"
							src={'/assets/comp-logo.png'}
							alt="Cocoon Project"
						/>
					</div>
					<h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
						Forgot Password
					</h2>
					<p className="mt-2 text-center text-sm text-gray-600">
						Or{' '}
						<Link href="/auth/login" passHref>
							<a className="font-medium text-blue-500 hover:text-blue-500">
								click here to login
							</a>
						</Link>
					</p>
				</div>
				<form
					className="mt-8 space-y-6"
					action="#"
					method="POST"
					onSubmit={(e) => onSubmit(e)}
				>
					<input type="hidden" name="remember" defaultValue="true" />
					<div className="rounded-md shadow-sm -space-y-px">
						<div>
							<label htmlFor="email-address" className="sr-only">
								Email address
							</label>
							<input
								id="email-address"
								name="email"
								type="email"
								onChange={(e) => handleEmailChange(e)}
								autoComplete="email"
								required
								className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-secondary-main  focus:border-secondary-main  focus:z-10 sm:text-sm"
								placeholder="Enter Email Address"
							/>
						</div>
					</div>

					<div className="flex justify-end">
						{/* <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-blue-500 focus:ring-secondary-main  border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                  Remember me
                </label>
              </div> */}

						<div className="text-sm">
							<Link href="/auth/register" passHref>
								<a
									href="/auth/register"
									className="font-medium text-blue-500 hover:text-secondary-main "
								>
									Need an Account?
								</a>
							</Link>
						</div>
					</div>

					<div>
						<button
							type="submit"
							className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-500 hover:bg-secondary-main focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary-main "
						>
							<span className="absolute left-0 inset-y-0 flex items-center pl-3">
								<MailIcon
									className="h-5 w-5  group-hover:"
									aria-hidden="true"
								/>
							</span>
							Send Email
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}
