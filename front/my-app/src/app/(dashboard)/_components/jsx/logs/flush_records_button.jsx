

"use client"

import { useCustomFetchMutation } from "@/app/(dashboard)/_components/redux_staff/features/authApiSlice"
import CustomModal from "@/app/(dashboard)/_components/jsx/myModal";
import { useState } from "react";
import { toast } from "react-toastify";

import {  useLocale } from "next-intl";

import { getErrorMessage } from "@/app/public_utils/utils";

 

export const FlushLogsButton = ({ handleReloadComponent=null,  Delete_Selected_text='Flush All Logs', data_len=0}) => {

    const locale = useLocale()
    const [customFetch] = useCustomFetchMutation()
    const [isModalOpen, setIsModalOpen] = useState(false); // State to control modal visibility
    const [isSubmitting, setIsSubmitting] = useState(false)
 
 

  const handleDeleteAllLogs = async () => {
      setIsSubmitting(true)
         try {   
           const response = await customFetch({
             url:  `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/staff/log/logs/delete_all/`,
             method: "DELETE",
           });  
           if (response && response.data) {

   
                if(locale === 'ar'){
                    toast.success('تم الحذف بنجاح')
                } else {
                    toast.success('the items has been deleted')
                }

                if(handleReloadComponent){handleReloadComponent()}

           } else {

            if(locale === 'ar'){
              if(getErrorMessage(response?.error?.data) === 'detail: Permission denied for this operation.'){
                 toast.error('لايوجد لديك صلاحيات للقيام بهذه العملية')
              } else {
                 toast.error(getErrorMessage(response?.error?.data))
              }
            } else {
               toast.error(getErrorMessage(response?.error?.data))
            }

             


              setIsSubmitting(false)
           }
         } catch (error) {
          toast.error(getErrorMessage(error.data || error.message) || "Something went wrong");
         } finally{  setIsSubmitting(false)}
  };



 

    return (
        <>
        
        
        
        <button
          type="button"
          className="btn btn-danger btn-sm d-flex align-items-center"
          onClick={() => setIsModalOpen(true)}
          title={Delete_Selected_text}
          disabled={data_len === 0 || isSubmitting}
        >
          <i className="bi bi-exclamation-triangle-fill mx-1"></i>{Delete_Selected_text}
        </button>



        
        
      <CustomModal  
        id={`FlushLogsButton`}
        handleSubmit={() => handleDeleteAllLogs()}
        submitting={isSubmitting}

        message={ locale === 'ar' ? 'هل فعلاً تريد حذف كل السجلات من قاعدة البيانات؟' : 'Are you Sure you Want to delete or logs from DB ?' }
        operationType = "Delete"
        showModal={true} 
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}

        />  
        
        
        
        
        </>




    )
}