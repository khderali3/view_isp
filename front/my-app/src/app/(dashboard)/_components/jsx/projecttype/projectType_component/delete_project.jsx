
"use client"

import { useCustomFetchMutation } from "@/app/(dashboard)/_components/redux_staff/features/authApiSlice"
import CustomModal from "@/app/(dashboard)/_components/jsx/myModal";
import { useState } from "react";
import { toast } from "react-toastify";

import { useTranslations, useLocale } from "next-intl";

import { getErrorMessage } from "@/app/public_utils/utils";



import Link from "next/link";


export const DeleteButton = ({ title= 'Delete' ,item_id, handleReloadFlag=null}) => {

	const locale = useLocale()

	const t = useTranslations('dashboard.site_managment.our_product.list_manager')
    const [customFetch] = useCustomFetchMutation()
    const [isModalOpen, setIsModalOpen] = useState(false); // State to control modal visibility
	const [isSubmitting, setIsSubmitting] = useState(false)
 
  const handleDelete = async () => {
 
	try{
		setIsSubmitting(true)
		const response = await customFetch({
		   url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/staff/projectflow/project_type/${item_id}/`,
		   method: 'DELETE',  
		   headers: {
			 'Content-Type': 'application/json',
		   }, 
		 });
	
		 if( response && response.data) {
		   if(locale === "ar"){
			   toast.success("تم حذف العنصر بنجاح ");
   
		   } else {
			   toast.success("the item has been deleted");
   
		   }
			setIsModalOpen(false);
			setIsSubmitting(false)
   
			if(handleReloadFlag) {handleReloadFlag()}
   
   
		 } else {
			toast.error("Failed to submit the request.");
			if (response?.error?.data) {
				toast.error(getErrorMessage(response.error.data));
			}
		 }



	} catch(error) {
		console.log(error)			
		toast.error(getErrorMessage(error.data || error.message) || "Something went wrong");
		
	} finally{setIsSubmitting(false)}
 
  };









    return(
		<> 
		


		<Link href=""
			onClick={(e) => {
					e.preventDefault()
					setIsModalOpen(true) 
					} 
				}
			className="text-danger mx-2" title={title}><i className="bi bi-trash-fill"></i>
		</Link>



 


	  <CustomModal  
		id={`list_manager_project_type_delete${item_id}`}
		handleSubmit={handleDelete}
		submitting={isSubmitting}

		message={t('modal_del_msg')}
		operationType = "Delete"
		showModal={true} 
		isModalOpen={isModalOpen}
		setIsModalOpen={setIsModalOpen}

		/>  


		
		
		</>
    )
}