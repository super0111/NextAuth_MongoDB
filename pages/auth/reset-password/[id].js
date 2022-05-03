import { useRouter } from 'next/router';
import { useEffect } from 'react';
import ResetPassword from '../../../components/forms/ResetPassword';

export default function id(props) {
	const router = useRouter();

	return (
		<div className="w-[90%] mt-[-2rem]">
			<ResetPassword hash={router.query.id} />
		</div>
	);
}
