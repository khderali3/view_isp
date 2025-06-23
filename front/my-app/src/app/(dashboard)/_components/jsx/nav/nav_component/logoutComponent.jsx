
'use client';

import { useDispatch } from "react-redux"
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

import { useLogoutMutation } from '@/app/(dashboard)/_components/redux_staff/features/authApiSlice';
import {setLogout } from '@/app/(dashboard)/_components/redux_staff/features/authSlice';


import { useLocale } from "next-intl";

const LogoutLink = ({link_name="logout"}) => {

    const locale = useLocale()
    const router = useRouter()
    const [logout] = useLogoutMutation();
    const dispatch = useDispatch();

      const handleLogout = (event) => {
        event.preventDefault()
        logout()
          .unwrap()
          .then(() => {
            console.log('log out clicked')
            dispatch(setLogout());
            if(locale === "ar"){
              toast.success('تم تسجيل الخروج بنجاح')

            } else{
              toast.success('you have loged out succusfuly')

            }
            router.push('/staff/account/login')
          })
          .catch( () => {
            console.log('logout failed')
            if(locale === "ar"){
              toast.error('فشل في تسجيل الخروج')

            } else {
              toast.error('field to logout!')

            }
          })
      };





        return(
          <>
        <a className="btn mt-2   w-100" href="#" onClick={handleLogout}>
          {link_name}
        </a>
          </>
        )
}

export default LogoutLink