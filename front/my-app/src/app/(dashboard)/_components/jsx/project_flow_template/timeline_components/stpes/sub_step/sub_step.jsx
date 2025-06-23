


 
import { parseISO, format } from "date-fns";

 import { ar, enUS } from "date-fns/locale"; // Import necessary locales
import Link from "next/link";

import { handleTimelineColler } from "@/app/public_utils/utils";
import { useLocale, useTranslations } from "next-intl";
import { ChangeStatusLogs } from "../../status_change_logs";


import { ResortStepUpOrDown } from "../resort_step/up_or_down_buttons";


import { StepOrSubStepNotes } from "../notes/step_or_sub_step_notes";
import { get_string_allow_process_by, get_string_show_status_log_to_client, get_string_start_process_strategy } from "@/app/(dashboard)/_components/utils/projectflow/utils";

import { toast } from "react-toastify";
 
import CustomModal from "@/app/(dashboard)/_components/jsx/myModal";

import { useState } from "react";
import { getErrorMessage } from "@/app/public_utils/utils";

import { useCustomFetchMutation } from "@/app/(dashboard)/_components/redux_staff/features/authApiSlice";

import { useRouter } from "next/navigation";


import { useFormatNumber, useTrueFalseLabel, useStepOrSubStepProcessStrategy, useStepOrSubStepAllowedProcessBy } from "@/app/public_utils/hooks";





export const SubStepComponent = ({sub_step={}, index=0, template_id,  reloadComponentMethod}) =>{

    const [customFetch] = useCustomFetchMutation();
    const router = useRouter()
    const t = useTranslations('dashboard.projectFlow.template_sub_step')
    const getFormatNumber = useFormatNumber()
    const getTrueFalseLabel = useTrueFalseLabel()
    const getStepOrSubStepProcessStrategy = useStepOrSubStepProcessStrategy()
    const getStepOrSubStepAllowedProcessBy = useStepOrSubStepAllowedProcessBy()






    const locale = useLocale(); // Get the current locale
    const currentLocale = locale === "ar" ? ar : enUS;
    const formatDate = (dateString) => {
           if (dateString) {
            return format(parseISO(dateString), 'dd MMM yyyy - h:mm a', { locale: currentLocale });
        }
    };
 


    const [isModalOpen, setIsModalOpen] = useState(false); // State to control modal visibility
    const [deleting, setDeleting] = useState(false)


    const handleDelete = async () => {
      setDeleting(true)
       try {   
         const response = await customFetch({
          url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/staff/project_flow_template/steps_template/${sub_step?.step_template}/sub_steps/${sub_step?.id}/`,
          method: "DELETE",
         });  
         if (response && response.data) {
            if(reloadComponentMethod){reloadComponentMethod()}
            if(locale === 'ar'){
                toast.success('تم الحذف بنجاح')
            } else {
                toast.success('the object has been deleted')
            }
            
         } else {
           toast.error(getErrorMessage(response?.error?.data))
   
         }
       } catch (error) {
         toast.error(getErrorMessage(error.data || error.message) || "Something went wrong");
       } finally{setDeleting(false)}
     };









    return(
        <div  className="sub-timeline-item d-flex w-100">
            <div className={`small-timeline-icon `}></div>
            <div className={`border border-secondary rounded flex-grow-1 p-3 ${locale === 'ar' ? 'me-4'   : 'ms-4'}`}>
 
                <div 
                    className="step-number rounded-circle d-flex justify-content-center align-items-center bg-secondary"
                    style={{ 
                        position: 'absolute', 
                        top: '-5px', 
                        insetInlineStart: '-10px',  
                        width: '20px', 
                        height: '20px',  
                        color: 'white', 
                        fontWeight: 'bold' 
                    }}
                    >
                    {index + 1}
                </div>


 


                        <button 
                            className="btn btn-light d-flex align-items-center justify-content-center gap-2 rounded-pill px-3 py-2 shadow-sm mb-4"
                            data-bs-toggle="collapse" 
                            data-bs-target={`#substep_template_extra_info_${sub_step?.id}`}
                            aria-expanded="false"
                            aria-controls={`substep_template_extra_info_${sub_step?.id}`}
                            >
                            <i className="bi bi-info-circle-fill"></i> <span>{t('more_info')}</span>
                        </button>

                        <div id={`substep_template_extra_info_${sub_step?.id}`} className="collapse "  >  

                        <div className="actions mb-2">


                            <Link 
                                href={`/staff/projectFlow/projectFlowTemplate/sub_step/${template_id}/${sub_step?.step_template}/edit_sub_step/${sub_step?.id}`}
                                className="text-primary mx-2" title={t('Edit')}><i className="bi bi-pencil-fill"></i>

                            </Link>

                            <Link href=""
                                onClick={(e) => {
                                        e.preventDefault()
                                        setIsModalOpen(true) 
                                        } 
                                    }
                                className="text-danger mx-2" title={t('Delete')}><i className="bi bi-trash-fill"></i>
                            </Link>


                            <ResortStepUpOrDown title={t('move_up')} move_to="up" resort_for='sub_step' step_id={sub_step?.step_template}  sub_step_id={sub_step?.id} reloadComponentMethod={reloadComponentMethod} />

                            <ResortStepUpOrDown title={t('move_down')} move_to="down" resort_for='sub_step' step_id={sub_step?.step_template}  sub_step_id={sub_step?.id} reloadComponentMethod={reloadComponentMethod} />  




                        </div>



                        <div className="mb-2 d-flex align-items-center gap-2">
                            <span className="fw-bold"> {t('sub_Step_ID')} : </span> 
                            <span className="ms-2 text-secondary">{  getFormatNumber(sub_step?.id) }</span>
                        </div>




                        <div className="mb-2 d-flex align-items-center gap-2">
                        <span className="fw-bold">{t('Show_To_Client')} : </span> 
                        <span className="ms-2 text-muted">{  getTrueFalseLabel(sub_step?.show_to_client)}</span>
                    </div>


                    <div className="mb-2 d-flex align-items-center gap-2">
                        <span className="fw-bold">{t('Start_Process_Strategy')} : </span> 
                        <span className="ms-2 text-muted">{  getStepOrSubStepProcessStrategy(sub_step?.start_process_sub_step_strategy)  } </span>
                    </div>



                    <div className="mb-2 d-flex align-items-center gap-2">
                        <span className="fw-bold">{t('Allowed_Process_By')} : </span> 
                        <span className="ms-2 text-muted">{  getStepOrSubStepAllowedProcessBy(sub_step?.allowed_process_by)  }</span>
                    </div>

                    {sub_step?.allowed_process_by === "specific_staff_group"  &&
                            
                            <div className="mb-2 d-flex align-items-center gap-2">
                                <span className="fw-bold">{t('Allowed_Process_Groups')} : </span> 
                                <span className="ms-2 text-muted">[{sub_step.allowed_process_groups.map(group => group.name).join(", ")}]</span>
                            </div>
                        
                        }
 

 


                        <div className  ="mb-2 d-flex align-items-center gap-2">
                            <span className="fw-bold">{t('Show_Status_Logs_To_Client')} : </span> 
                            <span className="ms-2 text-muted">{ getTrueFalseLabel(sub_step?.show_status_log_to_client) }</span>
                        </div>






                    </div>











 
                    <div className="mb-2 d-flex align-items-center gap-2">
                        <span className="fw-bold">{t('sub_Step_Title')} : </span> 
                        <span className="ms-2 text-secondary">{ locale ==='ar' ?  sub_step?.sub_step_name_ar : sub_step?.sub_step_name  }</span>
                    </div>

 
                    <div className="mb-2 d-flex align-items-center gap-2">
                        <div className="fw-bold">{t('sub_Step_Details')} : </div> 
                        <div 
                            className="ms-2 text-muted"
                            dir="auto"  style={{ whiteSpace: 'pre-line' }}
                        >
                                { locale ==='ar' ?  sub_step?.sub_step_description_ar : sub_step?.sub_step_description }
                        </div>
                    </div>




                    <StepOrSubStepNotes
                     notes={sub_step?.notes || []}
                     notes_for={"sub_step"} 
                     step_or_step_id={sub_step.id} 
                     can_add_note={true}
                    // can_add_note={sub_step?.can_add_note_by_requester || false}



                     />


            </div>





            <CustomModal  
                id="delete_template_substep_id"
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