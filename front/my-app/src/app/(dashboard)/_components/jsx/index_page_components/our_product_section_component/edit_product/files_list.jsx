
import { useState, useEffect } from "react";
import { useCustomFetchMutation } from "@/app/(site)/_components/redux/features/siteApiSlice";
import Link from "next/link";
import { toast } from "react-toastify";

import { useLocale, useTranslations } from "next-intl";

export const FilesList = ({product_id, files_type} ) => {
 
	const [files, setFiles] = useState([])
	const [customFetch] = useCustomFetchMutation();

	const [fileIdToDelete, setFileIdToDelete] = useState(null)
	const [loadingDelete , setloadingDelete] = useState(false); // Loading state

	const locale = useLocale()
    const t = useTranslations('dashboard.ticket')
 

	const getBaseUrl = (files_type) => {
		if (files_type === "extra_images") {
			return `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/staff/site/product/${product_id}/extra_images/`;
		} 
		
		if (files_type === "attachment") {
			return `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/staff/site/product/${product_id}/attachment/`;
		}

	}; 


	const handleDelete = async (file_id) => {
		setloadingDelete(true)
		try {
		  // Await the customFetch call to get the response
		  const response = await customFetch({
			url: `${getBaseUrl(files_type)}${file_id}`,
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
			url: `${getBaseUrl(files_type)}`,
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
}, [files_type]);



    return (
        <div className="mb-3">
            <label className="form-label"></label>
            <ul className="list-group  ">
                {files.map((file) => (
					
					<li
					key={file.id}
					className="list-group-item d-flex justify-content-between align-items-start mb-2 flex-wrap ps-2"
					>
						<span className=" ">
							<Link
							href={file.file}
							target="_blank"
							rel="noopener noreferrer"
							className="text-decoration-none"
							>
							 {file.file_name} 
							</Link>
						</span>
 
						
							<button
								type="button"
								className="btn btn-outline-danger btn-sm   mt-md-0  "
								onClick={() => handleDelete(file.id)}

								disabled={loadingDelete}
							>
								{loadingDelete && fileIdToDelete === file.id ?
								
								(locale === "ar" ? "جاري الحذف..." : 'Deleting...' )
								:   (locale === "ar" ? "حذف" : 'Delete' )
								
								} 
							</button>
						
 

					</li>
		
		

                ))}
            </ul>


        </div>
    );
};

 
