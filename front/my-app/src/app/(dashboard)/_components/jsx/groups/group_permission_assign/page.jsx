
'use client'
import { useState } from "react"
import CustomModal from "@/app/(dashboard)/_components/jsx/myModal";
import { useEffect } from "react";
import { useCustomFetchMutation } from "@/app/(site)/_components/redux/features/siteApiSlice";
import { toast } from "react-toastify";


import { useTranslations, useLocale } from "next-intl";
import { useSelector } from "react-redux";

const GroupPermissionAasignOrRemoveSection = ({group_id}) => {
	const {  permissions, is_superuser, is_staff  } = useSelector(state => state.staff_auth);

	const [customFetch] = useCustomFetchMutation();
	
	const [canEdit, setCanEdit] = useState(false)
	const [isObjUpdateing, setIsObjUpdateing] = useState(false)

	const [allPermissions, setAllPermissions] = useState([])
	const [groupPermissions, setGroupPermissions] = useState([])
	const [groupName, setGroupName] = useState('')
	const t = useTranslations('dashboard.users_managment.group_permissoins')
	const locale = useLocale()
	const t_permissions = useTranslations('dashboard.users_managment.permissions')



	const [isModalOpen, setIsModalOpen] = useState(false); // State to control modal visibility


	const handleChange = (permissionId, isChecked) => {
		if (isChecked) {
			setGroupPermissions((prev) => [...prev, permissionId]);
		} else {
			setGroupPermissions((prev) => prev.filter((id) => id !== permissionId));
		}
	  };


	const fetchAllPermissions = async () => {
		try {
		  const response = await customFetch({
			url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/staff/usersmanagment/permissions/`,
			method: "GET",
		  });	  
		  if (response && response.data) {	
			setAllPermissions(response.data);
 		  } else {
			console.log("Failed to get permission. Please try again.", response);
		
		  }
		} catch (error) {
		  console.error("Error fetching permission:", error);
		}
	  };
	  

	  const fetchGroupPermissions = async () => {
		try {
		  const response = await customFetch({
			url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/staff/usersmanagment/group/${group_id}/permission/`,
			method: "GET",
		  });	  
		  if (response && response.data) {	
			const permissionsIds = response.data.permissions.map((permission) => permission.id);
			setGroupPermissions(permissionsIds);
			setGroupName(response.data.group_name)
  
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
		groupPermissions.map((permission_id) => {
			form.append("permission[]", permission_id);

		})
		try {
		  const response = await customFetch({
			url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/staff/usersmanagment/group/${group_id}/permission/`,
			method: "POST",
			body:form
		  });	  
		  if (response && response.data) {	
			fetchGroupPermissions()
			
			setCanEdit(false)
			if(locale === "ar"){
				toast.success("تم تعديل صلاحيات المجموعة بنجاح");

			} else {
				toast.success("the group permissions has been updated succussfuly!");

			}
		  } else {
			if(locale === "ar"){
				toast.error("حصل خطأ رقم 1 أثناء تعديل صلاحيات المجموعة . يرجى المحاولة مجدداً");

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
			} else {
				toast.error(JSON.stringify(response?.error?.data));
			}




			
			console.log("Failed to update group 1", response);
		  }
		} catch (error) {
			if(locale === "ar"){
				toast.error("حصل خطأ رقم 2 أثناء تعديل صلاحيات المجموعة . يرجى المحاولة مجدداً");

			} else {
				toast.error("Error 2 submitting form.");			

			}
			console.log("Failed to update group 2");
		} finally{ setIsObjUpdateing(false)}
	  };




useEffect(() => {
	fetchAllPermissions()
	fetchGroupPermissions()
  
}, []);



if (!is_superuser && !(permissions?.includes('usersAuthApp.user_managment') && is_staff)) {
	return;
  } 

	return(

		<div>
		<hr />
		{/* <h6> Edit Group Permissions (Group Name: {groupName})   </h6> */}
		<h6> {t('title.main_title')} ( {t('title.group_name')} {groupName} )   </h6>


		<div> 	  
			<form className="  col-md-12 mb-5 "   >

			<div className="row">
 
 

				<div className="col-12"></div>
				<div className="row mt-2 "> 
 

					{allPermissions.map( (permission) => (
						

						<div    key={permission.id} className={` col-md-3  ms-2 ${locale === "ar" ? 'form-check-reverse' : 'form-check'} `}>
							<input
							  
								className="form-check-input "
								type="checkbox"
								name={permission?.name}
								id={`${permission?.id}_permission_id`}
								checked={groupPermissions.includes(permission.id)} // Check if ID is in the list
								onChange={(e) => handleChange(permission.id, e.target.checked)}
								disabled={!canEdit}
								 
		
							/>
							<label    className="form-check-label mx-2   small" htmlFor={`${permission?.id}_permission_id`}>
								 
								{t_permissions(permission.codename)}
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
			  className="btn btn-primary btn-sm "
			disabled={isObjUpdateing}
			
			>  
			{isObjUpdateing ? t('updating') : t('update') }     
			</button>



			<button onClick={()=> setCanEdit(false)}     className="btn btn-secondary btn-sm  mx-2 ">  
			{t('cancel')}
			</button>
			</>


			:  
			
			<button onClick={()=> setCanEdit(true)}    className="btn btn-outline-primary mx-2 btn-sm  ">  
			{t('edit')}
			</button>

			}
 


		</div>



	<CustomModal  
	id="edit_Group_permission_id"
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


export default GroupPermissionAasignOrRemoveSection