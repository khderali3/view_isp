
 
import Link from "next/link";

import { parseISO, format } from "date-fns";

import { useLocale, useTranslations } from "next-intl"; // Get the current locale from next-intl
import { ar, enUS } from "date-fns/locale"; // Import necessary locales

import { SubStepComponent } from "./sub_step/sub_step";

import { handleTimelineColler } from "@/app/public_utils/utils";

import { ChangeStatusLogs } from "../status_change_logs";

// import { StepOrSubStepNotes } from "./notes/step_or_sub_step_notes";

import { StepOrSubStepSingleNote } from "./notes/step_or_sub_step_single_note";
import { StepOrSubStepNotes } from "./notes/step_or_sub_step_notes";


import { get_string_allow_process_by, get_string_step_or_sub_step_show_status_log_to_client_projectFlow, get_string_step_or_sub_step_start_process_strategy_projectFlow } from "@/app/(dashboard)/_components/utils/projectflow/utils";

import { StartOrEndStepOrSubStepProcess } from "../start_end_process_for_step_or_substep/start_end_process";
 

import { ResortStepUpOrDown } from "./resort_step/up_or_down_buttons";

import { ProgressCircle } from "../../progress";

import { getErrorMessage } from "@/app/public_utils/utils";

import { useCustomFetchMutation } from "@/app/(dashboard)/_components/redux_staff/features/authApiSlice";

 import { getprojectStatusBadgeColors } from "@/app/public_utils/utils";
 

import CustomModal from "@/app/(dashboard)/_components/jsx/myModal";
import { toast } from "react-toastify";
import { useState } from "react";

import { useSelector } from "react-redux";

import { useFormatNumber, useTrueFalseLabel, useStepOrSubStepProcessStrategy, useStepOrSubStepAllowedProcessBy, useStepStatus } from "@/app/public_utils/hooks";

export const StepComponent = ({ step={}, index=0, reloadComponentMethod }) =>{

    const [customFetch] = useCustomFetchMutation();
    const t = useTranslations('dashboard.projectFlow.projectflow.projectflow_step')
    const formatNumber = useFormatNumber()
    const getTrueFalseLabel = useTrueFalseLabel()
    const getStepOrSubStepProcessStrategy = useStepOrSubStepProcessStrategy()
    const getStepOrSubStepAllowedProcessBy = useStepOrSubStepAllowedProcessBy()
    const getStepStatus = useStepStatus()

    const locale = useLocale(); // Get the current locale
    const currentLocale = locale === "ar" ? ar : enUS;
    const formatDate = (dateString) => {
        if (dateString) {
            return format(parseISO(dateString), 'dd MMM yyyy - h:mm a', { locale: currentLocale });
        }
    };
 
    const [isModalOpen, setIsModalOpen] = useState(false); // State to control modal visibility
    const [deleting, setDeleting] = useState(false)



    const {  permissions, is_superuser, is_staff  } = useSelector(state => state.staff_auth);


    const hasPermissionToDeleteStep = () => {
        if (is_superuser || (permissions?.includes('usersAuthApp.projectflow_step_delete') && is_staff)) {
            return true
        }
          return false
    }




    const handleDelete = async () => {
      setDeleting(true)
       try {   
         const response = await customFetch({
          url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/staff/projectflow/projectflow/${step?.project_flow}/step/${step?.id}/`,
          method: "DELETE",
         });  
         if (response && response.data) {
            if(reloadComponentMethod){reloadComponentMethod()}
            toast.success('the object has been deleted')
         } else {
           toast.error(getErrorMessage(response?.error?.data))
   
         }
       } catch (error) {
         toast.error(getErrorMessage(error.data || error.message) || "Something went wrong");
       } finally{setDeleting(false)}
     };

    return(
 
    
        <div  className="timeline-item-dash d-flex w-100   ">



        <div className={`timeline-icon-dash`} ></div>
            <div className={`border border-secondary rounded flex-grow-1 ${locale === 'ar' ? 'me-4'   : 'ms-4'}`}>


                    <div 
                        className={`step-number rounded-circle d-flex justify-content-center align-items-center ${handleTimelineColler(step?.project_flow_step_status)}`}
                        style={{ 
                            position: 'absolute',
                            insetInlineStart: '-15px',
                            width: '30px',
                            height: '30px',
                            color: 'white',
                            fontWeight: 'bold',
                        }}
                        >
                        {index + 1}
                    </div>



                <div className="p-3">

                    <div className=" ">
 


                        <button 
                        className="btn btn-light d-flex align-items-center justify-content-center gap-2 rounded-pill px-3 py-2 shadow-sm mb-4"
                        data-bs-toggle="collapse" 
                        data-bs-target={`#step_extra_info_${step?.id}`}
                        aria-expanded="false"
                        aria-controls={`step_extra_info_${step?.id}`}
                        >
                        <i className="bi bi-info-circle-fill"></i> <span>{t('more_info')}</span>
                        </button>

                        <div id={`step_extra_info_${step?.id}`} className="collapse "  >  

 
                            <Link 
                                className="text-success mx-2"
                                href={`/staff/projectFlow/projectFlow/sub_step/${step?.project_flow}/${step?.id}/add_new_sub_step`}
                                title={t('Add_New_Sub_Step')}> 
                                <i className="bi   bi-plus-circle-fill"></i> 
                            </Link>
 

                            <Link 
                                href={`/staff/projectFlow/projectFlow/step/${step?.project_flow}/edit_step/${step?.id}`}
                                className="text-primary mx-2" title={t('Edit')}><i className="bi bi-pencil-fill"></i>

                            </Link>
 


                            {hasPermissionToDeleteStep() &&
                                <Link href=""
                                    onClick={(e) => {
                                            e.preventDefault()
                                            setIsModalOpen(true) 
                                            } 
                                        }
                                    className="text-danger mx-2" title={t('Delete')}><i className="bi bi-trash-fill"></i>
                                </Link>
                            
                            }



 
                             
                           
 



                             <ResortStepUpOrDown title={t('move_up')} move_to="up" resort_for='step' projectflow_id={step?.project_flow} step_id={step?.id} reloadComponentMethod={reloadComponentMethod} />
 
                             <ResortStepUpOrDown title={t('move_down')} move_to="down" resort_for='step' projectflow_id={step?.project_flow} step_id={step?.id} reloadComponentMethod={reloadComponentMethod} />  
 



                            <div className="  mb-2 d-flex  gap-2">
                                <span className="fw-bold  ">{t('Step_ID')} : </span> 
                                <span className="ms-2 text-secondary ">{formatNumber(step.id)}.</span>
                            </div>





                            <div className="mb-2 d-flex  gap-2">
                                <span className="fw-bold">{t('Show_To_Client')} : </span> 
                                <span className="ms-2 text-muted">{getTrueFalseLabel(step?.show_to_client) }</span>
                            </div>


                            <div className="mb-2 d-flex  gap-2 ">
                                <span className="fw-bold  ">{t('Start_Process_Strategy')} : </span> 
                                <span className="ms-2 text-muted ">{ getStepOrSubStepProcessStrategy(step?.start_process_step_strategy)}</span>
                            </div>


                            <div className="mb-2 d-flex  gap-2">
                                <span className="fw-bold">{t('Allowed_Process_By')} : </span>  
                                <span className="ms-2 text-muted">{ getStepOrSubStepAllowedProcessBy(step?.allowed_process_by) }</span>
                            </div>

                            
                            {step?.allowed_process_by === "specific_staff_group"  &&
                            
                                <div className="mb-2">
                                    <span className="fw-bold">{t('Allowed_Process_Groups')} :</span> 
                                    <span className="ms-2 text-muted">[{step?.allowed_process_groups.map(group => group.name).join(", ")}]</span>
                                </div>
                            
                            }




                            <div className  ="mb-2 d-flex  gap-2">
                                <span className="fw-bold">{t('Show_Status_Logs_To_Client')} : </span> 
                                <span className="ms-2 text-muted">{ getTrueFalseLabel(step?.show_status_log_to_client)  }</span>
                            </div>



                        </div>
                        
                        <hr />


                        <div className="row">

                            <div className="col-md-6"> 
                    


                                <div className="mb-2  d-flex  gap-2">
                                    <span className="fw-bold">{t('Step_Title')} : </span> 
                                    <span className="ms-2 text-secondary">{  locale === 'ar' ? step?.step_name_ar : step?.step_name}.</span>
                                </div>

                                <div className="mb-2 d-flex  gap-2">
                                    <div className="fw-bold">{t('Step_Details')} : </div> 

                                    <div 
                                        className="ms-2 text-muted"
                                        dir='auto'
                                        style={{whiteSpace: 'pre-line'}}
                                    >
                                         { locale === 'ar' ? step?.step_description_ar : step?.step_description }
                                    </div>
                                </div>
    



                                <div className="mb-2 d-flex  gap-2 ">
                                    <span className="fw-bold">{t('step_status')} : </span> 
                                    {/* <span className="ms-2 text-muted">{step?.project_flow_step_status && step?.project_flow_step_status}</span> */}
                                    <span className={`ms-2   ${getprojectStatusBadgeColors(step?.project_flow_step_status)} `}>{  getStepStatus(step?.project_flow_step_status)}</span>
                                </div>

 
                                <div className=" ">
                                    {step?.can_requester_start_step || step?.can_requester_end_step  ? 
                                    ( <>                                         
                                        <StartOrEndStepOrSubStepProcess disabled_status={step?.can_requester_start_step} action="start_process" resort_for='step' projectflow_id={step?.project_flow} step_id={step?.id} reloadComponentMethod={reloadComponentMethod} />  
                                        <StartOrEndStepOrSubStepProcess disabled_status={step?.can_requester_end_step} action="end_process" resort_for='step' projectflow_id={step?.project_flow} step_id={step?.id} reloadComponentMethod={reloadComponentMethod} />  
                                    </>)
                                    
                                    : ''}

                                </div>





                                
                            </div>


                            <div className="col-md-6">
                                <ProgressCircle targetPercentage={step?.step_completed_percentage || 0} />
                            </div>



                        </div>

 
                    </div> 





                {/* Start & End Process Dates */}
                <div className="row">
                    <div className="col-md-6 gap-2">
                        <span className="fw-bold">{t('Start_Process_Date')} : </span> 
                        <span className="ms-2 text-primary">{ step?.start_date_process ? formatDate(step?.start_date_process) :" - " }</span>
                    </div>
                    <div className="col-md-6 gap-2">
                        <span className="fw-bold">{t('End_Process_Date')} : </span> 
                        <span className="ms-2 text-danger">{ step?.end_date_process ? formatDate(step?.end_date_process) :" - " }</span>
                    </div>
                </div>






                    {step?.status_logs && step.status_logs.length > 0 &&
                        <div   className="mt-3">
                            <h6 className="fw-bold">{t('Change_Step_Status_Logs')}</h6>
                            <div className="list-group small border rounded p-2" style={{ maxHeight: "150px", overflowY: "auto" }}>

                            {step?.status_logs.map((log) =>  <ChangeStatusLogs key={`step_status_${log.id}`} log={log} />)}
                            </div>
                        </div> 
                    }







                    

                    <StepOrSubStepNotes 
                    notes={step?.notes || []} 
                    notes_for={"step"} 
                    step_or_step_id={step.id}
                    can_add_note={true}
                    // can_add_note={step?.can_add_note_by_requester || false}

                    />



 


        
        

                    { step?.sub_steps &&
                        <> 
                        {/* Sub-steps timeline   */}
                        <div className="position-relative sub-timeline mt-5 ">

                            {step?.sub_steps?.map( (sub_step, index) =>  
                            
                
                            <SubStepComponent
                             key={`sub_step_${sub_step.id}`} 
                             sub_step={sub_step} 
                             index={index} 
                             reloadComponentMethod={reloadComponentMethod} 
                             projectflow_id={step?.project_flow}
                             hasPermissionToDeleteStep={hasPermissionToDeleteStep}

                             
                             />
                            
                            
                            
                            )}
                    

                        </div>
                            
                        </>
                    }



                </div>


            </div>



            <CustomModal  
                id="delete_projectflow_step_id"
                handleSubmit={handleDelete}
        
                submitting={deleting}
                message={t('del_modal_msg')}
                showModal={true} 
                isModalOpen={isModalOpen}
                setIsModalOpen={setIsModalOpen}

            /> 





        </div>

                
        
        
        
        
        
        
 





    )
}