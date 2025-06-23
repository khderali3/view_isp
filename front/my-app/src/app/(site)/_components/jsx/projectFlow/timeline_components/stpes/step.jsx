




import { ProgressCircle } from "@/app/(site)/_components/jsx/projectFlow/progress";
import { useEffect } from "react";


import { parseISO, format } from "date-fns";

import { useLocale, useTranslations } from "next-intl"; // Get the current locale from next-intl
import { ar, enUS } from "date-fns/locale"; // Import necessary locales

import { SubStepComponent } from "./sub_step/sub_step";

import { handleTimelineColler } from "@/app/public_utils/utils";

import { ChangeStatusLogs } from "../status_change_logs";

// import { StepOrSubStepNotes } from "./notes/step_or_sub_step_notes";

import { StepOrSubStepSingleNote } from "./notes/step_or_sub_step_single_note";
import { StepOrSubStepNotes } from "./notes/step_or_sub_step_notes";

import { StartOrEndStepOrSubStepProcess } from "../start_end_process_for_step_or_substep/start_end_process";

 import { getprojectStatusBadgeColors } from "@/app/public_utils/utils";
import { useFormatNumber, useTrueFalseLabel, useStepOrSubStepProcessStrategy, useStepOrSubStepAllowedProcessBy, useStepStatus } from "@/app/public_utils/hooks";

export const StepComponent = ({ step={}, index=0 , reloadComponentMethod}) =>{


    const formatNumber = useFormatNumber()
    const getTrueFalseLabel = useTrueFalseLabel()
    const getStepOrSubStepProcessStrategy = useStepOrSubStepProcessStrategy()
    const getStepOrSubStepAllowedProcessBy = useStepOrSubStepAllowedProcessBy()
    const getStepStatus = useStepStatus()




    const t = useTranslations('dashboard.projectFlow.projectflow.projectflow_step')
    const locale = useLocale(); // Get the current locale
    const currentLocale = locale === "ar" ? ar : enUS;
    const formatDate = (dateString) => {
        if (dateString) {
            return format(parseISO(dateString), 'dd MMM yyyy - h:mm a', { locale: currentLocale });
        }
    };
 
    return(
 
    
        <div  className="timeline-item d-flex w-100   ">



        <div className={`timeline-icon`} ></div>
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

                    <div className="row">
                        <div className="col-md-6">


                            {/* Step id */}
                            <div className="mb-2 d-flex  gap-2">
                                <span className="fw-bold">{t('Step_ID')} : </span> 
                                <span className="ms-2 text-secondary">{formatNumber(step.id)}</span>
                            </div>





                            {/* Step Title */}
                            <div className="mb-2 d-flex  gap-2">
                                <span className="fw-bold">{t('Step_Title')} : </span> 
                                <span className="ms-2 text-secondary">{ locale === 'ar' ? step?.step_name_ar  : step?.step_name }.</span>
                            </div>

                            {/* Step Details */}

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

                            {/* Step status */}
                            <div className="mb-2 d-flex  gap-2">
                                <span className="fw-bold">{t('step_status')} : </span> 
                                {/* <span className="ms-2 text-muted">{step?.project_flow_step_status && step?.project_flow_step_status}</span> */}
                                <span className={`ms-2   ${getprojectStatusBadgeColors(step?.project_flow_step_status)} `}>{  getStepStatus(step?.project_flow_step_status)}</span>

                            </div>

                            {step?.can_requester_start_step || step?.can_requester_end_step ?
                                (<>
                                    <StartOrEndStepOrSubStepProcess disabled_status={step?.can_requester_start_step} action="start_process" resort_for='step' projectflow_id={step?.project_flow} step_id={step?.id} reloadComponentMethod={reloadComponentMethod} />  
                                    <StartOrEndStepOrSubStepProcess disabled_status={step?.can_requester_end_step} action="end_process" resort_for='step' projectflow_id={step?.project_flow} step_id={step?.id} reloadComponentMethod={reloadComponentMethod} />  
                                </>)
                            : ''
                            }




                        </div>
                        <div className="col-md-6">
                            <ProgressCircle targetPercentage={step?.step_completed_percentage || 0} />
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
                    // can_add_note={step?.allowed_process_by === "client"}
                    can_add_note={step?.can_add_note_by_requester || false}

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
                             />
                            
                            
                            
                            )}
                    

                        </div>
                            
                        </>
                    }



                </div>


            </div>
        </div>

                
        
        
        
        
        
        
 





    )
}