'use client'

import { useState, useEffect, useRef } from "react"

import CustomModal from "@/app/(dashboard)/_components/jsx/myModal"
import { useCustomFetchMutation } from "@/app/(dashboard)/_components/redux_staff/features/authApiSlice"
import { toast } from "react-toastify"
import { useLocale, useTranslations } from "next-intl"
import { setprofileImage } from "@/app/(dashboard)/_components/redux_staff/features/authSlice"

import { useDispatch } from "react-redux"


const Page = () =>{

	const fileInputRef = useRef(null);
	const t = useTranslations('dashboard.account.edit_profile')
	const [loading, setLoading] = useState(false)
	const locale = useLocale()
	const [canEdit, setCanEdit] = useState(false)
	const [isObjUpdateing, setIsObjUpdateing] = useState(false)
	const [isModalOpen, setIsModalOpen] = useState(false); // State to control modal visibility
	const dispatch = useDispatch()
	
	const [data, setData] = useState({
		first_name: "",
		last_name: "",
		PRF_company: "",
		PRF_country: "",
		PRF_city: "",
		PRF_address: "",
		PRF_phone_number: "",
		PRF_image: null,            
		});

		const [selectedFile, setSelectedFile] = useState(null)
        const [PRF_image_delete, setPRF_image_delete] =  useState(false)
		const [customFetch] = useCustomFetchMutation()

		const handleChange = (e) => {
            const { name, value, type, files } = e.target;

            if (type === "file") {
              // If the input is a file, update the selectedFile state
              setSelectedFile(files[0]);
            } else {
              // If the input is not a file, update the data state
              setData((prevState) => ({
                ...prevState,
                [name]: value,
              }));
            }
          };


 const handleSubmit = async (e) => {
	e.preventDefault();
	setIsObjUpdateing(true)
	const form = new FormData();
	// Append text fields to form data
	form.append("first_name", data.first_name );
	form.append("last_name", data.last_name );
	form.append("PRF_company", data.PRF_company || "");
	form.append("PRF_country", data.PRF_country || "");
	form.append("PRF_city", data.PRF_city || "");
	form.append("PRF_address", data.PRF_address || "");
	form.append("PRF_phone_number", data.PRF_phone_number || "");


	if(selectedFile instanceof File  ) {
		form.append("PRF_image", selectedFile);
	}
	if(PRF_image_delete) {
	  form.append("PRF_image_delete", true);

	}


	try {
	  // Send form data using customFetch mutation
	  const response = await customFetch({
		url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/staff/auth/profile/`,
		method: "POST",
		body: form, // Send FormData as the body
	  });

	  if( response && response.data){
		setCanEdit(false)

		if(locale === "ar") {
		  toast.success("تم تحديث الملف الشخصي بنجاح");

		} else {
		  toast.success("your profile has been updated ");

		}

		dispatch(setprofileImage(response?.data?.PRF_image))
		setPRF_image_delete(false)
		fileInputRef.current.value = ""
 
		fetchData(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/staff/auth/profile/`)
		console.log('response.data', response.data.PRF_image)

	  } else{
		console.log(response)

		if(locale === "ar"){
		  toast.error("خطأ1 في تحديث الملف الشخصي");

		} else {
		  toast.error("Error submitting form 1.");

		}
	  }

	} catch (error) {
	  console.error("Error submitting form:", error);

	  if(locale === "ar"){
		toast.error("خطأ 2 في تحديث الملف الشخصي");

	  } else {
		toast.error("Error submitting form2.");

	  }
	}finally{	setIsObjUpdateing(false)	}
	  
  };



   const fetchData = async (pageUrl) => {
	setLoading(true);
	try {
	  const response = await customFetch({
		url: pageUrl,
		method: 'GET', // Only use 'GET' for fetching data
		headers: {
		  'Content-Type': 'application/json',
		}, 
	  });
 
	  setData(response.data)


	} catch (error) {
	  console.error("Error fetching data:", error);
	}
	setLoading(false);
  };



useEffect(() => {
	fetchData(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/staff/auth/profile/`)

},[] );









	return(

		<div> 
		<div className="app-content-header  ">
  
  
   
  
		</div>
  
		<div className="app-content  ">
   
  
		  <div className="     min-vh-150 bg-white p-3 border rounded  " >
  
  
			<div className="d-flex justify-content-between align-items-center">
			  <h2> {t('title')}  </h2>
			   
			</div>







		<div>
		<hr />
 
		<div> 	  
			<form className="  col-md-10 mb-5 "   >

			<div className="row">
 

				<div className="mb-3 col-md-4">
				<label htmlFor="first_name" className="form-label small">
				    {t('First_Name')} 
				</label>
				<input
					name="first_name"
					onChange={handleChange}
					value={data.first_name ?? ""}  
					disabled={!canEdit}

					type="text"
					className="form-control form-control-sm" // Added 'form-control-sm' for smaller input
					id="first_name"
					required
					maxLength="50"
				/>
				</div>

				<div className="mb-3 col-md-4">
				<label htmlFor="last_name" className="form-label small">
				     {t('Last_Name')}
				</label>
				<input
					name="last_name"
					onChange={handleChange}
					value={data.last_name ?? ""} 
					disabled={!canEdit}

					type="text"
					className="form-control form-control-sm" // Added 'form-control-sm' for smaller input
					id="last_name"
					required
					maxLength="50"
				/>
				</div>






				<div className="mb-3 col-md-4">
				<label htmlFor="Company" className="form-label small">
				   {t('Company')}
				</label>
				<input
					name="PRF_company"
					onChange={handleChange}
					value={data.PRF_company ?? ""} 
					disabled={!canEdit}

					type="text"
					className="form-control form-control-sm" 
					id="Company"
					maxLength="50"
				/>
				</div>



				<div className="mb-3 col-md-4">
				<label htmlFor="country" className="form-label small">
				     {t('Country')}
				</label>
				<input
					name="PRF_country"
					onChange={handleChange}
					value={data?.PRF_country ?? ""}  
					disabled={!canEdit}

					type="text"
					className="form-control form-control-sm" // Added 'form-control-sm' for smaller input
					id="country"
					maxLength="50"
				/>
				</div>

				<div className="mb-3 col-md-4">
					<label htmlFor="country" className="form-label small">
						       {t('City')}
					</label>
					<input
						name="PRF_city"
						onChange={handleChange}
						value={data?.PRF_city ?? ""} 
						disabled={!canEdit}

						type="text"
						className="form-control form-control-sm"  
						id="City"
						maxLength="50"
					/>
				</div>


				<div className="mb-3 col-md-4">
				<label htmlFor="address" className="form-label small">
					     {t('Address')}
				</label>
				<input
					name="PRF_address"
					onChange={handleChange}
					value={data?.PRF_address ?? ""}  
					disabled={!canEdit}

					type="text"
					className="form-control form-control-sm"  
					id="address"
					maxLength="50"
				/>
				</div>

				<div className="mb-3 col-md-4">
				<label htmlFor="phone_number" className="form-label small">
			     {t('Phone_Number')}
				</label>
				<input
					name="PRF_phone_number"
					onChange={handleChange}
					value={data?.PRF_phone_number ?? ""}  
					disabled={!canEdit}

					type="text"
					className="form-control form-control-sm"  
					id="phone_number"
					maxLength="50"
				/>
				</div>




				<div className="col-12"></div>

			</div>



			<div > 
				<div className="mt-3 col-md-4 ">
				<label htmlFor="prod_image" className="form-label small">
				   {t('image')}
				</label>
				<input
					type="file"
					className="form-control  form-control-sm"
					accept="image/*"
					id="prod_image"
					name="prod_image"                
					onChange={handleChange}
					ref={fileInputRef}
					disabled={!canEdit}

				/>
				 
				 {data.PRF_image	 &&
					<div>
						<a href={data.PRF_image} target="_blank" > {t('current_image')}   </a> 
						
						<div className="form-check   mt-2  ">
								<input
								className=" form-check-input   "
								type="checkbox"
								name='PRF_image_delete'
								id="PRF_image_delete"
								onChange={() => setPRF_image_delete( (prev) => !prev  )}
								checked={PRF_image_delete}
								disabled={!canEdit}

								/>
								<label className="form-check-label  small" htmlFor="PRF_image_delete">
								 {t('Delete_Image')}
								</label>
							</div>
					</div>
				 }
				</div>
				

			</div>
			</form>

			{ canEdit ?
			<>
			<button  
			// onClick={ handleSubmit }
			onClick={setIsModalOpen}
			  className="btn btn-primary btn-sm  mx-2"
			disabled={isObjUpdateing}
			
			>  
			{isObjUpdateing ?    t('updating') :   t('update') }     
			</button>




			<button onClick={()=> setCanEdit(false)}     className="btn btn-secondary btn-sm  mx-2 ">  
				     {t('cancel')}
			</button>
			</>

			:  
			
			<button onClick={()=> setCanEdit(true)}     className="btn   btn-outline-primary mx-2  btn-sm  ">  
				     {t('edit')}
			</button>

			}



		</div>



	<CustomModal  
	id="edit_user_id"
	handleSubmit={handleSubmit}
	submitting={isObjUpdateing}
	message= {t('modale_msg')}
	operationType = "Update"
	showModal={true} 
	isModalOpen={isModalOpen}
	setIsModalOpen={setIsModalOpen}

	/>  





	</div>

	</div>


</div>

</div>

	)
}



export default Page
