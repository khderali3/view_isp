

"use client"

import { useCustomFetchMutation } from "@/app/(dashboard)/_components/redux_staff/features/authApiSlice"
import CustomModal from "@/app/(dashboard)/_components/jsx/myModal";
import { useState } from "react";
import { toast } from "react-toastify";

import { useTranslations, useLocale } from "next-intl";

import { getErrorMessage } from "@/app/public_utils/utils";






export const DeleteSelectedButtonLogs = ({selectedIds=[], handleReloadComponent=null, Delete_Selected_text='Delete Selected'}) => {

    const locale = useLocale()
    const [customFetch] = useCustomFetchMutation()
    const [isModalOpen, setIsModalOpen] = useState(false); // State to control modal visibility
    const [isSubmitting, setIsSubmitting] = useState(false)
 

  const handleDeleteSelected = async () => {
         setIsSubmitting(true)
         try {   
           const response = await customFetch({
             url:  `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/staff/log/logs/`,
             method: "DELETE",
              body: { ids: selectedIds },
           });  
           if (response && response.data) {

                // toast.success(getErrorMessage(response?.data))

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
         } finally{ setIsSubmitting(false)}
  };


    return (
        <>
        
        <button
            type="button"
            className="btn btn-outline-danger btn-sm d-flex align-items-center"
            disabled={selectedIds.length === 0 || isSubmitting}
            onClick={() => setIsModalOpen(true)}
            title={Delete_Selected_text}
            >
            <i className="bi bi-trash-fill mx-1"></i>{Delete_Selected_text} { selectedIds.length > 0 && `( ${selectedIds.length} )` }
        </button>
        
        
        
        
        
        
      <CustomModal  
        id={`logs_delete_selected`}
        handleSubmit={() => handleDeleteSelected()}
        submitting={isSubmitting}

        message={ locale === 'ar' ? 'هل فعلاً تريد حذف السجلات المحددة؟' : 'Are you Sure you Want to delete selected items?' }
        operationType = "Delete"
        showModal={true} 
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}

        />  
        
        
        
        
        </>




    )
}