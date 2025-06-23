import { useState, useEffect } from "react";

import { FormSearchInput } from "./input_list_of_templates"

import { useCustomFetchMutation } from "@/app/(dashboard)/_components/redux_staff/features/authApiSlice"
import { getErrorMessage } from "@/app/public_utils/utils";

import { toast } from "react-toastify";



import { useTranslations, useLocale } from "next-intl";



export const ButtonCloneTemplate= ({is_template_cloned  , project_id, reloadComponentMethod , modal_id='modal_clone_id'}) => {

  const locale = useLocale()
  const [templateId, setTemplateId] = useState('');  

  const [customFetch] = useCustomFetchMutation();
  const [isSubmitting, setIsSubmitting] = useState(false)

    const t = useTranslations('dashboard.projectFlow.projectflow.projectflow_details.ButtonCloneTemplate')


  const handleTemplateChange = (selectedValue) => {
    if(selectedValue){
      setTemplateId(selectedValue);
    }else{
      setTemplateId('');
    } 
 
  };


  const handleSubmit = async (e) => {

    e.preventDefault()
    if(templateId === ''){
      toast.error('please select Template to Clone');
      return
    }
    setIsSubmitting(true);

    try {
      const response = await customFetch({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/staff/projectflow/clone_project_flow_template/${templateId}/${project_id}/`,
        method: "POST",
        body: {}
      });

      if(response && response.data) {
        setTemplateId('')
        if(locale === 'ar'){
        toast.success('تم تركيب القالب بنجاح')
        } else {
        toast.success('the project has been cloned a template successfully.')
        }

        if(reloadComponentMethod) {reloadComponentMethod()}
      } else {
          toast.error("Failed to submit the request.");
          if (response?.error?.data) {
              toast.error(getErrorMessage(response.error.data));
          }
        }

    } catch (error) {
        console.error("Submission Error:", error);
        toast.error(getErrorMessage(error.data || error.message) || "Something went wrong");
    } finally {
        setIsSubmitting(false);
    }
  };



 




    return ( <>
    
    <button 
    className="btn btn-outline-primary btn-sm small mt-2"
    data-bs-toggle="modal"
    data-bs-target={`#${modal_id}`}
    
    
    > 
           {is_template_cloned  ? t('Re_Clone_Template') :  t('Clone_Template') }
    </button>

 


    <div
        className="modal fade   "
        id={`${modal_id}`}
        tabIndex="-1"
        aria-labelledby="cloneTemplateLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog   ">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="cloneTemplateLabel">
                {is_template_cloned ?  t('Re_Clone_Template')   :  t('Clone_Template') }
                
                
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>




			<form   className="modal-body"     >

			
			<div className="mb-3">
        <FormSearchInput 
          handleobjectIdChange={handleTemplateChange}
          objectId={templateId}
          ph={   t('Select_Template')   }
          lable={   t('Select_Template')   }

        />
        {is_template_cloned ? 
          <small className="small text-danger"> { t('note')}</small>

        : ''}

			</div>

 

			</form>






            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                 { t('Cancel')}
              </button>
              <button
                disabled={isSubmitting}
                type="button"
                className="btn btn-primary"
                onClick={handleSubmit}
                data-bs-dismiss="modal"
              >
               { t('Clone') }
              </button>
            </div>
          </div>
        </div>
      </div>





    </>

    )
}