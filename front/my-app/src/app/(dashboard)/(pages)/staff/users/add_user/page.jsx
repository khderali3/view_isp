'use client'

import { useEffect, useState, useRef} from "react"
import { useCustomFetchMutation } from "@/app/(site)/_components/redux/features/siteApiSlice";
import { toast } from "react-toastify";
import { useRouter } from 'next/navigation';

import { useTranslations, useLocale } from "next-intl";
import { useSelector } from "react-redux";

const Page = () =>  {

  const [customFetch] = useCustomFetchMutation();
 

  const router = useRouter()
 
    const t = useTranslations("dashboard.users_managment.users.add_new_user")
    const locale = useLocale()

    const {  permissions, is_superuser, is_staff  } = useSelector(state => state.staff_auth);


  const [formData, setFormData] = useState({
    email: "",
    first_name: "",
    last_name: "",
    password: "",
    confirm_password: "", 
   });


 
   const [isSubmiting, setIsSubmiting] =  useState(false)

  // Handle input changes for text fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

 
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmiting(true)
    const form = new FormData();

    // Append text fields to form data

    form.append("user.email", formData.email);
    form.append("user.first_name", formData.first_name);
    form.append("user.last_name", formData.last_name);
    form.append("user.password", formData.password);
    form.append("user.confirm_password", formData.confirm_password);
  
    if (
 
  
      (formData.email && formData.email.trim() !== '') && 
      (formData.first_name && formData.first_name.trim() !== '') && 
      (formData.last_name && formData.last_name.trim() !== '') && 
      (formData.password && formData.password.trim() !== '') && 
      (formData.confirm_password && formData.confirm_password.trim() !== '')  

    ) {
      
      // if(formData.password !== formData.confirm_password){
      //   if(locale === "ar"){
      //     toast.error("كلمة المرور وتأكيد كلمة المرور غير متطابقتين . يرجى المحاولة مجدداً.");

      //   } else {
      //     toast.error("Passwords do not match. Please try again!");

      //   }
      //   setIsSubmiting(false)
      //   return;
      // }

		
      if (formData.password.length < 8) {
        if( locale === "ar" ){
          toast.error(`يجب على الأقل ان تكون كلمة المرور 8 أحرف`);
  
        } else {
          toast.error(`Password must be at least 8 characters long`);
  
        }
        setIsSubmiting(false)
        return;

      } else if (formData.password !== formData.confirm_password) {
        if( locale === "ar" ){
          toast.error('كلمة المرور و تأكيد كلمة المرور غير متطابقتين');
  
        } else{
          toast.error('Password and confirm password do not match');
  
        }
        setIsSubmiting(false)
        return;
      }






    try {
      // Send form data using customFetch mutation
      const response = await customFetch({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/staff/usersmanagment/users/`,
        method: "POST",
        body: form, // Send FormData as the body
      });

      if (response && response.data) {
        if(locale === "ar"){
          toast.success("تم إنشاء المستخدم بنجاح");

        } else {
          toast.success("the user has been added succussfuly!");

        }
 
        router.push('/staff/users');  

      } else {

        if(locale === "ar"){
          toast.error("حصل خطأ رقم 1 إثناء انشاء المستخدم . يرجى المحاولة مجدداً.");

        } else {
          toast.error("Failed 1 to submit the request.");

        }

        if (response?.error?.data?.detail) {
          if(response.error.data.detail === "Permission denied for this operation."){
            if(locale === "ar") {
              toast.error(" لا يوجد لديك صلاحيات للقيام بهذه العملية!");
      
            } else {
              toast.error(response.error.data.detail);
            }
      
          }
        }

        console.log('response', response)
      }
    } catch (error) {
      console.error("Error submitting form:", error);

      if(locale === "ar"){
        toast.error("حصل خطأ رقم 2 إثناء انشاء المستخدم . يرجى المحاولة مجدداً.");

      } else {
        toast.error("Failed 2 to submit the request.");
      }

 
    } finally{ setIsSubmiting(false)  }

 
      console.log("Form is valid");
    } else {
      if(locale === "ar"){

        toast.error("جميع الحقول مطلوبة ");

      } else {
        toast.error("all fields are required ");

      }

      setIsSubmiting(false)
    }

 
  };













useEffect(() => {
 
 
}, []);



if (!is_superuser && !(permissions?.includes('usersAuthApp.user_managment') && is_staff)) {
  return;
} 





    return (
 

      <div> 
      <div className="app-content-header">


 

      </div>

      <div className="app-content">



        <div className="container-fluid  min-vh-150 bg-white p-3 border rounded " >


          <h2>{t('title')}</h2>
 

            <form className="col-md-8 col-12 mb-5" onSubmit={handleSubmit}>


              <div className="mb-3 col-md-6">
                <label htmlFor="email" className="form-label small">
                {t('Email')} <span className="text-danger">*</span>
                </label>
                <input
                  name="email"
                  onChange={handleChange}
                  value={formData.email} // Controlled input

                   type="email"
                  className="form-control form-control-sm" // Added 'form-control-sm' for smaller input
                  id="email"
                  required
                  maxLength="50"
                />
              </div>

              <div className="mb-3 col-md-6">
                <label htmlFor="first_name" className="form-label small">
                {t('First_Name')} <span className="text-danger">*</span>
                </label>
                <input
                  name="first_name"
                  onChange={handleChange}
                  value={formData.first_name} // Controlled input
 
                  type="text"
                  className="form-control form-control-sm" // Added 'form-control-sm' for smaller input
                  id="first_name"
                  required
                  maxLength="50"
                />
              </div>

              <div className="mb-3 col-md-6">
                <label htmlFor="last_name" className="form-label small">
                {t('Last_Name')} <span className="text-danger">*</span>
                </label>
                <input
                  name="last_name"
                  onChange={handleChange}
                  value={formData.last_name} // Controlled input

                  type="text"
                  className="form-control form-control-sm" // Added 'form-control-sm' for smaller input
                  id="last_name"
                  required
                  maxLength="50"
                />
              </div>



              <div className="mb-3 col-md-6">
                <label htmlFor="password" className="form-label small">
                {t('password')} <span className="text-danger">*</span>
                </label>
                <input
                  name="password"
                  onChange={handleChange}
                  value={formData.password} // Controlled input

                  type="password"
                  className="form-control form-control-sm" // Added 'form-control-sm' for smaller input
                  id="password"
                  required
                  maxLength="50"
                />
              </div>

              <div className="mb-3 col-md-6">
                <label htmlFor="confirm_password" className="form-label small">
                {t('confirm_password')} <span className="text-danger">*</span>
                </label>
                <input
                  name="confirm_password"
                  onChange={handleChange}
                  value={formData.confirm_password}  

                  type="password"
                  className="form-control form-control-sm"  
                  id="confirm_password"
                  required
                  maxLength="50"
                />
              </div>


              <button type="submit" 
              className="btn btn-primary btn-sm"
              disabled={isSubmiting}
              >

                {/* {t('submit')} */}

                  { isSubmiting ? t('submitting') : t('submit')}

              </button>
            </form>


          </div>
          

          </div>
        </div>
    )

}




 export default Page 


 