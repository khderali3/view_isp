'use client';

import { useGoogleMutation } from '@/app/(site)/_components/redux/features/authApiSlice';
import { useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { setAuth, setloginFirstName, setIs_staff, setIs_superuser } from '@/app/(site)/_components/redux/features/authSlice';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { jwtDecode} from 'jwt-decode';

import { Suspense } from 'react'

import { useLocale } from 'next-intl';

import { getErrorMessage } from '@/app/public_utils/utils';



 function LoadPage() {

	const locale = useLocale()
	const [googleAuthenticate] = useGoogleMutation();

	const dispatch = useDispatch();
	const router = useRouter();
	const searchParams = useSearchParams();

	const effectRan = useRef(false);

	useEffect(() => {
		const state = searchParams.get('state');
		const code = searchParams.get('code');

		if (state && code && !effectRan.current) {
			googleAuthenticate({state, code })
				.unwrap()
				.then((data) => {


					const token_info = jwtDecode(data.access)
					const user_first_name = token_info.first_name

					dispatch(setloginFirstName(user_first_name))  
					dispatch(setIs_staff(token_info?.is_staff))  
					dispatch(setIs_superuser(token_info?.is_superuser))  



					dispatch(setAuth());

					if(locale === "ar"){
						toast.success('تم تسجيل الدخول بحساب جوجل بنجاح');

					}else {
						toast.success('Logged in succusfuly with google account');

					}
					router.push('/');
				})
				.catch((errors) => {
					console.log(errors)
					
					if(locale === "ar"){
						toast.error('فشل في تسجيل الدخول بحساب جوجل');

					} else {
						toast.error('Failed to log in with google ');

					}

					toast.error(getErrorMessage(errors.data || errors.message) || "Something went wrong");


					router.push('/account/login');
				});
		}

		return () => {
			effectRan.current = true;
		};
	}, []);


	return (
		<div className=" d-flex align-items-center justify-content-center background-color   " style={{ height: "100vh" }}>
			<h1 className='text-light'> 
				{locale === "ar" ?
				'جاري تسجيل الدخول بحساب جوجل....'
				:
				'Logging in with google account ....'  

				}
			</h1>
		</div>



	);
}


export default function Page() {
	return (
	  <Suspense>
		<LoadPage />
	  </Suspense>
	)
  }