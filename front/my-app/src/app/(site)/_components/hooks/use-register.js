import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useRegisterMutation } from '../redux/features/authApiSlice';
import { toast } from 'react-toastify';


import { useLocale } from 'next-intl';
import ReCAPTCHA from "react-google-recaptcha";

export default function useRegister() {

	const [recaptchaValue, setRecaptchaValue] = useState('')
	const recaptchaRef = useRef(null);
  
	function onChangeRecaptcha(value) { 
	  setRecaptchaValue(value)
	}
  



	const router = useRouter();
	const [register, { isLoading }] = useRegisterMutation();
	const locale = useLocale()
	const [formData, setFormData] = useState({
		first_name: '',
		last_name: '',
		email: '',
		password: '',
		re_password: '',
	});

	const { first_name, last_name, email, password, re_password } = formData;

	const onChange = (event ) => {
		const { name, value } = event.target;

		setFormData({ ...formData, [name]: value });
	};

	const onSubmit = (event) => {
		event.preventDefault();
		console.log('recaptchaValue', recaptchaValue)


		if (!recaptchaValue) {
			if(locale === "ar"){
			  toast.error("يرجى الضغط على انا لست روبوت");
	
			} else{
			  toast.error("Please complete the CAPTCHA.");
	
			}
 
 
			return;
		}



		if (first_name.trim() !== '' && last_name.trim() !== '' 
		&& email.trim() !== '' && password.trim() !== ''
		&& re_password.trim() !== '') {
		
		if (password.trim().length < 8) {
			if( locale === "ar" ){
				toast.error(`يجب على الأقل ان تكون كلمة المرور 8 أحرف`);

			} else {
				toast.error(`Password must be at least 8 characters long`);

			}
		} else if (password.trim() !== re_password.trim()) {
			if( locale === "ar" ){
				toast.error('كلمة المرور و تأكيد كلمة المرور غير متطابقتين');

			} else{
				toast.error('Password and confirm password do not match');

			}
		} else {
		register({ first_name, last_name, email, password, re_password, recaptcha_value:recaptchaValue })
			.unwrap()
			.then(() => {
				if( locale === "ar" ){
					toast.success('يرجى التحقق من بريدك الإلكتروني لتفعيل حسابك');

				} else {
					toast.success('Please check email to activate your account');

				}
				router.push('/account/login');
			})
			.catch((error) => {
				console.log('error:', error)
				if(error?.data){
					toast.error(JSON.stringify(error.data));

				}
				if( locale === "ar" ){
					toast.error('حصل خطأ في انشاء الحساب يرجى المحاولة مجدداً');

				} else {
					toast.error('Failed to register account');

				}
				recaptchaRef.current.reset();
			});
		}
		
	} else {
		if( locale === "ar" ){
			toast.error('جميع الحقول مطلوبة');

		} else {
			toast.error('All fields are required');

		}
	}
	





	};

	return {
		first_name,
		last_name,
		email,
		password,
		re_password,
		isLoading,
		onChange,
		onSubmit,
		ReCAPTCHA,
		onChangeRecaptcha,
		recaptchaRef,
		locale
	};
}