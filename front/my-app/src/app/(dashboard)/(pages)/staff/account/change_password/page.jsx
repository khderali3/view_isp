'use client'

import { useRouter } from 'next/navigation'
import { toast } from "react-toastify";
import { useCustomFetchMutation } from "@/app/(site)/_components/redux/features/siteApiSlice";

import { useState } from 'react';

import { useLocale, useTranslations } from 'next-intl';

export default function useChangePassword() {
	const router = useRouter();
 

	const [customFetch] = useCustomFetchMutation()
	const [isSubmiting, setIsSubmiting] = useState(false)
	const t = useTranslations('dashboard.account.change_password')

	const locale = useLocale()
	const [formData, setFormData] = useState({
		confirm_password: '',
		new_password: '',
		old_password: ''
	});

	const { confirm_password, new_password, old_password } = formData;

	const handleChange = (event) => {
		setFormData({...formData, [event.target.name]: event.target.value})
	}   


	const onSubmit = async (event) => {
		event.preventDefault();
		setIsSubmiting(true)


		if(new_password.trim() !== '' && new_password.trim() !== '' && old_password.trim !== '') {
			if(new_password.trim() ===  confirm_password.trim()) {

				try {
					// Send form data using customFetch mutation
					const response = await customFetch({
					  url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/staff/auth/change_password/`,
					  method: "POST",
					  body: formData, // Send FormData as the body
					});
			  
					if (response && response.data) {
					  if(locale === "ar"){
						toast.success("تم تعديل كلمة السر بنجاح");
			  
					  } else {
						toast.success("your password has been change succussfuly");
			  
					  }
			   
					  router.push('/staff/');  
			  
					} else {
			  
					  if(locale === "ar"){
						toast.error("حصل خطأ رقم 1 إثناء تعديل كلمة المرور . يرجى المحاولة مجدداً.");
						if(response?.error?.data){
							toast.error(JSON.stringify(response?.error?.data));
						}
					  } else {
						toast.error("Failed 1 to submit the request.");
						if(response?.error?.data){
							toast.error(JSON.stringify(response?.error?.data));
						}
					  }
					  console.log('response', response?.error?.data)
					}
				  } 
				  
				  catch (error) {
					console.error("Error submitting form:", error);
			  
					if(locale === "ar"){
					  toast.error("حصل خطأ رقم 2 إثناء تعديل كلمة المرور . يرجى المحاولة مجدداً.");
			  
					} else {
					  toast.error("Failed 2 to submit the request.");
					}
			  
			   
				  } 
				   


				  finally{ setIsSubmiting(false)  }
 
	 
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

		setIsSubmiting(false)

	  };







    return (
 

		<div> 
		<div className="app-content-header">
  
  
   
  
		</div>
  
		<div className="app-content">
  
  
  
		  <div className="container-fluid  min-vh-150 bg-white p-3 border rounded " >
  
  
			<h2>{t('title')}</h2>
			<hr />
   
  
			  <form className="col-md-8 col-12 mb-5" onSubmit={onSubmit} >
  
 
			  <div className="mb-3 col-md-6">
				  <label htmlFor="password" className="form-label small">
 					 {t('Current_Password')}
				  </label>
				  <input
					name="old_password"
					onChange={handleChange}
					value={formData.old_password}  
  
					type="password"
					className="form-control form-control-sm" // Added 'form-control-sm' for smaller input
					id="password"
					required
					maxLength="50"
				  />
				</div>
  
  
				<div className="mb-3 col-md-6">
				  <label htmlFor="password" className="form-label small">
				  {/* {t('password')} <span className="text-danger">*</span> */}
				  {t('New_Password')}
				  </label>
				  <input
					name="new_password"
					onChange={handleChange}
					value={formData.new_password}  
  
					type="password"
					className="form-control form-control-sm" // Added 'form-control-sm' for smaller input
					id="password"
					required
					maxLength="50"
				  />
				</div>
  
				<div className="mb-3 col-md-6">
				  <label htmlFor="re_new_password" className="form-label small">
				  {/* {t('confirm_password')} <span className="text-danger">*</span> */}
				  {t('Confirm_Password')}
				  </label>
				  <input
					name="confirm_password"
					onChange={handleChange}
					value={formData.confirm_password}  
  
					type="password"
					className="form-control form-control-sm"  
					id="re_new_password"
					required
					maxLength="50"
					
				  />
				</div>
  
  
				<button  
				className="btn btn-primary btn-sm"
				disabled={isSubmiting}
				 style={{ width: 90 }}
			 
				>
  
  
					{/* { isSubmiting ? t('submitting') : t('submit')} */}

					{isSubmiting ? t('submitting') : t('submit')  }
					
  
				</button>
			  </form>
  
  
			</div>
			
  
			</div>
		  </div>
	  )
  
}