'use client'

import {  useState  } from "react"

import { useCustomFetchMutation } from "@/app/(dashboard)/_components/redux_staff/features/authApiSlice"

import { toast } from "react-toastify";
import { useRouter } from 'next/navigation';

import { getErrorMessage } from "@/app/public_utils/utils";

import { useTranslations, useLocale } from "next-intl";


const Page = () =>  {

  const t = useTranslations('dashboard.projectFlow.projectflow_template.add_or_edit_template_form')
  const locale = useLocale()
  const [customFetch] = useCustomFetchMutation();
  const [isSubmiting, setIsSubmiting] = useState(false)
 
  const router = useRouter()
 

  const [formData, setFormData] = useState({
    template_name: "",
    default_start_process_step_or_sub_step_strategy: '',
    manual_start_mode : '',
    auto_start_first_step_after_clone: true,
    show_steps_to_client: true,
    show_steps_or_sub_steps_status_log_to_client: true,
  });

 
 
 
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: type === "checkbox" ? checked : value,  // Handle checkboxes correctly
    }));
  };



  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !formData.template_name.trim() ||  
      !["auto", "manual"].includes(formData.default_start_process_step_or_sub_step_strategy) ||   
      !["serialized", "non-serialized"].includes(formData.manual_start_mode)
    ) {
      if(locale === 'ar'){
        toast.error("جميع الحقول مطلوبة!");
      } else {
        toast.error("All fields are required!");
      }
      return;
    }
  
    try{
      setIsSubmiting(true)
      const form = new FormData();

      for (const key in formData) {
        form.append(key, formData[key]);
      }


    const response = await customFetch({
      url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/staff/project_flow_template/`,
      method: "POST",
      body: form,  
    });

    if(response && response.data){
      if(locale === 'ar'){
        toast.success('تم إضافة البيانات بنجاح');

      } else {
        toast.success('data has been added succusfuly');

      }

      router.push('/staff/projectFlow/projectFlowTemplate')


    } else{
      console.log('response?.error', response?.error)
      
    if(locale === 'ar'){
      toast.error('حدث خطأ')

      toast.error(getErrorMessage(response?.error?.data))

    } else {
      toast.error('error')

      toast.error(getErrorMessage(response?.error?.data))

    }

    }


    } catch (error){
      console.log('error', error)

      toast.error(getErrorMessage(error.data || error.message) || "Something went wrong");

    } finally{setIsSubmiting(false)}
  };
  

 
 

    return (
 

      <div> 
      <div className="app-content-header">


      </div>

      <div className="app-content">



        <div className="container-fluid  min-vh-150 bg-white p-3 border rounded " >


            <h6>{t('add_title')}</h6>
              <form className="col-md-8 col-12 mb5" onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="template_name" className="form-label small">
                    {t('template_name')} <span className="text-danger">*</span>
                  </label>
                  <input  
                    name="template_name" 
                    onChange={handleChange}
                    className="form-control form-control-sm" 
                    id="template_name" 
                    maxLength="50"
                    value={formData.template_name}
                  />
                  <div className="form-text fs-8">  {t('template_name_des')}</div>
                </div>

                <div className="mb-3">
                  <label htmlFor="default_start_process_step_or_sub_step_strategy" className="form-label small">
                  {t('steps_process_strategy')}
                  </label>
                  <select 
                    className="form-select form-select-sm" 
                    id="default_start_process_step_or_sub_step_strategy"
                    name="default_start_process_step_or_sub_step_strategy"   
                    onChange={handleChange}   
                    // defaultValue=""
                    value={formData.default_start_process_step_or_sub_step_strategy}
              
                  >
                    <option value="" disabled >{locale === 'ar' ? 'يرجى الإختيار' : 'Select Option'}</option>  
                    <option value="auto"> {locale === 'ar' ? 'تلقائي' : 'Auto'} </option>
                    <option value="manual"> {locale === 'ar' ? 'يدوي' : 'Manual'} </option>
                  </select> 
                  <div className="form-text fs-8">
                    {t('steps_process_strategy_des')}
                  </div>
                </div>

                <div className="mb-3">
                  <label htmlFor="manual_start_mode" className="form-label small">
                    {t('manual_start_mode')}
                  </label>
                  <select 
                    className="form-select form-select-sm" 
                    id="manual_start_mode"
                    name="manual_start_mode"   
                    onChange={handleChange}  
                    value={formData.manual_start_mode}
 

                    // defaultValue=''
                  >
                    <option value="" disabled> {locale === 'ar' ? 'يرجى الإختيار' : 'Select Option'} </option>
                    <option value="serialized">{locale === 'ar' ? 'تسلسلي' : 'Serialized'}</option>
                    <option value="non-serialized">{locale === 'ar' ? 'غير تسلسلي' : 'Non-Serialized'} </option>
                  </select> 
                  <div className="form-text fs-8">
 

                     {t('manual_start_mode_des')}

                  </div>
                </div>
 


                <div className={`   ms-2 ${locale === "ar" ? 'form-check-reverse' : 'form-check'} `}>
                  <input
                    name="auto_start_first_step_after_clone"   

                    className="form-check-input small"
                    type="checkbox"
                    onChange={handleChange}
                    checked={formData.auto_start_first_step_after_clone}
                    id="auto_start_first_step_after_clone"
                  />
                  <label className="form-check-label small" htmlFor="auto_start_first_step_after_clone">
                    {t('auto_start_first_step')}
                  </label>
                  <div className="form-text fs-8">
 
                      {t('auto_start_first_step_des')}
                  </div>

                </div>




                <div className={`    ms-2 ${locale === "ar" ? 'form-check-reverse' : 'form-check'} `}>
                  <input
                    name="show_steps_to_client"   

                    className="form-check-input small"
                    type="checkbox"
                    onChange={handleChange}
                    checked={formData.show_steps_to_client}
                    id="show_steps_to_client"
                  />
                  <label className="form-check-label small" htmlFor="show_steps_to_client">
                        {t('show_steps_to_client')}
                  </label>
                  <div className="form-text fs-8">
                    {/* Choose whether clients can see project steps. */}
                    {t('show_steps_to_client_des')}
                  </div>

                </div>


 

                <div className={`    ms-2 ${locale === "ar" ? 'form-check-reverse' : 'form-check'} `}>
                  <input
                    name="show_steps_or_sub_steps_status_log_to_client"   

                    className="form-check-input small"
                    type="checkbox"
                    onChange={handleChange}
                    checked={formData.show_steps_or_sub_steps_status_log_to_client}
                    id="show_steps_or_sub_steps_status_log_to_client"
                  />
                  <label className="form-check-label small" htmlFor="show_steps_or_sub_steps_status_log_to_client">
                    {t('show_steps_status_logs_to_client')}
                  </label>
                  <div className="form-text fs-8">
                     {t('show_steps_status_logs_to_client_des')}
    
                  </div>

                </div>



                <button
                  type="submit"
                  className="btn-sm btn btn-outline-primary mt-4"
                  disabled={isSubmiting}
                  >
                   {t('submit')}
                </button>
              </form>

          </div>
          

          </div>
        </div>
    )

}




 export default Page 


 