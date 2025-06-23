'use client';

import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import useVerify from "../hooks/use-verify";
import { useLocale } from "next-intl";

const StaffSetup = () => {
    const locale = useLocale()
    const isRTL =  locale === 'ar' ? true : false  

    useVerify();
    return < ToastContainer rtl={isRTL} pauseOnFocusLoss={false}/>
} 

export default StaffSetup