
import { useRouter } from 'next/navigation'
import { toast } from "react-toastify";
import { useChangePasswordMutation } from '@/app/(site)/_components/redux/features/authApiSlice';
import { useState } from 'react';

import { useLocale } from 'next-intl';

export default function useChangePassword() {
	const router = useRouter();
    const [changePassword, {isLoading} ] = useChangePasswordMutation()

    const locale = useLocale()
	const [formData, setFormData] = useState({
        new_password: '',
        re_new_password: '',
        current_password: ''
	});

	const { new_password, re_new_password, current_password } = formData;

    const onChange = (event) => {
        setFormData({...formData, [event.target.name]: event.target.value})
    }   


    const onSubmit = (event) => {
        event.preventDefault();


        if(new_password.trim() !== '' && re_new_password.trim() !== '' && current_password.trim !== '') {
            if(new_password.trim() ===  re_new_password.trim()) {
                changePassword({ new_password, re_new_password, current_password })
                .unwrap()
                .then(() => {

                    if(locale === "ar") {
                        toast.success('تم تعديل كلمة المرور بنجاح');

                    }else {
                        toast.success('Changed password successfully');

                    }

                    router.push('/');
                })
                .catch((err) => {
                    console.log(err);
                    if(locale === "ar") {
                        toast.error('حدث خطأ 1 في تعديل كلمة المرور يرجى المحاولة مرى أخرى');

                    } else {
                        toast.error('Error changing password, kindly check your inputs again');

                    }

                });
            } else {
                if(locale === "ar"){
                    toast.error('كلمة المرور الجديدة وتأكيد كلمة المرور غير متطابقتين');

                } else {
                    toast.error('Password and confirm password do not match');

                }
            }
        } else {
            if(locale === "ar"){
                toast.error('جميع الحقول مطلوبة');

            } else {
                toast.error('All fields are required');

            }
        }

      };







	return {
		current_password,
		new_password,
		re_new_password,
		isLoading,
		onChange,
		onSubmit,
	};
}