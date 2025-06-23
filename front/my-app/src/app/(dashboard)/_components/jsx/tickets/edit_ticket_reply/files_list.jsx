
import { useState, useEffect } from "react";
import { useCustomFetchMutation } from "@/app/(site)/_components/redux/features/siteApiSlice";
import Link from "next/link";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import CustomModal from "@/app/(dashboard)/_components/jsx/myModal";


import { useLocale, useTranslations } from "next-intl";

const FileList = ({ticket_reply_id, attached_files_title="" } ) => {
	const {  permissions, is_superuser, is_staff  } = useSelector(state => state.staff_auth);

	const [files, setFiles] = useState([])
	const [customFetch] = useCustomFetchMutation();
    const [isModalOpen, setIsModalOpen] = useState(false); // State to control modal visibility

	const [fileIdToDelete, setFileIdToDelete] = useState(null)
	const [loadingDelete , setloadingDelete] = useState(false); // Loading state

	const locale = useLocale()
    const t = useTranslations('dashboard.ticket')
 

    const hasPermissionToDeleteTicketAttachmentDelete = () => {
        if (is_superuser || (permissions?.includes('usersAuthApp.ticket_reply_attachment_delete_after_submited') && is_staff)) {
            return true
        }
  
        return false
    }


	const handleDelete = async (file_id) => {
		setloadingDelete(true)
		try {
		  // Await the customFetch call to get the response
		  const response = await customFetch({
			url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/staff/ticket/ticket_reply/files/${file_id}/`,
			method: "DELETE",
			// body: formData,  // Use FormData as the body (if needed)
		  });
	  
		  // Check if response and response.data are available
		  if (response && response.data) {
			 
			if(locale === "ar"){
				toast.success('تم حذف الملف بنجاح')

			} else {
				toast.success('the file deleted successfuly!')

			}

			setFileIdToDelete(null)
			fetchfiles()
	
		  } else {
			// Handle the error case if there's no data or an error in the response
			console.log("Failed to get data1 ", response);

			if(locale === "ar"){
				toast.error('حدث خطأ رقم 1 اثناء حذف الملف , يرجى المحاولة مجدداً')

			}else {
				toast.error('error 1 with delete file!')


			}

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
		  // Catch any errors during the fetch operation
		  console.error("Error fetching data2:", error);
		  if(locale === "ar"){
			toast.error('حدث خطأ رقم 2 اثناء حذف الملف , يرجى المحاولة مجدداً')

		  } else {
			toast.error('error 2 with delete file !')

		  }

		} finally {
			setloadingDelete(false); // Stop loading spinner
 
		  }
	  };
	  
	


	const fetchfiles = async () => {
		try {
		  // Await the customFetch call to get the response
		  const response = await customFetch({
			url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/staff/ticket/ticket_reply/${ticket_reply_id}/files/`,
			method: "GET",
			// body: formData,  // Use FormData as the body (if needed)
		  });
	  
		  // Check if response and response.data are available
		  if (response && response.data) {
	
			setFiles(response.data);
	
		  } else {
			// Handle the error case if there's no data or an error in the response
			console.log("Failed to get data1 ", response);
		  }
		} catch (error) {
		  // Catch any errors during the fetch operation
		  console.error("Error fetching data2:", error);
		}
	  };
	  
	



useEffect(() => {
    
	fetchfiles()
}, []);



    return (
        <div className="mb-3">
            <label className="form-label">{attached_files_title}</label>
            <ul className="list-group  ">
                {files.map((file) => (
					<li
					key={file.id}
					className="list-group-item d-flex justify-content-between align-items-start mb-2 flex-wrap ps-2"
					>
						<span className=" ">
							<Link
							href={file.ticket_replay_file}
							target="_blank"
							rel="noopener noreferrer"
							className="text-decoration-none"
							>
							 {file.ticket_replay_file_name} 
							</Link>
						</span>
						{hasPermissionToDeleteTicketAttachmentDelete() && ( 
						
							<button
								type="button"
								className="btn btn-outline-danger btn-sm   mt-md-0  "
								onClick= { () => {
									setFileIdToDelete(file?.id)
									setIsModalOpen(true)
								}}
								disabled={loadingDelete}
							>
								{loadingDelete && fileIdToDelete === file.id ?
								
								(locale === "ar" ? "جاري الحذف..." : 'Deleting...' )
								:   (locale === "ar" ? "حذف" : 'Delete' )
								
								} 
							</button>
						
						)}

					</li>
		
		

                ))}
            </ul>



	<CustomModal  
	id="delete_ticket_modal_id"
	handleSubmit={() => handleDelete(fileIdToDelete)}
	submitting={loadingDelete}
	// message={"Are you sure you want to delete this file ?"}
	message={t('modal_delete_file_confirm_msg')}


	showModal={true} 
	isModalOpen={isModalOpen}
	setIsModalOpen={setIsModalOpen}
	operationType="Delete"

	/>  




        </div>
    );
};

export default FileList;
