import React from 'react';
import useSWR from 'swr';
import SignupForm from '../../components/forms/SignupForm';

export default function Register(props) {
	return (
		<div className="w-full">
			<SignupForm   />
		</div>
	);
}
