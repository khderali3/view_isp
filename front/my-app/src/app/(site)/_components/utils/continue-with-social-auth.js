'use client';

import { toast } from 'react-toastify';

import { getErrorMessage } from '@/app/public_utils/utils';




export default async function continueWithSocialAuth() {
	try {
		// const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/o/google-oauth2/?redirect_uri=http://localhost:3000/account/google`
		const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/o/google-oauth2/?redirect_uri=${process.env.NEXT_PUBLIC_FRONTEND_URL}/account/google`

		const res = await fetch(url, {
			method: 'GET',
			headers: {
				Accept: 'application/json',
			},
			credentials: 'include',
		});
		const data = await res.json();

		if (res.status === 200 && typeof window !== 'undefined') {
			window.location.replace(`${data.authorization_url}&prompt=select_account`);

		} else {
			toast.error('Something went wrong1');
		}
	} catch (err) {
		toast.error('Something went wrong2');
		toast.error(getErrorMessage(err.data || err.message) || "Something went wrong");



		console.log(err)
	}
}