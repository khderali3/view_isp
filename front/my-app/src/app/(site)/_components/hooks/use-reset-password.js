


import { useState, useRef } from "react"
import { useResetPasswordMutation } from "@/app/(site)/_components/redux/features/authApiSlice";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

import ReCAPTCHA from "react-google-recaptcha";
import { useLocale } from "next-intl";


export default function useResetPassword() {

    const locale = useLocale()
    const router = useRouter()

    const [recaptchaValue, setRecaptchaValue] = useState('')
    const recaptchaRef = useRef(null);
    
    function onChangeRecaptcha(value) { 
      setRecaptchaValue(value)
    }




    const [resetPassword, {isLoading} ] = useResetPasswordMutation()

    const [formData, setFormData] = useState({email:'' })
    const {email} = formData

    const onChange = (event) => {
      console.log('on change is clicked')
        setFormData({...formData, [event.target.name]: event.target.value})
    }    

    const onSubmit = (event) => {
        event.preventDefault()


        if (!recaptchaValue) {
          if(locale === "ar"){
            toast.error("يرجى الضغط على انا لست روبوت");
      
          } else{
            toast.error("Please complete the CAPTCHA.");
      
          }
     
     
          return;
        }

        resetPassword({email, recaptcha_value : recaptchaValue})
        .unwrap()
        .then((data) => {
          console.log(data)
          console.log('kindly check your mailbox')
          router.push('/account/login')

          if(locale === "ar"){
            toast.success('تم ارسال ايميل لعنوان بريدك الإلكتروني يرجى التحقق')

          } else {
            toast.success('kindly check your mailbox')

          }

        })
        .catch( (error) => {
          if(locale === "ar"){
  
            toast.error('حدث خطأ في طلب إعادة ضبط كلمة المرور') 
            toast.error(JSON.stringify(error.data))

          } else {

            toast.error('error with reset password')
            toast.error(JSON.stringify(error.data))


          }
         
          console.log('reset password failed', error)
          recaptchaRef.current.reset();

        })



	};

	return {
		email,
		isLoading,
		onChange,
		onSubmit,
    ReCAPTCHA,
		onChangeRecaptcha,
		recaptchaRef,
		locale
	};
}