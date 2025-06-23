

 
import { parseISO, format } from "date-fns";

import { useLocale, useTranslations } from "next-intl"; // Get the current locale from next-intl
import { ar, enUS } from "date-fns/locale"; // Import necessary locales

import Link from "next/link";

import { useState } from "react";

import { useCustomFetchMutation } from "@/app/(site)/_components/redux/features/siteApiSlice";
import { toast } from "react-toastify";
import { getErrorMessage } from "@/app/public_utils/utils";
import CustomModal from "@/app/(dashboard)/_components/jsx/myModal";




export const  StepOrSubStepSingleNote = ({note={}, note_for="step",  handleReloadFlag=null , step_id=null}) => {

    const locale = useLocale(); // Get the current locale
    const currentLocale = locale === "ar" ? ar : enUS;
    const t = useTranslations('dashboard.projectFlow.single_note')
    

    const [customFetch] = useCustomFetchMutation();
 
    const [isModalOpen, setIsModalOpen] = useState(false); // State to control modal visibility


    const [deleting, setDeleting] = useState(false)


    const submit_url = note_for === "step" 
        ?  `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/staff/project_flow_template/steps_template/${note?.step_template}/steps_template_note/${note?.id}/`
        : `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/staff/project_flow_template/sub_steps/${note?.sub_step_template}/sub_step_note/${note?.id}/`  


    const handleDelete = async ( ) => {
      setDeleting(true)
       try {   
         const response = await customFetch({
          url: submit_url,
         
          method: "DELETE",
         });  
         if (response && response.data) {
            if(handleReloadFlag){handleReloadFlag()}
            if (locale === 'ar'){
            toast.success('تم الحذف بنجاح')

            }else{
            toast.success('the object has been deleted')

            }
         } else {
           toast.error(getErrorMessage(response?.error?.data))
   
         }
       } catch (error) {
         toast.error(getErrorMessage(error.data || error.message) || "Something went wrong");
       } finally{
            setDeleting(false)
            // setObjToDelete(null)
        }
     };

    const formatDate = (dateString) => {
   
        if (dateString) {
            return format(parseISO(dateString), 'dd MMM yyyy - h:mm a', { locale: currentLocale });
        }
    };
 


    return(

            <div className="note mb-2 p-2 border rounded" >
                <div className="note-header d-flex justify-content-between  small text-muted  ">
                    <span>{note?.step_note_user?.full_name} </span>
                    <span>{formatDate(note?.created_date || '')}</span> 
                </div>

                <div className="note small" dir="auto"  style={{ whiteSpace: 'pre-line' }}> 
                    {note?.note}


                </div>

                <div className="attachments  ">
                    <ul className="list-unstyled small text-end">
                         {note?.files?.map((file) => 
                            <li key={`note_${file.created_data}_${file.id}`} className="d-flex align-items-center">
                                <i className="bi bi-file-earmark" style={{ marginRight: '5px' }}></i>
                                <a href={file?.file || ''} target="_blank" rel="noopener noreferrer" className="text-muted  text-break">
                                    {file.file_name}
                                </a>
                            </li>
                        )}
                    </ul>

                    <div className="text-end mt-2 ">
                        <Link href="#"
                        
                        onClick={(e) => {
                        e.preventDefault()
                        setIsModalOpen(true)
                        }}
                        className="text-danger mx-2" title={t('delete')}><i className="bi bi-trash-fill"></i></Link>
                    </div>
                    
                    </div>



 

                <CustomModal  
                id={`delete_template_${note_for}_note_id`}
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

