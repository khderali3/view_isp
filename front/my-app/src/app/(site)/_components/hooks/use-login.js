import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';

import { useDispatch } from 'react-redux';
import { useLoginMutation } from '../redux/features/authApiSlice';
import { setAuth, setloginFirstName, setprofileImage, setIs_staff, setIs_superuser } from '../redux/features/authSlice';
import { toast } from 'react-toastify';
import { jwtDecode} from 'jwt-decode';
import { getErrorMessage } from "@/app/public_utils/utils";


import { useLocale } from 'next-intl';
import ReCAPTCHA from "react-google-recaptcha";

import { useSearchParams } from 'next/navigation';



export default function useLogin() {

  const [recaptchaValue, setRecaptchaValue] = useState('')
  const recaptchaRef = useRef(null);


	const searchParams = useSearchParams();
	const redirectPath = searchParams.get('redirect') || '/';




  function onChangeRecaptcha(value) { 
    setRecaptchaValue(value)
  }





	const router = useRouter();
	const dispatch = useDispatch();
	const [login, { isLoading }] = useLoginMutation();

	const locale = useLocale()




	const [formData, setFormData] = useState({
		email: '',
		password: '',
	});

	const { email, password } = formData;

	const onChange = (event) => {
		const { name, value } = event.target;

		setFormData({ ...formData, [name]: value });
	};

	const onSubmit = (event) => {
		event.preventDefault();

 
		if (!recaptchaValue) {
			if(locale === "ar"){
			  toast.error("يرجى الضغط على انا لست روبوت");
	
			} else{
			  toast.error("Please complete the CAPTCHA.");
	
			}
 
 
			return;
		  }

 


		login({ email, password, recaptcha_value:recaptchaValue })
			.unwrap()
			.then((data) => {

				if (email.trim() !== '' && password.trim() !== '') {
					dispatch(setAuth());
					const token_info = jwtDecode(data.access)
					const user_first_name = token_info?.first_name
					dispatch(setloginFirstName(user_first_name))
					const profileImage = token_info?.PRF_image
					dispatch(setprofileImage(profileImage)) 
					dispatch(setIs_staff(token_info?.is_staff)) 
					dispatch(setIs_superuser(token_info?.is_superuser)) 

					


					if(locale === "ar"){
						toast.success('تم تسجيل الدخول بنجاح');

					} else {
						toast.success('Logged in successfully');

					}




					// router.push('/');
					router.push(redirectPath);

				} else  {

					if(locale === "ar"){
						toast.error('جميع الحقول مطلوبة!');

					} else {
						toast.error('All fields are required');

					}
				}
			})
			.catch((error) => {
				recaptchaRef.current.reset();
				console.log(error)

				if(locale === "ar"){
					toast.error('فشل في تسجل الدخول');
					toast.error(getErrorMessage(error.data || error.message) || "Something went wrong");

				} else {
					toast.error('Failed to log in');
					toast.error(getErrorMessage(error.data || error.message) || "Something went wrong");

				}
				if(error.data.detail === "Invalid reCAPTCHA. Please try again."){
					toast.error("Invalid reCAPTCHA. Please try again.");

				}
			});
	};

	return {
		email,
		password,
		isLoading,
		onChange,
		onSubmit,
		ReCAPTCHA,
		onChangeRecaptcha,
		recaptchaRef,
		locale
	};
}