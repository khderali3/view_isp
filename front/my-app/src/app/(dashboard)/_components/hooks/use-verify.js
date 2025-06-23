'use client'
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';


import { setAuth, finishIntialLoad, setloginFirstName,setIsUserId, 
	 setprofileImage , setIsStaff , setIsSupserUser, setGroups, setPermissions, setDepartments
		} from '@/app/(dashboard)/_components/redux_staff/features/authSlice';

import { useVerifyMutation } from '@/app/(dashboard)/_components/redux_staff/features/authApiSlice';



export default function useVerify() {
	const dispatch = useDispatch();
	const [verify] = useVerifyMutation();

	useEffect(() => {
		verify()
			.unwrap()
			.then(( response ) => {
				dispatch(setAuth());
				dispatch(setloginFirstName(response.firstname))
				dispatch(setIsUserId(response.user_id))
				dispatch(setprofileImage(response.PRF_image)) 
				dispatch(setIsStaff(response.is_staff)) 
				dispatch(setIsSupserUser(response.is_superuser)) 
				dispatch(setGroups(response.groups)) 
				dispatch(setPermissions(response.permissions)) 
				dispatch(setDepartments(response.departments)) 

			})
			.finally(() => {
				dispatch(finishIntialLoad());
			});
	}, []);

}


