'use client';

import { useState, useEffect } from "react"
import { useParams } from 'next/navigation'

import { useCustomFetchMutation } from "@/app/(dashboard)/_components/redux_staff/features/authApiSlice";

// import { ProjectFlowNotes } from "@/app/(dashboard)/_components/jsx/project_flow_template/project_comments/projectFlowComments";


import { ProjectFlowNotes } from "@/app/(dashboard)/_components/jsx/project_flow/project_comments/projectFlowComments";

import { ProgressCircleDetailsInfo } from "@/app/(dashboard)/_components/jsx/project_flow/progress";



import { parseISO, format } from "date-fns";
  
 
import { useSelector } from "react-redux";
 
import Link from "next/link";

import { ButtonCloneTemplate } from "@/app/(dashboard)/_components/jsx/project_flow/clone_template_components/clone_template_button";

import { toast } from "react-toastify";

import { useRouter } from "next/navigation";

 
import { useTranslations, useLocale } from "next-intl";

import { ar, enUS } from "date-fns/locale"; // Import necessary locales

// import { Timeline } from "@/app/(dashboard)/_components/jsx/project_flow_template/timeline";

import { Timeline } from "@/app/(dashboard)/_components/jsx/project_flow/timeline";
 

import CustomModal from "@/app/(dashboard)/_components/jsx/myModal";

import { CancelProjectFlowOrReOpen } from "@/app/(dashboard)/_components/jsx/project_flow/cancel_or_re-open_projectflow/cancel_or_re_open_projectflow";

import { getprojectStatusBadgeColors } from "@/app/public_utils/utils";

import { ViewProductInstalledButton } from "@/app/(dashboard)/_components/jsx/project_flow/view_installed_products_buttun_modal/button_view_modal";

import { getErrorMessage } from "@/app/public_utils/utils";



import { useTrueFalseLabel, useStepsProcessStrategy, useManualStartMode, useProjectStatus } from "@/app/public_utils/hooks"; 




const Page = () => {

 useTrueFalseLabel, useStepsProcessStrategy, useManualStartMode, useProjectStatus

    const getTrueFalseLabel = useTrueFalseLabel()
    const getStepsProcessStrategy = useStepsProcessStrategy()
    const getManualStartMode = useManualStartMode()
    const getProjectStatus = useProjectStatus()






    const t_common = useTranslations('common')
 
    const t = useTranslations('dashboard.projectFlow.projectflow.projectflow_details')


    const locale = useLocale(); // Get the current locale



    const currentLocale = locale === "ar" ? ar : enUS;



    const {  permissions, is_superuser, is_staff  } = useSelector(state => state.staff_auth);
    const [canReply, setCanReply] = useState(false)


    const hasPermissionToDeleteProjectFlow = () => {
        if (is_superuser || (permissions?.includes('usersAuthApp.projectflow_delete') && is_staff)) {
            return true
        }
          return false
    }






    const {id} = useParams()  

    const [data, setData] = useState({})
    const [loading, setLoading] = useState(true); // Loading state


    const [customFetch] = useCustomFetchMutation();

    const router = useRouter()

    const [isModalOpen, setIsModalOpen] = useState(false); // State to control modal visibility
    const [deleting, setDeleting] = useState(false)





    const [reloadFlag , setReloadFlag] = useState(false)

    const reloadComponentMethod = () => {
      setReloadFlag((prev) => !prev);  
    };
  
  
 
    const handleDelete = async () => {
        setDeleting(true)
         try {   
           const response = await customFetch({
             url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/staff/projectflow/projectflow/${id}/`,
             method: "DELETE",
           });  
           if (response && response.data) {
            if(locale === 'ar'){
                toast.success('تم الحذف بنجاح')
            } else {
                toast.success('the projectFlow has been deleted')
            }
            router.push('/staff/projectFlow/projectFlow')

           } else {
             toast.error(getErrorMessage(response?.error?.data))
     
           }
         } catch (error) {
           toast.error(getErrorMessage(error.data || error.message) || "Something went wrong");
         } finally{setDeleting(false)}
       };
    


    const formatDate = (dateString) => {
   
        if (dateString) {
            return format(parseISO(dateString), 'dd MMM yyyy - h:mm a', { locale: currentLocale });
        }
    };
 

 
   
      const formatNumber = (number) => {
        if(number){
            const formatter = new Intl.NumberFormat(locale === "ar" ? "ar-EG" : "en-US"); // Arabic for "ar", fallback to English
            return formatter.format(number);
        }

      };



 


    const fetchData = async (pageUrl) => {
        setLoading(true);
        try {
          const response = await customFetch({
            url: pageUrl,
            method: 'GET', // Only use 'GET' for fetching data
            headers: {
              'Content-Type': 'application/json',
            }, 
          });
     
          if(response && response.data) {
            setData(response.data)
            console.log('data', response.data)

          } else {
                console.log(response) 
                router.push('/404')
            }

        } catch (error) {
          console.error("Error fetching data:", error);
        }
        setLoading(false);
       };
    


useEffect(() => {    
    const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/staff/projectflow/projectflow/${id}/get_full_flow/`
    fetchData(url)
}, [ reloadFlag ]);


    return (



        <div  className="container-fluid overflow-hidden w-100 p-0 m-0" > 
            <div className="app-content-header ">
    

    
            </div>
    
            <div className="app-content  bg-white    pt-4 ">
    
    
            
            <div className="   mt-2  ">
                <h6> <Link href='/staff/projectFlow/projectFlow'>

                 {t('mini_nav.ProjectFlow')}  
                </Link>   - {t('mini_nav.projectflow_Details')} </h6>
                <hr />
            </div>


        <div className="   ">


 

        <div className=" col-11  border-bottom border-2   my-2  ">
            <h3 className="text-break mx-2 " dir="auto"> { locale === 'ar' ? data?.project_type_name_ar : data?.project_type_name } </h3>
        </div>

        <div className="row d-flex justify-content-between">


            <div className="col-lg-4 col-md-10 d-lg-none d-block    ">
                <div className="dropdown ">
                    <div className="container  ">

                <button
                    className="d-block d-lg-none border-0   border-bottom collapse btn  "
                    id="toggleButton"
                    data-bs-toggle="collapse"
                    data-bs-target="#collapseExample"
                    aria-expanded="false"
                    aria-controls="collapseExample"
                >
                    {/* Ticket Details  */}
                    <i className="bi bi-caret-down ms-2 me-2" />
                    {t('details_btn')} 
                    
                </button>



                    <hr className="d-block" />
                    <div
                        id="collapseExample"
                        className="card collapse  toggle-content mt-3 "
                    >

                        <div className="card-body">
                            {/* Toggle Button */}
                            <button 
                            className="btn btn-light d-flex align-items-center justify-content-center gap-2 rounded-pill px-3 py-2 shadow-sm mb-4"
                            data-bs-toggle="collapse" 
                            data-bs-target="#extra_info"
                            aria-expanded="false"
                            aria-controls="extra_info"
                            >
                            <i className="bi bi-info-circle-fill"></i> <span> {t('More_Info')} </span>
                            </button>

            
                            <div id="extra_info" className="collapse "  >  
                                <div className="p-1 row col-12 ">
                                    <div className="col-6 text-muted">{t('projectflow_id')}</div>
                                    <div className="col-6">#{formatNumber(data?.id)}</div>
                                </div>



                                <div className="p-1 row col-12 ">
                                    <div className="col-6 text-muted">{t('Is_Template_Cloned')}</div>
                                    <div className="col-6">{ getTrueFalseLabel(data?.is_template_cloned )}</div>
                                </div>

                                <div className="p-1 row col-12 ">
                                    <div className="col-6 text-muted">{t('Template_Cloned_Name')}</div>
                                    <div className="col-6">{data?.template_name_cloned_from || '-'}</div>
                                </div>

                                <div className="p-1 row col-12 ">
                                    <div className="col-6 text-muted">{t('Steps_Process_Strategy')}</div>
                                    <div className="col-6">{ getStepsProcessStrategy(data?.default_start_process_step_or_sub_step_strategy)}</div>
                                </div>

                                <div className="p-1 row col-12 ">
                                    <div className="col-6 text-muted">{t('Manual_Start_Mode')}</div>
                                    <div className="col-6">{ getManualStartMode(data?.manual_start_mode)}</div>
                                </div>

                                <div className="p-1 row col-12 ">
                                    <div className="col-6 text-muted">{t('Auto_Start_First_Step')}</div>
                                    <div className="col-6">{  getTrueFalseLabel(data?.auto_start_first_step_after_clone)}</div>
                                </div>

                                <div className="p-1 row col-12 ">
                                    <div className="col-6 text-muted">{t('Show_Steps_To_Client')}</div>
                                    <div className="col-6">{  getTrueFalseLabel(data?.show_steps_to_client) }</div>
                                </div>

                                <div className="p-1 row col-12 ">
                                    <div className="col-6 text-muted">{t('Show_Step_Status_Logs_To_Client')}</div>
                                    <div className="col-6">{  getTrueFalseLabel(data?.show_steps_or_sub_steps_status_log_to_client)}</div>
                                </div>

            
                                    <Link
    
                                        href={`/staff/projectFlow/projectFlow/step/${data?.id}/add_new_step`}
                                        
                                        className="text-success mx-2"
                                        title={t('Add_New_Step')}>
                                        <i className="bi   bi-plus-circle-fill"></i> 
                                    </Link>
    



    
                                    {/* <Link className="btn btn-outline-primary  btn-sm small mt-2" href={`/staff/projectFlow/projectFlow/edit_projectflow/${id}`}>Edit ProjectFlow</Link> */}
    
                                    
                                    <Link 
                                        href={`/staff/projectFlow/projectFlow/edit_projectflow/${id}`}
                                    
                                        className="text-primary mx-2" title={t('Edit')}><i className="bi bi-pencil-fill"></i>
                                    </Link> 
                                    
                                



    
                                { hasPermissionToDeleteProjectFlow() && 
 
                                    <Link href=""
                                        onClick={(e) => {
                                            e.preventDefault()
                                            setIsModalOpen(true) 
                                            } 
                                        }
                                        className="text-danger mx-2" title={t('Delete')}><i className="bi bi-trash-fill"></i>
                                    </Link>
                                }


 



                                <div className="   ">
                                    <ButtonCloneTemplate is_template_cloned={data?.is_template_cloned} project_id={data?.id} reloadComponentMethod={reloadComponentMethod} modal_id={'modal_id_main_card'} />
                                </div>

                                <div> 
                                    <CancelProjectFlowOrReOpen projectflow_id={data?.id} projectflow_status={data?.project_flow_status} reloadComponentMethod={reloadComponentMethod} />
                                </div>

                                {/* <div> 
                                    <ViewProductInstalledButton  modal_id={`installed_products_sm_${data?.id}`} projectflow_id={data?.id}  />
                                </div> */}

                            </div>


                            <hr />

                            
                            <div className="p-1 row col-12 align-items-center ">
                                <div className="col-6 text-muted">{t('Project_Type')}</div>
                                <div className="col-6">{ locale === 'ar' ? data?.project_type_name_ar : data?.project_type_name }</div>
                            </div>

                            <div className="p-1 row col-12 ">
                                <div className="col-6  text-muted">
                
                                    {t('Requester')}
                                </div>
                                <div className="col-6">
                                    {data?.project_created_user?.full_name}
                                </div>
                            </div>


                            <div className="p-1 row col-12 ">
                                <div className="col-6  text-muted">
                
                                    {t('Related_User')}
                                </div>
                                <div className="col-6">
                                    {data?.project_created_user?.full_name}
                                </div>
                            </div>


                            <div className="p-1 row col-12 ">
                                <div className="col-6  text-muted">
                
                                {t('Contact_phone')}
                                </div>
                                <div className="col-6">
                                    {data?.contact_phone_no}
                                </div>
                            </div>

                            <div className="p-1 row col-12 ">
                                <div className="col-6  text-muted">
                
                                {t('Project_Address')}
                                </div>
                                <div className="col-6">
                                    {data?.project_address}
                                </div>
                            </div>


                            <div className="p-1 row col-12 ">
                                <div className="col-6  text-muted">
                
                                {t('created_ip_address')}
                                </div>
                                <div className="col-6">
                                    {data?.created_ip_address}
                                </div>
                            </div>







                            <div className="p-1 row col-12">
                                <div className="col-6  text-muted">
                                     {t('Created')} 
                                </div>
                                <div className="col-6">
                                    {formatDate( data?.created_date)}
                                </div> 
                            </div>
                            <div className="p-1 row col-12 ">
                                <div className="col-6  text-muted">
                                     {t('Latest_activity')} 
                                </div>
                                <div className="col-6">
                                    {formatDate( data?.latest_activity)}
                                </div>
                            </div>

                            <div className="p-1 row col-12 ">
                                <div className="col-6  text-muted">
                                     {t('status')}
                                </div>
                                <div className="col-6">
                                    {/* {data?.project_flow_status} */}

                                    <span className={` ${getprojectStatusBadgeColors(data?.project_flow_status)}  `}>
                                        {  getProjectStatus( data?.project_flow_status) }
                                    </span>



                                </div>
                            </div>

                            <div> 
                                <ViewProductInstalledButton  modal_id={`installed_products_lg_${data?.id}`}   projectflow_id={data?.id} />
                            </div>



                            <hr />

                        <div className="p-1 row col-12 d-flex justify-content-start   align-items-center ">
                            <div className="col-6  text-muted">
                                 {t('Progress')}
                            </div>
                            <div className="col-6">

                                <ProgressCircleDetailsInfo  targetPercentage={data?.steps_completion_percentage || 0} animation_speed={100}/>
            
                            </div>

                        </div>
    
                        </div>

    

                    </div>
                    </div>
                </div>


 

                
            </div>


            <div className="col-lg-7  ">


        <div className="ticket-prof   mt-3  ">


            <div className=" d-flex  align-items-center mb-5">

                <img

                src={data?.project_created_user?.PRF_image ? data.project_created_user.PRF_image : "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBwgHBgkIBwgKCgkLDRYPDQwMDRsUFRAWIB0iIiAdHx8kKDQsJCYxJx8fLT0tMTU3Ojo6Iys/RD84QzQ5OjcBCgoKDQwNGg8PGjclHyU3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3N//AABEIAJQAswMBIgACEQEDEQH/xAAaAAEAAwEBAQAAAAAAAAAAAAAAAQIDBAUH/8QALBABAAICAAUDAgUFAAAAAAAAAAECAxEEEjFBUSEycZGhEyJSYbEUIzNCgf/EABUBAQEAAAAAAAAAAAAAAAAAAAAB/8QAFBEBAAAAAAAAAAAAAAAAAAAAAP/aAAwDAQACEQMRAD8A+4gAAAAAAAAiZ13BIrzx5OevkFhEWiZ9JhIAAAAAAAAAAAAAAAAClrxHyre+/SOigLTaZ+PCoAAAJiZjogBpGTtZeJjswTW01BuIrMTHokAAAAAAAAAABlktv0jovedV/diAAACJmIjczqPIJGFuKpHtibfZEcVH6J+oOgUx5KXj8s7nvC4AAJrPLO20TtgvjtqdA1AAAAAAAABEzqJBled2VAAAETOomZ6Q4cuT8S2+3aHTxVtY4iO8uMABUTE6ncdXbhy/iV9fdHVwtuFtrLEdpRXYAAADes7hLPHPZoAAAAAAArf2yspk9sgyAAABz8X7K/LldvE158Xp2nbiUABBpg/y1+Wbbha82XfgHYAigAL4vdLVjj9zYAAAAAABW3SVgHOExqdAAADjz4ZrO6xM1/h2Im0R1mI+ZB5w7bUw268v/JRGLDHj6g5aUm86rDux0jHXlj6kTSI1E1j4lYAAAAF8XWWqmONVXAAAAAAAABnkjuzbzG40xtHLOgQplyRjruevaPK8zqJmekPPyXnJabSC2TNfJ1nUeIZgqGjQAajwmtppO6zqUAOvDxHPPLedW7T5bvNdvD358fr1j0RWqaxM2iOyGuOuo35BcAAAAAAAAABW1eaFgHHxO64rbcL18uOuWvLbo87Nw98XrPrXzCjEOwIAAAAN+En+5MeYZY6WyW1SJl38NwsYvzWndv4BpSneerUEUAAAAAAAAAAAAABhl4XFkneuW3mGF+Bt/peJ+YdwDzP6TN4ifiSOEzfp+70wHnV4LJPWax92+Pgsce+Zs6gEVrFY1WIiP2SAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP//Z"}

                width="40" height="40" 
                className="  rounded-circle me-2"
                />


                <div className="d-flex flex-column justify-content-center ">
                    <h6 className="m-0 fs-6 text-muted">{data?.project_created_user?.full_name}

                    {data?.project_created_user?.is_staff &&  <span className="badge bg-light text-dark ms-2"> {t_common('staff')} </span> }

                    </h6>
                    <p className="m-0 text-muted"> {formatDate( data?.created_date)  }</p> 
                </div>


            </div>


            <div className="ticket-details-text" dir="auto" >
             {data?.details}

                <div className=" pt-3 mt-3 ">
                    {data?.files?.map(file => {

                        return(
                            <div key={file.id} className=" m-0 p-0 ">
                                <Link href={file.file} className="  m-0 p-0" target="_blank">
                                    <i className="fa fa-file me-2"></i> {file.file_name}
                                </Link>
                            </div>
                            
                        )
                    })}
                </div>

            </div>
            <hr   />
        </div>






                {/* start template body   */}
                    

                <Timeline data={data} reloadComponentMethod={reloadComponentMethod} />


                {/* end template body */}
            </div>




            <div className="col-lg-5  ">
                <div className="card   d-lg-block d-none">
 
                    <div className="card-body">
                        {/* Toggle Button */}
                        <button 
                        className="btn btn-light d-flex align-items-center justify-content-center gap-2 rounded-pill px-3 py-2 shadow-sm mb-4"
                        data-bs-toggle="collapse" 
                        data-bs-target="#extra_info"
                        aria-expanded="false"
                        aria-controls="extra_info"
                        >
                        <i className="bi bi-info-circle-fill"></i> <span> {t('More_Info')}</span>
                        </button>

        
                        <div id="extra_info" className="collapse "  >  
                            <div className="p-1 row col-12 ">
                                <div className="col-6 text-muted">{t('projectflow_id')}</div>
                                <div className="col-6">#{formatNumber(data?.id)}</div>
                            </div>



                            <div className="p-1 row col-12 ">
                                <div className="col-6 text-muted">{t('Is_Template_Cloned')}</div>
                                <div className="col-6">{ getTrueFalseLabel(data?.is_template_cloned )}</div>
                            </div>

                            <div className="p-1 row col-12 ">
                                <div className="col-6 text-muted">{t('Template_Cloned_Name')}</div>
                                <div className="col-6">{data?.template_name_cloned_from || '-'}</div>
                            </div>

                            <div className="p-1 row col-12 ">
                                <div className="col-6 text-muted">{t('Steps_Process_Strategy')}</div>
                                <div className="col-6">{ getStepsProcessStrategy(data?.default_start_process_step_or_sub_step_strategy)}</div>
                            </div>

                            <div className="p-1 row col-12 ">
                                <div className="col-6 text-muted">{t('Manual_Start_Mode')}</div>
                                <div className="col-6">{ getManualStartMode(data?.manual_start_mode)}</div>
                            </div>

                            <div className="p-1 row col-12 ">
                                <div className="col-6 text-muted">{t('Auto_Start_First_Step')}</div>
                                <div className="col-6">{ getTrueFalseLabel(data?.auto_start_first_step_after_clone)}</div>
                            </div>

                            <div className="p-1 row col-12 ">
                                <div className="col-6 text-muted">{t('Show_Steps_To_Client')}</div>
                                <div className="col-6">{ getTrueFalseLabel(data?.show_steps_to_client)}</div>
                            </div>

                            <div className="p-1 row col-12 ">
                                <div className="col-6 text-muted">{t('Show_Step_Status_Logs_To_Client')}</div>
                                <div className="col-6">{ getTrueFalseLabel(data?.show_steps_or_sub_steps_status_log_to_client)}</div>
                            </div>

         
                                <Link
 
                                    href={`/staff/projectFlow/projectFlow/step/${data?.id}/add_new_step`}
                                    
                                    className="text-success mx-2"
                                    title={t('Add_New_Step')}>
                                    <i className="bi   bi-plus-circle-fill"></i> 
                                </Link>
 



 
                                {/* <Link className="btn btn-outline-primary  btn-sm small mt-2" href={`/staff/projectFlow/projectFlow/edit_projectflow/${id}`}>Edit ProjectFlow</Link> */}
 
                                
                                <Link 
                                    href={`/staff/projectFlow/projectFlow/edit_projectflow/${id}`}
                                
                                    className="text-primary mx-2" title={t('Edit')}><i className="bi bi-pencil-fill"></i>
                                </Link> 
                                
                               



 



                                { hasPermissionToDeleteProjectFlow() && 
 
                                    <Link href=""
                                        onClick={(e) => {
                                            e.preventDefault()
                                            setIsModalOpen(true) 
                                            } 
                                        }
                                        className="text-danger mx-2" title={t('Delete')}><i className="bi bi-trash-fill"></i>
                                    </Link>
                                }



                            <div className="   ">
                                 <ButtonCloneTemplate is_template_cloned={data?.is_template_cloned} project_id={data?.id} reloadComponentMethod={reloadComponentMethod}/>
                            </div>

                             <div> 
                                 <CancelProjectFlowOrReOpen projectflow_id={data?.id} projectflow_status={data?.project_flow_status} reloadComponentMethod={reloadComponentMethod} />
                            </div>
{/* 
                            <div> 
                                 <ViewProductInstalledButton  modal_id={`installed_products_lg${data?.id}`}   projectflow_id={data?.id} />
                            </div> */}

                        </div>


                        <hr />

                        
                        <div className="p-1 row col-12 align-items-center ">
                            <div className="col-6 text-muted">{t('Project_Type')}</div>
                            <div className="col-6">{ locale === 'ar' ? data?.project_type_name_ar : data?.project_type_name }</div>
                        </div>

                        <div className="p-1 row col-12 ">
                            <div className="col-6  text-muted">
            
                                {t('Requester')}
                            </div>
                            <div className="col-6">
                                {data?.project_created_user?.full_name}
                            </div>
                        </div>


                        <div className="p-1 row col-12 ">
                            <div className="col-6  text-muted">
            
                               {t('Related_User')}
                            </div>
                            <div className="col-6">
                                {data?.project_user?.full_name}
                            </div>
                        </div>



                        <div className="p-1 row col-12 ">
                            <div className="col-6  text-muted">
            
                              {t('Contact_phone')}
                            </div>
                            <div className="col-6">
                                {data?.contact_phone_no}
                            </div>
                        </div>

                        <div className="p-1 row col-12 ">
                            <div className="col-6  text-muted">
            
                               {t('Project_Address')}
                            </div>
                            <div className="col-6">
                                {data?.project_address}
                            </div>
                        </div>

                        <div className="p-1 row col-12 ">
                            <div className="col-6  text-muted">
            
                            {t('created_ip_address')}
                            </div>
                            <div className="col-6">
                                {data?.created_ip_address}
                            </div>
                        </div>











                        <div className="p-1 row col-12">
                            <div className="col-6  text-muted">
                                 {t('Created')} 
                            </div>
                            <div className="col-6">
                                {formatDate( data?.created_date)}
                            </div> 
                        </div>
                        <div className="p-1 row col-12 ">
                            <div className="col-6  text-muted">
                                 {t('Latest_activity')} 
                            </div>
                            <div className="col-6">
                                {formatDate( data?.latest_activity)}
                            </div>
                        </div>

                        <div className="p-1 row col-12 ">
                            <div className="col-6  text-muted">
                                 {t('status')}
                            </div>
                            
                            <div className="col-6">
                                <span className={` ${getprojectStatusBadgeColors(data?.project_flow_status)}  `}>
                                    {  getProjectStatus( data?.project_flow_status)}
                                </span>
                            </div>



                        </div>


                        <div> 
                            <ViewProductInstalledButton  modal_id={`installed_products_lg${data?.id}`}   projectflow_id={data?.id} />
                        </div>



                        <hr />

                    <div className="p-1 row col-12 d-flex justify-content-start   align-items-center ">
                        <div className="col-6  text-muted">
                             {t('Progress')}
                        </div>
                        <div className="col-6">

                            <ProgressCircleDetailsInfo  targetPercentage={data?.steps_completion_percentage || 0} animation_speed={100}/>
        
                        </div>

                    </div>
 
                    </div>

 





                </div>








                <hr />
                <ProjectFlowNotes project_status={data?.project_flow_status} notes={data?.notes || []} project_id={data?.id} />

            </div>


 


        </div>
        </div>
     
    






    
            </div>



    <CustomModal  
        id="delete_projectFlow_id"
        handleSubmit={handleDelete}
 
        submitting={deleting}
        message={t('modal_msg')}

        showModal={true} 
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}

    /> 





          </div>


 
    )
}


export default Page