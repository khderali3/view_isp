
'use client'
import { useState } from "react"
import CustomModal from "@/app/(dashboard)/_components/jsx/myModal";
import { useEffect } from "react";
import { useCustomFetchMutation } from "@/app/(site)/_components/redux/features/siteApiSlice";
import { toast } from "react-toastify";



import { useLocale, useTranslations } from "next-intl";


const GroupAasignOrRemoveSection = ({user_id}) => {

	const [customFetch] = useCustomFetchMutation();
	
	const [canEdit, setCanEdit] = useState(false)
	const [isObjUpdateing, setIsObjUpdateing] = useState(false)

	const [allGroups, setAllGroups] = useState([])
	const [userGroups, setUserGroups] = useState([])

	const locale = useLocale()
	const t = useTranslations('dashboard.users_managment.users.edit_user_groups')

	const [isModalOpen, setIsModalOpen] = useState(false); // State to control modal visibility


	const handleChange = (groupsId, isChecked) => {
		if (isChecked) {
			setUserGroups((prev) => [...prev, groupsId]);
		} else {
			setUserGroups((prev) => prev.filter((id) => id !== groupsId));
		}
	  };


	const fetchAllGroups = async () => {
		try {
		  const response = await customFetch({
			url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/staff/usersmanagment/group/`,
			method: "GET",
		  });	  
		  if (response && response.data) {	
			setAllGroups(response.data);
			console.log('response.data', response.data)
		  } else {
			console.log("Failed to get groups. Please try again.", response);
		
		  }
		} catch (error) {
		  console.error("Error fetching departments:", error);
		}
	  };
	  

	  const fetchUserGroups = async () => {
		try {
		  const response = await customFetch({
			url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/staff/usersmanagment/users/${user_id}/group/`,
			method: "GET",
		  });	  
		  if (response && response.data) {	
			const groupIds = response.data.map((group) => group.id);
			setUserGroups(groupIds);

 
		  } else {
			console.log("Failed to get departments. Please try again.");
		  }
		} catch (error) {
		  console.error("Error fetching departments:", error);
		}
	  };




	  const handleSubmit = async (e) => {
		e.preventDefault();
		setIsObjUpdateing(true)
		const form = new FormData();
		userGroups.map((group_id) => {
			form.append("group[]", group_id);

		})
		try {
		  const response = await customFetch({
			url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/staff/usersmanagment/users/${user_id}/group/`,
			method: "POST",
			body:form
		  });	  
		  if (response && response.data) {	
			fetchUserGroups()
			if(locale === "ar"){
				toast.success("تم تعديل البيانات بنجاح");

			} else {
				toast.success("the user Groups has been updated succussfuly!");

			}
			setCanEdit(false)
 
		  } else {
			if(locale === "ar"){
				toast.error("حدث خطأ رقم 1 أثناء التعديل . يرجى المحاولة لاحقاً");

			} else {
				toast.error("Error 1 submitting form.");

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

			
			console.log("Failed to update user 1", response);
		  }
		} catch (error) {
			if(locale === "ar"){
				toast.error("حدث خطأ رقم 2 أثناء التعديل . يرجى المحاولة لاحقاً");

			} else {
				toast.error("Error 2 submitting form.");			

			}
			console.log("Failed to update user 2");
		} finally{ setIsObjUpdateing(false)}
	  };




useEffect(() => {
	fetchAllGroups()
	fetchUserGroups()
  
}, []);




	return(

		<div>
		<hr />
		<h6> {t('title')} </h6>
		<div> 	  
			<form className="  col-md-10 mb-5 "   >

			<div className="row">
 
 

				<div className="col-12"></div>
				<div className="row mt-2 "> 
 

					{allGroups.map( (group) => (
						

						<div key={group.id}className={` col-md-3  ms-2 ${locale === "ar" ? 'form-check-reverse' : 'form-check'} `} >
							<input
								className="  form-check-input "
								type="checkbox"
								name={group?.name}
								id={`${group?.id}_group_id`}
								checked={userGroups.includes(group.id)} // Check if ID is in the list
								onChange={(e) => handleChange(group.id, e.target.checked)}
								disabled={!canEdit}
		
							/>
							<label className="form-check-label   small" htmlFor={`${group?.id}_group_id`}>
								{group?.name}
							</label>
						</div>
					) )}
 



				</div>


			</div>

 
			</form>

			{ canEdit ?
		
			<> 
			<button  
			// onClick={ handleSubmit }
			onClick={setIsModalOpen}
			  className="btn btn-primary btn-sm mx-2 "
			disabled={isObjUpdateing}
			
			>  
			{isObjUpdateing ? t('updating') : t('update') }     
			</button>



			<button onClick={()=> setCanEdit(false)}    className="btn btn-secondary btn-sm  mx-2 ">  
				{t('cancel')}
			</button>
			</>


			:  
			
			<button onClick={()=> setCanEdit(true)}     className="btn btn-outline-primary mx-2 btn-sm  ">  
				{t('edit')}
			</button>

			}



		</div>



	<CustomModal  
	id="edit_user_group_id"
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


export default GroupAasignOrRemoveSection