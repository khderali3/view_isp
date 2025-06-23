'use client'

import {  useState, useEffect} from "react"

import {useCustomFetchMutation} from "@/app/(dashboard)/_components/redux_staff/features/authApiSlice"


import { toast } from "react-toastify";
import { useRouter } from 'next/navigation';

 
import {  useLocale, useTranslations } from "next-intl";
import { getErrorMessage } from "@/app/public_utils/utils";
import { GroupAasignOrRemove } from "@/app/(dashboard)/_components/jsx/project_flow_template/groups assign/group";



import { useStepStatus } from "@/app/public_utils/hooks";




import { useParams } from "next/navigation";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";



const Page = () =>  {



    const getStepStatus = useStepStatus()
    const {projectFlow_id, step_id} = useParams()
 
    const locale = useLocale()
    const t = useTranslations('dashboard.projectFlow.projectflow.projectflow_add_or_edit_step')

    const [customFetch] = useCustomFetchMutation();
    const [isSubmiting, setIsSubmiting] = useState(false)
    
    const router = useRouter()

    const [allowedProcessGroups, setAllowedProcessGroups] = useState([])



  const [startDateProcess, setStartDateProcess] = useState('');
  const [endDateProcess, setEndDateProcess] = useState('');



    const [formData, setFormData] = useState({
        step_name: "",
        step_description: '',
        step_name_ar : '',
        step_description_ar : '',
        show_to_client : true,
        allowed_process_by : '',
        // allowed_process_groups:[],
        start_process_step_strategy : '',
        show_status_log_to_client: true,
        project_flow_step_status:'',
    });


  const fetchData = async () => {
    try {   
      const response = await customFetch({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/staff/projectflow/projectflow/${projectFlow_id}/step/${step_id}/`,   
        method: "GET",
      });  
      if (response && response.data) {
        setFormData(response.data);
        if(response?.data?.start_date_process) {setStartDateProcess( new Date(response?.data?.start_date_process))}

        if(response?.data?.end_date_process) {setEndDateProcess( new Date(response?.data?.end_date_process))}


        setAllowedProcessGroups(response.data.allowed_process_groups)
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
    if(name !== "allowed_process_groups"){
      setFormData((prevState) => ({
          ...prevState,
          [name]: type === "checkbox" ? checked : value,  // Handle checkboxes correctly
        }));
    }
  };


 
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !formData.step_name.trim() ||  
      !formData.step_description.trim() ||  
      !formData.step_name_ar.trim() ||  
      !formData.step_description_ar.trim() ||  
      !["inherit_from_project_flow", "auto", "manual"].includes(formData.start_process_step_strategy) ||
      !["any_staff", "specific_staff_group", "client"].includes(formData.allowed_process_by)  ||
      !["inherit_from_project_flow", "yes", "no"].includes(formData.show_status_log_to_client)  

    ) {
      if(locale === 'ar'){
        toast.error("جميع الحقول مطلوبة");
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
          key === 'step_name' ||
          key === 'step_name_ar' ||
          key === 'step_description' ||
          key === 'step_description_ar' ||        
          key === 'allowed_process_by'  ||      
          key === 'start_process_step_strategy' ||        
          key === 'show_status_log_to_client'  ||
          key === 'show_to_client'  ||
          key === 'project_flow_step_status' 
               
        
        ){
          form.append(key, formData[key]);
 

        }


        // form.append(key, formData[key]);
      }
 
      form.append('start_date_process', startDateProcess ? startDateProcess.toISOString() : '' );
      form.append('end_date_process', endDateProcess ? endDateProcess.toISOString() : '' );

      // form.append('end_date_process', '');



    const response = await customFetch({
      url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/staff/projectflow/projectflow/${projectFlow_id}/step/${step_id}/`,   
      method: "PUT",
      body: form,  
    });

    if(response && response.data){

      if(locale === 'ar'){
        toast.success('تم تعديل البيانات بنجاح');
      } else {
        toast.success('data has been updated succusfuly');
      }



      router.push(`/staff/projectFlow/projectFlow/projectFlowDetails/${projectFlow_id}`)


    } else{
      console.log('allowedProcessGroups', allowedProcessGroups)

      console.log(response?.error)
      toast.error(getErrorMessage(response?.error?.data))
    }


    } catch (error){
      console.log(error)
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


            <h4 className="mb-4">{t('edit_title')}</h4>
              <form className="col-md-8 col-12 mb-5" onSubmit={handleSubmit}>

                <div className="mb-3">
                    <label htmlFor="step_name" className="form-label small">
                        {t('step_name')} <span className="text-danger">*</span>
                    </label>
                    <input  
                        name="step_name" 
                        onChange={handleChange}
                        className=" form-control form-control-sm " 
                        id="step_name" 
                        maxLength="50"
                        value={formData.step_name}
                    />
                    <div className="form-text fs-8">{t('step_name_des')}</div>
                </div>


                <div className="mb-3">
                    <label htmlFor="step_description" className="form-label small">
                         {t('Step_Details')} <span className="text-danger">*</span>
                    </label>
                    <textarea  
                        name="step_description" 
                        onChange={handleChange}
                        className="form-control form-control-sm " 
                        id="step_description" 
                        maxLength="500" // Adjust if needed
                        value={formData.step_description}
                        rows="2"  
                    />
                    <div className="form-text fs-8">{t('Step_Details_des')}</div>
                </div>



                <div className="mb-3">
                    <label htmlFor="step_name_ar" className="form-label small">
                        {t('step_name_ar')} <span className="text-danger">*</span>
                    </label>
                    <input  
                        name="step_name_ar" 
                        onChange={handleChange}
                        className="form-control text-end form-control-sm "
                         
                        id="step_name_ar" 
                        maxLength="50"
                        value={formData.step_name_ar}
                    />
                    <div className="form-text fs-8">{t('step_name_ar_des')}</div>
                </div>


                <div className="mb-3">
                    <label htmlFor="step_description_ar" className="form-label small">
                        {t('Step_Details_ar')} <span className="text-danger">*</span>
                    </label>
                    <textarea  
                        name="step_description_ar" 
                        onChange={handleChange}
                        className="form-control text-end form-control-sm " 
                        id="step_description_ar" 
                        maxLength="500" // Adjust if needed
                        value={formData.step_description_ar}
                        rows="2"  
                    />
                    <div className="form-text fs-8">{t('Step_Details_ar_des')}</div>
                </div>

 


                <div className="mb-3">
                  <label htmlFor="allowed_process_by" className="form-label small">
                   {t('Allowed_Process_By')}
                  </label>
                  <select 
                    className="form-select form-select-sm " 
                    id="allowed_process_by"
                    name="allowed_process_by"   
                    onChange={handleChange}   
                    // defaultValue=""
                    value={formData.allowed_process_by}
              
                  >
                    <option value="" disabled >{t('Select_Option')}</option>  
                    <option value="any_staff">{t('any_staff')}</option>
                    <option value="specific_staff_group">{t('specific_staff_group')}</option>
                    <option value="client">{t('client')}</option>

                  </select> 
                  <div className="form-text fs-8">
                    {t('Allowed_Process_By_des')}
                  </div>
                </div>



              {formData.allowed_process_by === 'specific_staff_group' ?
              
                <div className="mb-3 ps-2 mb-5">

                  <label htmlFor="allowed_process_by" className="form-label small">
                     {t('Select_Groups')}
                  </label>


                  <GroupAasignOrRemove 
                    allowedProcessGroups={allowedProcessGroups} 
                    setAllowedProcessGroups={setAllowedProcessGroups} 
                  />
                </div>              
                : ''
              }





                <div className="mb-3">
                  <label htmlFor="start_process_step_strategy" className="form-label small">
                     {t('Start_Process_Strategy')}
                  </label>
                  <select 
                    className="form-select form-select-sm" 
                    id="start_process_step_strategy"
                    name="start_process_step_strategy"   
                    onChange={handleChange}   
                    // defaultValue=""
                    value={formData.start_process_step_strategy}
              
                  >
                    <option value="" disabled >{t('Select_Option')}</option> 
                    <option value="inherit_from_project_flow">{t('inherit_from_project_flow')}</option>
                    <option value="auto">{t('auto')}</option>
                    <option value="manual">{t('manual')}</option>
                  </select> 
                  <div className="form-text fs-8">
                    {t('Start_Process_Strategy_des')}
                  </div>
                </div>



                <div className="mb-3">
                  <label htmlFor="show_status_log_to_client" className="form-label small">
                     {t('Show_Status_Logs_To_Client')}
                  </label>
                  <select 
                    className="form-select form-select-sm " 
                    id="show_status_log_to_client"
                    name="show_status_log_to_client"   
                    onChange={handleChange}   
                    value={formData.show_status_log_to_client}

                  >
                    <option value="" disabled>{t('Select_Option')}</option>
                    <option value="inherit_from_project_flow">{t('inherit_from_project_flow')}</option>
                    <option value="yes">{t('yes')}</option>
                    <option value="no">{t('no')}</option>
                  </select> 
                  <div className="form-text fs-8">
                    {t('Show_Status_Logs_To_Client_des')}
                  </div>
                </div>




                <div className={`    ms-2 ${locale === "ar" ? 'form-check-reverse' : 'form-check'} `}>
                  <input
                    name="show_to_client"   

                    className="form-check-input form-check-input-sm"
                    type="checkbox"
                    onChange={handleChange}
                    checked={formData.show_to_client}
                    id="show_to_client"
                  />
                  <label className="form-check-label small" htmlFor="show_to_client">
                     {t('Show_To_Client')}
                  </label>
                  <div className="form-text fs-8">
                     {t('Show_To_Client_des')}
    
                  </div>

                </div>



                <div className="mb-3">
                  <label htmlFor="project_flow_step_status" className="form-label small">
                     {t('status_label')}
                  </label>
                  <select 
                    className="form-select form-select-sm" 
                    id="project_flow_step_status"
                    name="project_flow_step_status"   
                    onChange={handleChange}  
                    value={formData.project_flow_step_status}
                  >

                    <option value="" disabled>{t('Select_Option')}</option>
                    <option value="pending">{getStepStatus('pending')}</option>
                    <option value="wait_customer_action">{getStepStatus('wait_customer_action')}</option>
                    <option value="in_progress">{getStepStatus('in_progress')}</option>
                    <option value="completed">{getStepStatus('completed')}</option>
                    <option value="canceled">{getStepStatus('canceled')}</option>

                  </select> 
                  <div className="form-text fs-8 text-danger">

                    {t('step_status_des')}

                  </div>
                </div>

 


 
            <div className="mb-3">
              <label className="form-label small d-block"> {t('Start_Process_Date')}</label>
              <DatePicker
                selected={startDateProcess ? startDateProcess : null}
                onChange={(date) => setStartDateProcess(date ?? null)}
                showTimeSelect
                dateFormat="yyyy-MM-dd HH:mm"
                className="form-control form-control-sm"
                isClearable
                popperPlacement="bottom-start" 

              />

              <div className="form-text fs-8 text-danger">
                {t('Start_Process_Date_des')}
              </div>
            </div>
 


          <div className="mb-3 ">
            <label className="form-label small d-block">  {t('End_Process_Date')} </label>
            <DatePicker
              selected={endDateProcess ? endDateProcess : null}
              onChange={(date) => setEndDateProcess(date ?? null)}
              showTimeSelect
              dateFormat="yyyy-MM-dd HH:mm"
              className="form-control form-control-sm"
              isClearable
              popperPlacement="bottom-start" 

       
            />

              <div className="form-text fs-8 text-danger">
                {t('End_Process_Date_des')}
              </div>


          </div>





                <button
                  type="submit"
                  className="btn btn-sm btn-outline-primary mt-4"
                  disabled={isSubmiting}
                  >
                   {t('save_changes')}
                </button>
              </form>

          </div>
          

          </div>
        </div>
    )

}




 export default Page 


 