'use client';

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from "react-toastify";

import { useActivationMutation } from '@/app/(site)/_components/redux/features/authApiSlice';

import { useParams } from 'next/navigation'

import { useLocale } from 'use-intl';


const activationAccount = ( {params} ) => {
	const router = useRouter();
	const [activation] = useActivationMutation();

    const {uid, token} = useParams()
	const locale = useLocale()



	useEffect(() => {
		// const { uid, token } = params

        console.log(uid, token)

		activation({ uid, token })
			.unwrap()
			.then(() => {
				if( locale === "ar"){
					toast.success('تم تفعيل الحساب بنجاح');

				} else {
					toast.success('Account has been activated');

				}
			})
			.catch(() => {
				if( locale === "ar"){
					toast.error('خطأ في تفعيل الحساب');

				} else {
					toast.error('Failed to activate account');

				}
			})
			.finally(() => {
				router.push('/account/login');
			});
	}, []);

    return (
        <>
        

    <div className="form account_form d-flex align-items-center justify-content-center min-vh-100   background-color ">
        <div> 
        <h1 className="text-center text-light pt-5">
			{ locale === "ar" ?
           "شركة كلاود تيك سكاي"  

			:
			"CloudTech sky Company" 

			 }
        </h1>
        <h3 className='text-success'> 
			{ locale === "ar" ? "جاري تفعيل حسابك" : "Activating your account..." }
		</h3>
        </div>
    </div>



        </>
    )
}

export default activationAccount
