
import { useState, useEffect } from "react"
import { toast } from "react-toastify";
import { getErrorMessage } from "@/app/public_utils/utils";
import { useCustomFetchMutation } from "@/app/(site)/_components/redux/features/siteApiSlice";


import { useTranslations, useLocale } from "next-intl";

export const CancelProjectFlowOrReOpen = ({projectflow_id=null , projectflow_status='' , reloadComponentMethod=null}) => {


    const locale = useLocale()
    const t = useTranslations('dashboard.projectFlow.projectflow.projectflow_details.CancelProjectFlowOrReOpen')



    const submit_url = projectflow_status === "canceled" 
        ?  `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/staff/projectflow/projectflow/${projectflow_id}/reopen_project_flow/`
        : `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/staff/projectflow/projectflow/${projectflow_id}/cancele_project_flow/`  

 
    const [submiting, setSubmitting] = useState(false)
    const [customFetch] = useCustomFetchMutation();
 
    const handleSubmit = async () => {
        setSubmitting(true)
         try {   
           const response = await customFetch({
             url: submit_url,
             method: "POST",
           });  
           if (response && response.data) {

            if(locale === 'ar'){
              if(projectflow_status === 'canceled'){
                toast.success('تم إعادة فتح المشروع بنجاح')
              } else {
                toast.success('تم إلغاء المشروع بنجاح')
              }
            } else {
              if(projectflow_status === 'canceled'){
                toast.success('the projectflow has been re-opened ')
              } else {
                toast.success('the projectflow has been canceled')
              }
            }



            if(reloadComponentMethod) {reloadComponentMethod()}

           } else {
             toast.error(getErrorMessage(response?.error?.data))
     
           }
         } catch (error) {
           toast.error(getErrorMessage(error.data || error.message) || "Something went wrong");
         } finally{setSubmitting(false)}
       };
    





    return (

        <button title={projectflow_status === 'canceled' ? t('re_open_title') : t('close_title') } onClick={handleSubmit} disabled={submiting} className="btn btn-sm btn-outline-primary mt-2"  > {projectflow_status === 'canceled' ? t('re_open_btn_label') :  t('close_btn_lable')  }    </button>


    )
}