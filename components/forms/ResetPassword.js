import React, { useState } from 'react';
import Link from 'next/link';
import { MailIcon } from '@heroicons/react/solid';
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import axios from 'axios';

export default function ResetPassword({ hash }) {
	const [loginPassword, setLoginPassword] = useState('');
	const router = useRouter();
	const { session } = useSession();
	console.log(session, 'session');

	const onSubmit = async (e) => {
		e.preventDefault();
		const res = await axios.post('/api/auth/reset-password/confirmation', {
			password: loginPassword,
			confirmation_hash: hash
		});
		if (res.data.success) {
			alert('Password Reset, Please Login');
			router.push('/auth/login');
		}
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
							alt="Company Logo"
						/>
					</div>
					<h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
						Password Reset
					</h2>
					{/* <p className="mt-2 text-center text-sm text-gray-600">
              Or{' '}
             <Link href="/auth/login" passHref>
                <a  className="font-medium text-secondary-dark hover:text-secondary-dark">
                    click here to login
                </a>
             </Link>
            </p> */}
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
							<label htmlFor="password" className="sr-only">
								New Password
							</label>
							<input
								id="password"
								name="password"
								type="password"
								onChange={(e) => handlePasswordChange(e)}
								required
								className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-secondary-main  focus:border-secondary-main  focus:z-10 sm:text-sm"
								placeholder="Enter New Password"
							/>
						</div>
					</div>

					<div className="flex justify-end">
						{/* <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-secondary-dark focus:ring-secondary-main  border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                  Remember me
                </label>
              </div> */}

						{/* <div className="text-sm">
              <Link href="/auth/register" passHref>
                    <a href="/auth/register"  className="font-medium text-secondary-dark hover:text-secondary-main ">
                    Need an Account?
                    </a>
                </Link>
              </div> */}
					</div>

					<div>
						<button
							type="submit"
							className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-secondary-dark hover:bg-secondary-main focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary-main "
						>
							<span className="absolute left-0 inset-y-0 flex items-center pl-3">
								<MailIcon
									className="h-5 w-5  group-hover:"
									aria-hidden="true"
								/>
							</span>
							Reset Password
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}
