'use client'

import {  useState, useEffect  } from "react"

import { useCustomFetchMutation } from "@/app/(dashboard)/_components/redux_staff/features/authApiSlice"

import { toast } from "react-toastify";
import { useRouter } from 'next/navigation';

import { getErrorMessage } from "@/app/public_utils/utils";

import { useParams } from "next/navigation";

import { useTranslations, useLocale } from "next-intl";
import { useProjectStatus } from "@/app/public_utils/hooks";

const Page = () =>  {

  const t = useTranslations('dashboard.projectFlow.projectflow.edit_projectflow')
  const locale = useLocale()
  const getProjectStatus = useProjectStatus()
 
  const [customFetch] = useCustomFetchMutation();
  const [isSubmiting, setIsSubmiting] = useState(false)
 
  const router = useRouter()
  const { projectflow_id } = useParams()  
 

  const [formData, setFormData] = useState({
 
    default_start_process_step_or_sub_step_strategy: '',
    manual_start_mode : '',
    show_steps_to_client: true,
    show_steps_or_sub_steps_status_log_to_client: true,
    project_flow_status : '',
    contact_phone_no : '',
    project_address: '',
  });

 



  const fetchData = async () => {
    try {   
      const response = await customFetch({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/staff/projectflow/projectflow/${projectflow_id}/`,
        method: "GET",
      });  
      if (response && response.data) {
        setFormData(response.data);
      } else {
        toast.error(getErrorMessage(response?.error?.data))
        router.push('/404')
      }
    } catch (error) {
      toast.error(getErrorMessage(error.data || error.message) || "Something went wrong");
    }
  };




 
 
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
        if(
          key === 'default_start_process_step_or_sub_step_strategy' || 
          key === 'manual_start_mode' || 
          key === 'show_steps_to_client' || 
          key === 'show_steps_or_sub_steps_status_log_to_client'  ||
          key === 'project_flow_status' || 
          key === 'contact_phone_no' ||
          key === 'project_address'
        
        ){
          form.append(key, formData[key]);

        }
        // form.append(key, formData[key]);
      }


    const response = await customFetch({
      url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/staff/projectflow/projectflow/${projectflow_id}/`,
      method: "PUT",
      body: form,  
    });

    if(response && response.data){
      router.push(`/staff/projectFlow/projectFlow/projectFlowDetails/${projectflow_id}`)
      if( locale === 'ar'){
        toast.success('تم تعديل البيانات بنجاح');

      } else {
        toast.success('data has been updated succusfuly');

      }


    } else{
      console.log('response?.error', response?.error)
      // toast.error(JSON.stringify(response?.error));
      toast.error(getErrorMessage(response?.error?.data))

    }


    } catch (error){
      console.log('error', error)

      toast.error(getErrorMessage(error.data || error.message) || "Something went wrong");

    } finally{setIsSubmiting(false)}
  };
  

 useEffect(() => {
 
   fetchData()
 
 }, []);
 

    return (
 

      <div> 
      <div className="app-content-header">


      </div>

      <div className="app-content">



        <div className="container-fluid  min-vh-150 bg-white p-3 border rounded " >


            <h4 className="mb-3">{t('title')}</h4>
              <form className="col-md-8 col-12 mb5" onSubmit={handleSubmit}>


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
                    <option value="auto"> {locale === 'ar' ? 'تلقائي' : 'Auto'}</option>
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
                  >

                    <option value="" disabled>{locale === 'ar' ? 'يرجى الإختيار' : 'Select Option'}</option>
                    <option value="serialized">{locale === 'ar' ? 'تسلسلي' : 'Serialized'}</option>
                    <option value="non-serialized">{locale === 'ar' ? 'غير تسلسلي' : 'Non-Serialized'}</option>



                  </select> 
                  <div className="form-text fs-8">
                      {t('manual_start_mode_des')}
                  </div>
                </div>
 

                <div className="mb-3">
                  <label htmlFor="project_flow_status" className="form-label small">
                     {t('projectflow_status')}
                  </label>
                  <select 
                    className="form-select form-select-sm" 
                    id="project_flow_status"
                    name="project_flow_status"   
                    onChange={handleChange}  
                    value={formData.project_flow_status}
                  >

                    <option value="" disabled>Select Option</option>
                    <option value="pending">{getProjectStatus('pending')}</option>
                    <option value="wait_customer_action">{getProjectStatus('wait_customer_action')}</option>
                    <option value="in_progress">{getProjectStatus('in_progress')}</option>
                    <option value="completed">{getProjectStatus('completed')}</option>
                    <option value="canceled">{getProjectStatus('canceled')}</option>

                  </select> 
                  <div className="form-text fs-8 text-danger">

                    {t('projectflow_status_des')}

                  </div>
                </div>



                <div className={` ms-2 ${locale === "ar" ? 'form-check-reverse' : 'form-check'} `}>
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
                    {t('show_steps_to_client_des')}
    
                  </div>

                </div>


 

                <div className={` ms-2 ${locale === "ar" ? 'form-check-reverse' : 'form-check'} `}>
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






                <div className="mb-3 mt-3">
                  <label htmlFor="contact_phone_no" className="form-label small">
                    {/* Contact Phone number */}
                    {locale === 'ar' ? 'هاتف التواصل' : 'Contact phone'}
                    <span className="text-danger">*</span>
                  </label>
                  <input
                    className="form-control form-control-sm"
                    id="contact_phone_no"
                    value={formData.contact_phone_no || ''}
                    required="" 
                    name="contact_phone_no"
                    onChange={handleChange}
                    maxLength={30}
                  />
                </div>

                <div className="mb-3 mt-3">
                  <label htmlFor="project_address" className="form-label small">
                    {locale === 'ar' ? 'مكان تنفيذ المشروع' : 'Project Address'}
                    <span className="text-danger">*</span>
                  </label>
                  <input
                    className="form-control form-control-sm"
                    id="project_address"
                    value={formData.project_address || ''}
                    required
                    name="project_address"
                    onChange={handleChange}
                  />
                </div>












                <button
                  type="submit"
                  className="btn-sm btn btn-outline-primary mt-4"
                  disabled={isSubmiting}
                  >
                   {t('edit_save_btn')}
                </button>
              </form>

          </div>
          

          </div>
        </div>
    )

}




 export default Page 


 