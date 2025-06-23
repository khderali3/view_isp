'use client'
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';


import { setAuth, finishIntialLoad, setloginFirstName, setprofileImage } from '@/app/(site)/_components/redux/features/authSlice';

import { useVerifyMutation, useRetrieveUserQuery } from '@/app/(site)/_components/redux/features/authApiSlice';



export default function useVerify() {
	const dispatch = useDispatch();
	const router = useRouter();

	const [verify] = useVerifyMutation();
	const {data, isLoading, isFetching } = useRetrieveUserQuery();

	useEffect(() => {
		verify()
			.unwrap()
			.then(() => {
				dispatch(setAuth());
				if (data?.first_name) {
					dispatch(setloginFirstName(data?.first_name))
				}
				if(data?.profile.PRF_image){
					dispatch(setprofileImage(data?.profile.PRF_image))
				}

			})
			.finally(() => {
				dispatch(finishIntialLoad());
			});

			


	}, [data]);




}


