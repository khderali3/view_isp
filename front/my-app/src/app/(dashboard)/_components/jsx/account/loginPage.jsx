'use client'
import { useState, useRef } from "react"
import { toast } from "react-toastify"
import { useRouter } from 'next/navigation';

import { useCustomFetchMutation } from "@/app/(dashboard)/_components/redux_staff/features/authApiSlice";
import { useDispatch } from 'react-redux';
import { setAuth,finishIntialLoad,setloginFirstName,setprofileImage,setIsStaff,setIsSupserUser,setGroups,setPermissions, setDepartments, setIsUserId   } from '@/app/(dashboard)/_components/redux_staff/features/authSlice';

import ReCAPTCHA from "react-google-recaptcha";

import { useLocale, useTranslations } from "next-intl";



const LoginPageComponent = () => {

  const [form, setForm] = useState({
    email: '',
    password: ''
  })

  const [customFetch] = useCustomFetchMutation();
	const dispatch = useDispatch();
	const router = useRouter();
  const t = useTranslations('dashboard.account.login')
  const locale = useLocale()
  const [recaptchaValue, setRecaptchaValue] = useState('')
  const recaptchaRef = useRef(null);
  const [isSubmitting, setIsSubmitting] = useState(false)

  function onChangeRecaptcha(value) {
 
    setRecaptchaValue(value)
  }

  

  const handleChange = (e) => {
    setForm( (prevState) => {
      return {...prevState, [e.target.name] : e.target.value}
      })
  }


 


  const handlesubmit = async (e) => {
    e.preventDefault()

      setIsSubmitting(true)
      const formdata = new FormData();
      formdata.append("email", form.email);
      formdata.append("password", form.password);

 
      if (!recaptchaValue) {
        if(locale === "ar"){
          toast.error("يرجى الضغط على انا لست روبوت");

        } else{
          toast.error("Please complete the CAPTCHA.");

        }
        // recaptchaRef.current.reset();
        setIsSubmitting(false)
        return;
      }
      formdata.append("recaptcha_value", recaptchaValue);

 
      if (form.email.trim() !== '' 
      && form.password.trim() !== ''
    ) {

      try {
        // Send form data using customFetch mutation
        const response = await customFetch({
          url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/staff/auth/create/`,
          method: "POST",
          body: formdata, // Send FormData as the body
        });
  
        if (response && response.data) {
          console.log('response.data', response.data)
          if(response.data.is_staff === true || response.data.is_superuser === true){
            dispatch(setAuth());
            dispatch(setloginFirstName(response.data.firstname))
            dispatch(setIsUserId(response.data.user_id))
            dispatch(setprofileImage(response.data.PRF_image)) 
            dispatch(setIsStaff(response.data.is_staff)) 
            dispatch(setIsSupserUser(response.data.is_superuser)) 
            dispatch(setGroups(response.data.groups)) 
            dispatch(setPermissions(response.data.permissions)) 
            dispatch(setDepartments(response.data.departments)) 
            toast.success('Logged in');
            router.push('/staff');

          } else {
            if(locale === "ar"){
              toast.error("ليس لديك صلاحيات للوصول إلى هذه المنطقة");

            } else {
              toast.error("you have no permission to access this area");

            }
            router.push('/');
          }

 
        } else {
          recaptchaRef.current.reset();
          
          console.log(response)
          if(response.error.data.non_field_errors){
            toast.error(response.error.data.non_field_errors[0]);

          
          } else {
            if(locale === "ar"){
              toast.error("خطأ1 في تسجيل الدخول");

            } else {
              toast.error("Failed 1 to login");

            }

            if(response?.error?.data){
              toast.error(JSON.stringify(response?.error?.data));


            }
         
          }


        }
      } catch (error) {
        recaptchaRef.current.reset();
        console.error("Error submitting form:", error);
        if(locale === "ar"){
          toast.error("خطأ2 في تسجيل الدخول");

        } else {
          toast.error("Error 2 with login ");

        }
      } finally{  setIsSubmitting(false) }


    } else { 
      setIsSubmitting(false)
      if(locale === "ar"){
        toast.error("يرجى ملئ البريد الألكتروني وكلمة المرور");

      } else {
        toast.error("Please fill out your email and password and try again! ");

      }

    }

    dispatch(finishIntialLoad())
  }


    return (
        <>
<div className="d-flex vh-100 align-items-center justify-content-center">

    <div className="login-box ">
      <div className="login-logo">

          {/* <b>CloudTech</b>Sky */}
          <b>{t('company_name')}</b>{t('sky')}

      </div>

      <div className="card">
        <div className="card-body login-card-body">
          <p className="login-box-msg"> {t('form_title')}</p>
          <form  onSubmit={handlesubmit}>        
            <div className="form-floating mb-3">
              <input
                type="email"
                className="form-control"
                id="floatingEmail"
                placeholder="Email"
                name='email'
                value={form.email}
                onChange={handleChange}
                required

              />
              <label htmlFor="floatingEmail">{t('email')}</label>
            </div>

            <div className="form-floating mb-3">
              <input
                type="password"
                className="form-control"
                id="floatingPassword"
                placeholder="Password"
                name='password'
                value={form.password}
                onChange={handleChange}
                required
              />
              <label htmlFor="floatingPassword">{t('password')}</label>
            </div>
 
            <ReCAPTCHA
                sitekey={process.env.NEXT_PUBLIC_GOOGLE_RECAPCHA_SITE_KEY}
                onChange={onChangeRecaptcha}
                ref={recaptchaRef}
                hl={locale}
              />,

            <div className="row  ">
              <div className="col-8">

              </div>
              <div className=" ">
                <div className={locale === "ar" ? 'float-start' : 'float-end' }>
                  <button type="submit"
                   className="btn btn-primary"
                   disabled={isSubmitting}
                  
                  >
                    {isSubmitting ? t('singing_in') : t('sign_in') }
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>

</div>
      </>
      
    )
}


export default LoginPageComponent