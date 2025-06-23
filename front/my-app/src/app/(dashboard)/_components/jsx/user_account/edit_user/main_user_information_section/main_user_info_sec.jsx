
'use client'

import { useEffect, useState, useRef} from "react"
import { useCustomFetchMutation } from "@/app/(site)/_components/redux/features/siteApiSlice";
import { toast } from "react-toastify";
import CustomModal from "@/app/(dashboard)/_components/jsx/myModal";
 
import { useRouter } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";


const MainUserEditInfoSection = ({user_id}) => {

	const [customFetch] = useCustomFetchMutation();
 
	const t = useTranslations('dashboard.users_managment.users.edit_user_info')
	const locale = useLocale()
	
	const [canEdit, setCanEdit] = useState(false)
  
	const [selectedFile, setSelectedFile] = useState(null)
	const fileInputRef = useRef(null);
	const [isModalOpen, setIsModalOpen] = useState(false); // State to control modal visibility
  
	const [isLoading, setIsLoading] = useState(true)
	const [isObjUpdateing, setIsObjUpdateing] = useState(false)
  
	const [isProfileImageDelete, setIsProfileImageDelete] = useState(false)
  

	const router = useRouter()


	const [data, setData] = useState({
  
   
		"user": {
			"id": null,
			"email": "",
			"first_name": "",
			"last_name": "",
			"is_active": false,
			"is_staff": false,
			"is_superuser": false,
			"is_ticket_priority_support": false,
			"last_login": null
		},
		"profile": {
			"PRF_company": "",
			"PRF_country": null,
			"PRF_city": null,
			"PRF_address": null,
			"PRF_phone_number": null,
			"PRF_image": null
		}
   
  
  
	});
   
	const [reloadFlag , setReloadFlag] = useState(false)
  
	const reloadComponentMethod = () => {
	  setReloadFlag((prev) => !prev); // Toggle state to trigger a reload
	};
  
  
  
	const handleFileChange = (e) => {
		  const { name, value, type, files } = e.target;
  
		  if (type === "file") {
			// If the input is a file, update the selectedFile state
			setSelectedFile(files[0]);
		
		  } 
  
		  }
  
   
  
	const handleChange = (e) => {
	  const { name, type, value, checked } = e.target;  // Extract 'checked' for checkboxes
	  
	  // For checkboxes, use 'checked' instead of 'value'
	  const inputValue = type === 'checkbox' ? checked : value;
	
	  setData((prevState) => {
		const keys = name.split('.'); // Split the name string into keys (e.g., ['data', 'user', 'email'])
		let updatedState = { ...prevState }; // Clone the state
	
		// Traverse and update the nested object
		let current = updatedState;
		for (let i = 0; i < keys.length - 1; i++) {
		  current[keys[i]] = { ...current[keys[i]] }; // Ensure immutability
		  current = current[keys[i]];
		}
		current[keys[keys.length - 1]] = inputValue; // Set the value for checkboxes or other inputs
		
		return updatedState;
	  });
	};
  
  
  
  
  
	const fetchData = async (pageUrl) => {
	  setIsLoading(true);
	  try {
		const response = await customFetch({
		  url: pageUrl,
		  method: 'GET', // Only use 'GET' for fetching data
		  headers: {
			'Content-Type': 'application/json',
		  }, 
		});
   
		if(response && response.data) {
		  setData(response.data)
   
		} else {
		   console.log(response) 
		//    toast.error('no data')
		   router.push('/404')
		  //  throw new Error('404');  // This will trigger the custom 404 page
  
		  }
  
	  } catch (error) {
		console.error("Error fetching data:", error);
	  } finally{setIsLoading(false);}
	  
	 };
  
  
  
	 const handleSubmit = async (e) => {
	  e.preventDefault();
	  setIsObjUpdateing(true)
	  const form = new FormData();
  
	  // Append text fields to form data
  
	  form.append("user.email", data.user.email);
	  form.append("user.first_name", data.user.first_name);
	  form.append("user.last_name", data.user.last_name);
	  form.append("user.is_active", data.user.is_active);
	  form.append("user.is_staff", data.user.is_staff);
	  form.append("user.is_superuser", data.user.is_superuser);
	  form.append("user.is_ticket_priority_support", data.user.is_ticket_priority_support);
  
  
	  if(selectedFile instanceof File  ) {
		form.append("profile.PRF_image", selectedFile);
	  }
  
  
  
	  if(data?.profile?.PRF_company){ form.append("profile.PRF_company", data.profile.PRF_company) }
	  if(data?.profile?.PRF_country){form.append("profile.PRF_country", data.profile.PRF_country)}
	  if(data?.profile?.PRF_city){form.append("profile.PRF_city", data.profile.PRF_city)}
	  if(data?.profile?.PRF_address){form.append("profile.PRF_address", data.profile.PRF_address)}
	  if(data?.profile?.PRF_phone_number){form.append("profile.PRF_phone_number", data.profile.PRF_phone_number)}
	  if(isProfileImageDelete === true){form.append("profile.PRF_image_delete", true)}
	
	
	  if (  
		(data.user.email && data.user.email.trim() !== '') && 
		(data.user.first_name && data.user.first_name.trim() !== '') && 
		(data.user.last_name && data.user.last_name.trim() !== '')  
	
	  ) {
		
   
  
	  try {
		 const response = await customFetch({
		  url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/staff/usersmanagment/users/${user_id}/`,
		  method: "PUT",
		  body: form, // Send FormData as the body
		});
  
		if (response && response.data) {
   
		  setCanEdit(false)
		  fileInputRef.current.value = ""
		  setSelectedFile(null)
		  setIsProfileImageDelete(false)
		  reloadComponentMethod()  

		  if( locale==="ar" ){
			toast.success("تم تعديل البيانات بنجاح");

		  } else {
			toast.success("the user has been updated succussfuly!");

		  }
   
		} else {
			setIsObjUpdateing(false) 
 
			if( locale==="ar" ){
				toast.error("حصل خطأ رقم 1 في تعديل البيانات . يرجى المحاولة لاحقاً");

			} else{
				toast.error("Failed to submit the request.");

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


		  console.log('response', response)
		}
	  } catch (error) {
		console.error("Error submitting form:", error);
		if( locale==="ar" ){
			toast.error("حصل خطأ رقم 2 في تعديل البيانات . يرجى المحاولة لاحقاً");

		} else {
			toast.error("Error submitting form.");

		}
	  } finally{ setIsObjUpdateing(false)  }
   
		console.log("Form is valid");
	  } else {

		if( locale==="ar" ){
			toast.error("بعض الحقول الضرورية فارغة!");

		} else {
			toast.error("some mandatory fields or empty");

		}
  
	  }
  
   
	};
  
  
   
  
  
  
  useEffect(() => {
	const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/staff/usersmanagment/users/${user_id}/`
   
	fetchData(url)
  
  }, [reloadFlag]);
  


return (

	<div>
		<hr />
		<h6> {t('title')} </h6>
		<div> 	  
			<form className="  col-md-10 mb-5 "   >

			<div className="row">
				<div className="mb-3 col-md-4">
				<label htmlFor="email" className="form-label small">
				{t('Email')} <span className="text-danger">*</span>
				</label>
				<input
					name="user.email"
					onChange={handleChange}
					value={data.user.email} // Controlled input
					disabled={!canEdit}
					type="email"
					className="form-control form-control-sm" // Added 'form-control-sm' for smaller input
					id="email"
					required
					maxLength="50"
				/>
				</div>

				<div className="mb-3 col-md-4">
				<label htmlFor="first_name" className="form-label small">
				{t('First_Name')} <span className="text-danger">*</span>
				</label>
				<input
					name="user.first_name"
					onChange={handleChange}
					value={data.user.first_name ?? ""} // Controlled input
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
				{t('Last_Name')} <span className="text-danger">*</span>
				</label>
				<input
					name="user.last_name"
					onChange={handleChange}
					value={data.user.last_name ?? ""} // Controlled input
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
					name="profile.PRF_company"
					onChange={handleChange}
					value={data?.profile?.PRF_company ?? ""} // Controlled input
					disabled={!canEdit}

					type="text"
					className="form-control form-control-sm" // Added 'form-control-sm' for smaller input
					id="Company"
					maxLength="50"
				/>
				</div>



				<div className="mb-3 col-md-4">
				<label htmlFor="country" className="form-label small">
				{t('Country')}  
				</label>
				<input
					name="profile.PRF_country"
					onChange={handleChange}
					value={data?.profile?.PRF_country ?? ""} // Use empty string if null or undefined
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
						name="profile.PRF_city"
						onChange={handleChange}
						value={data?.profile?.PRF_city ?? ""} // Controlled input
						disabled={!canEdit}

						type="text"
						className="form-control form-control-sm" // Added 'form-control-sm' for smaller input
						id="City"
						maxLength="50"
					/>
				</div>


				<div className="mb-3 col-md-4">
				<label htmlFor="address" className="form-label small">
					{t('Address')}   
				</label>
				<input
					name="profile.PRF_address"
					onChange={handleChange}
					value={data?.profile?.PRF_address ?? ""} // Controlled input
					disabled={!canEdit}

					type="text"
					className="form-control form-control-sm" // Added 'form-control-sm' for smaller input
					id="address"
					maxLength="50"
				/>
				</div>

				<div className="mb-3 col-md-4">
				<label htmlFor="phone_number" className="form-label small">
				{t('Phone_Number')}  
				</label>
				<input
					name="profile.PRF_phone_number"
					onChange={handleChange}
					value={data?.profile?.PRF_phone_number ?? ""} // Controlled input
					disabled={!canEdit}

					type="text"
					className="form-control form-control-sm" // Added 'form-control-sm' for smaller input
					id="phone_number"
					maxLength="50"
				/>
				</div>




				<div className="col-12"></div>
				<div className="row mt-2 "> 
					<div className={` col-md-3  ms-2 ${locale === "ar" ? 'form-check-reverse' : 'form-check'} `}>
					<input
						className=" form-check-input "
						type="checkbox"
						name='user.is_staff'
						id="is_staff"
						onChange={handleChange}
						checked={data.user.is_staff}
						disabled={!canEdit}

					/>
					<label className="form-check-label mx-2 small" htmlFor="is_staff">
						{t('Is_Staff')} 
					</label>
					</div>


					<div  className={` col-md-3  ms-2 ${locale === "ar" ? 'form-check-reverse' : 'form-check'} `} >
					<input
						className=" form-check-input  "
						type="checkbox"
						name='user.is_active'
						id="is_active"
						onChange={handleChange}
						checked={data.user.is_active}
						disabled={!canEdit}

					/>
					<label className="form-check-label mx-2 small" htmlFor="is_active">
					{t('is_active')}
					</label>
					</div>


					<div  className={` col-md-3  ms-2 ${locale === "ar" ? 'form-check-reverse' : 'form-check'} `} >
					<input
						className="  form-check-input  "
						type="checkbox"
						name='user.is_superuser'
						id="is_superuser"
						onChange={handleChange}
						checked={data.user.is_superuser}
						disabled={!canEdit}

					/>
					<label className="form-check-label mx-2 small" htmlFor="is_superuser">
						{/* Is SuperUser */}
						{t('Is_SuperUser')}
					</label>
					</div>





					<div  className={` col-md-3  ms-2 ${locale === "ar" ? 'form-check-reverse' : 'form-check'} `} >
					<input
						className="  form-check-input  "
						type="checkbox"
						name='user.is_ticket_priority_support'
						id="is_ticket_priority_support"
						onChange={handleChange}
						checked={data.user.is_ticket_priority_support}
						disabled={!canEdit}

					/>
					<label className="form-check-label small mx-2" htmlFor="is_ticket_priority_support">
						{/* Is High Ticket Priority  */}
						{t('Is_High_Ticket_Priority')}
					</label>
					</div>



				</div>


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
					onChange={handleFileChange}
					ref={fileInputRef}
					disabled={!canEdit}

				/>
				{data?.profile?.PRF_image	 &&
				
				<div>
					<a href={data.profile.PRF_image} target="_blank" >  {t('current_image')}  </a> 
					
					<div className="form-check   mt-2  ">
						<input
						className="   "
						type="checkbox"
						name='PRF_image_delete'
						id="PRF_image_delete"
						onChange={() => setIsProfileImageDelete( (prev) => !prev  )}
						checked={isProfileImageDelete}
						disabled={!canEdit}

						/>
						<label className="form-check-label mx-2 small" htmlFor="PRF_image_delete">
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
			{isObjUpdateing ? t('updating') : t('update') }     
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
	message={t('modal_msg')}
	operationType = "Update"
	showModal={true} 
	isModalOpen={isModalOpen}
	setIsModalOpen={setIsModalOpen}

	/>  





	</div>






)




}



export default MainUserEditInfoSection