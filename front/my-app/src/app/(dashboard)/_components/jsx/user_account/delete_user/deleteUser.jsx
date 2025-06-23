'use client'
import CustomModal from "@/app/(dashboard)/_components/jsx/myModal";
import { useCustomFetchMutation } from "@/app/(site)/_components/redux/features/siteApiSlice";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";

import { getErrorMessage } from "@/app/public_utils/utils";


import { useLocale } from "next-intl";



const DeleteUserButton = ({user_id}) => {
	const route = useRouter()
	const [customFetch] = useCustomFetchMutation();
	const [isModalOpen, setIsModalOpen] = useState(false); // State to control modal visibility
	const [isDeleting, setIsDeleting] = useState(false)

	const locale = useLocale()






	const handleDelete = async ( ) => {
		setIsDeleting(true);
		try {
		  const response = await customFetch({
			url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/staff/usersmanagment/users/${user_id}/`,
			method: 'DELETE',
			headers: {
			  'Content-Type': 'application/json',
			},
		  });
	  
		  if (response && response.data) {
			if(locale === "ar"){
				toast.success('تم حذف المستخدم بنجاح')
			} else {
				toast.success('the user has been deleted successfully!')
			}
			
			route.push('/staff/users');
		  } else {
			if(locale === "ar"){
				toast.error('حصل خطأ رقم 1 أثناء محاولة حذف المستخدم . يرجى المحاولة لاحقاً')
				toast.error(getErrorMessage(response?.error?.data))

			} else {
				toast.error('error 1 with delete user!')
				toast.error(getErrorMessage(response?.error?.data))
			}
			console.log('error1', response)

			if (response?.error?.data?.detail) {
				if(response.error.data.detail === "Permission denied for this operation."){
					if(locale === "ar") {
						toast.error(" لا يوجد لديك صلاحيات للقيام بهذه العملية!");
		
					} else {
						toast.error(response.error.data.detail);
					}
		
				}
			}


		  }
		} catch (error) {
			if(locale === "ar"){
				toast.error('حصل خطأ رقم 2 أثناء محاولة حذف المستخدم . يرجى المحاولة لاحقاً')
				 toast.error(getErrorMessage(error.data || error.message) || "Something went wrong");
			} else {
				toast.error('error 2 with delete user!')
				toast.error(getErrorMessage(error.data || error.message) || "Something went wrong");
			}
	
		  console.error("Error 2 deleting user:", error);
		} finally {
		  setIsDeleting(false);
		}
	  };
	  
	
	

	return (
		<> 
		<a
			href="#"
			
			className={`text-danger`} 

			title="Delete"
			onClick={ (e) => {
				e.preventDefault(); 
				setIsModalOpen(true)

				
			} }                                 
		>
			<i className="bi bi-trash-fill"></i>
		</a>


		<CustomModal  
		id="delete_user_id"
		handleSubmit={ handleDelete}
		submitting={isDeleting}
		message={ locale === "ar"  ? "هل فعلاً تريد حذف هذا المستخدم؟" : "Are you sure you want to Delete this User ?" }
		operationType = "Delete"
		showModal={true} 
		isModalOpen={isModalOpen}
		setIsModalOpen={setIsModalOpen}

		/>  

	</>
		
	)
 
}

export default DeleteUserButton