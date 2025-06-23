import { useRouter } from 'next/navigation'
import { toast } from "react-toastify";
import { useResetPasswordConfirmMutation } from '@/app/(site)/_components/redux/features/authApiSlice';
import { useState } from 'react';


import { useLocale } from 'next-intl';


export default function useResetPasswordConfirm(uid, token) {
	const router = useRouter();

	const locale = useLocale()

	const [resetPasswordConfirm, { isLoading }] = useResetPasswordConfirmMutation();


	const [formData, setFormData] = useState({
		new_password: '',
		re_new_password: '',
	});

	const { new_password, re_new_password } = formData;

	const onChange = (event) => {
		const { name, value } = event.target;

		setFormData({ ...formData, [name]: value });
	};

	const onSubmit = (event) => {
		event.preventDefault();


        if(new_password.trim() !== '' && re_new_password.trim() !== '') {
			if(new_password.trim() ===  re_new_password.trim()) {
			resetPasswordConfirm({ uid, token, new_password, re_new_password })
				.unwrap()
				.then(() => {

					if(locale === "ar"){
						toast.success('تم إعادة تعيين كلمة المرور بنجاح');

					}else {
						toast.success('Password reset successful');

					}


					router.push('/account/login');
				})
				.catch((err) => {
					console.log(err)
					if(locale === "ar"){
						toast.error('حدث خطأ في اعادة تعيين كلمة المرور يرجى المحاولة مجدداً');

					} else {
						toast.error('Password reset failed , kindly try again');

					}
					if(err?.data){
						toast.error(JSON.stringify(err.data))
					}
				});

			} else {
				if(locale === "ar"){
					toast.error('كلمة المرور وتأكيد كلمة المرور غير متطابقتين');

				} else {
					toast.error('Password and confirm password do not match');

				}
			}

		} else {
			if(locale === "ar"){
				toast.error('كافة الحقول مطلوبة');
			} else {
				toast.error('All fields are required');
			}
			
		}


	};

	return {
		new_password,
		re_new_password,
		isLoading,
		onChange,
		onSubmit,
	};
}