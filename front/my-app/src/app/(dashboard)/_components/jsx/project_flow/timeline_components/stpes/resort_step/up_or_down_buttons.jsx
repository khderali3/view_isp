


import { useCustomFetchMutation } from "@/app/(dashboard)/_components/redux_staff/features/authApiSlice"
import { getErrorMessage } from "@/app/public_utils/utils";

import { useState } from "react";
import { toast } from "react-toastify";
import Link from "next/link";

import { useLocale } from "next-intl";


export const ResortStepUpOrDown = ({title='move', resort_for='step', move_to='up', projectflow_id=null,   step_id=null, sub_step_id=null, reloadComponentMethod}) =>{

    const [customFetch] = useCustomFetchMutation();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const locale = useLocale()
     

    const submit_url = resort_for === "step" 
        ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/staff/projectflow/projectflow/${projectflow_id}/step/${step_id}/resort/resort_up_down/${move_to}/`
        : `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/staff/projectflow/projectflow/step/${step_id}/sub_step/${sub_step_id}/resort/resort_up_down/${move_to}/`  
 
        


    const handleSubmit = async (e) => {
        e.preventDefault();
        try{
            const response = await customFetch({
                url: submit_url,
                method: 'POST',
            });
            if (response && response.data) {
                const message = getErrorMessage(response.data)
                if(message === 'message: Step moved down') {
                    if(locale === 'ar'){ toast.info('تم تحريك الخطوة للأسفل');} 
                    else { toast.info('step has been moved to down')}                
                } else if (message === 'message: Step moved up'){
                    if(locale === 'ar'){ toast.info('تم تحريك الخطوة للأعلى');} 
                    else { toast.info('step has been moved to up')} 
                } else if(message === 'message: Already at the top'){
                    if(locale === 'ar'){ toast.info('الخطوة بشكل إفتراضي في الأعلى');} 
                    else { toast.info('Step Already at the top')}  
                } else if (message === 'message: Already at the bottom'){

                    if(locale === 'ar'){ toast.info('الخطوة بشكل إفتراضي في الأسفل');} 
                    else { toast.info('Step Already at the bottom')}  
                }
                
                 else{   toast.info(message); }
                
          
              



                if (reloadComponentMethod) {
                    reloadComponentMethod()
                } else {
                    console.log('reloadComponentMethod is:', reloadComponentMethod)
                }
            } else {
                toast.error("Failed to submit the request.");
                if (response?.error?.data) {
                    toast.error(getErrorMessage(response.error.data))
                   
                }
            }

        } catch(error){
            console.error("Submission Error:", error);
            // toast.error(getErrorMessage(error.data || error.message) || "Something went wrong");
        } finally{setIsSubmitting(false);}
    }

 
    return(
 
        // <button type="button" onClick={handleSubmit} disabled={isSubmitting} className="btn btn-primary btn-sm small m-2 "> {move_to === 'up' ? "MoveUp" : "MoveDown" } </button>
 

        <Link   
            href="#"

            onClick={handleSubmit}

            className="  " 
            title={title}>
            <i className={`bi  text-secondary ${ move_to === 'up' ? 'bi-caret-up-fill' : 'bi-caret-down-fill ' }`} ></i>  
        </Link>





    )
}