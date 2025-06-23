
'use client'
import { useState } from "react"
import CustomModal from "@/app/(dashboard)/_components/jsx/myModal";
import { useEffect } from "react";
import { useCustomFetchMutation } from "@/app/(site)/_components/redux/features/siteApiSlice";
import { toast } from "react-toastify";

import { useLocale, useTranslations } from "next-intl";

const DepartmentAasignOrRemoveSection = ({user_id}) => {

	const [customFetch] = useCustomFetchMutation();
	
	const [canEdit, setCanEdit] = useState(false)
	const [isObjUpdateing, setIsObjUpdateing] = useState(false)
	const [allDepartments, setAllDepartments] = useState([])
	const [userDepartment, setUserDepartment] = useState([])
	const [isModalOpen, setIsModalOpen] = useState(false); // State to control modal visibility

	const locale = useLocale()
	const t = useTranslations('dashboard.users_managment.users.edit_user_department')


	const handleChange = (departmentId, isChecked) => {
		if (isChecked) {
		  setUserDepartment((prev) => [...prev, departmentId]);
		} else {
		  setUserDepartment((prev) => prev.filter((id) => id !== departmentId));
		}
	  };


	const fetchAllDepartments = async () => {
		try {
		  const response = await customFetch({
			url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/staff/ticket/departments/`,
			method: "GET",
		  });	  
		  if (response && response.data) {	
			setAllDepartments(response.data);
			console.log('response.data', response.data)
		  } else {
			console.log("Failed to get departments. Please try again.");
		  }
		} catch (error) {
		  console.error("Error fetching departments:", error);
		}
	  };
	  

	  const fetchUserDepartments = async () => {
		try {
		  const response = await customFetch({
			url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/staff/usersmanagment/users/${user_id}/department/`,
			method: "GET",
		  });	  
		  if (response && response.data) {	
			const departmentIds = response.data.map((department) => department.id);
			setUserDepartment(departmentIds);

 
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
		userDepartment.map((department_id) => {
			form.append("department[]", department_id);

		})
		try {
		  const response = await customFetch({
			url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/staff/usersmanagment/users/${user_id}/department/`,
			method: "POST",
			body:form
		  });	  
		  if (response && response.data) {	
			
			if( locale === "ar" ){
				toast.success("تم تعديل البيانات بنجاح");
			} else {
				toast.success("the user Departments has been updated succussfuly!");
			}
			
			setCanEdit(false)
			fetchUserDepartments()
		  } else {
			if( locale === "ar" ){
				toast.error("حصل خطأ رقم 1 اثناء تعديل البيانات . يرجى المحاولة مجدداً");

			} else {
				toast.error("Error1 submitting form.");

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
			if( locale === "ar" ){
				toast.error("حصل خطأ رقم2 اثناء تعديل البيانات . يرجى المحاولة مجدداً");

			} else {
				toast.error("Error2 submitting form.");			

			}
			console.log("Failed to update user 2", error);
		} finally{ setIsObjUpdateing(false)}
	  };




useEffect(() => {
	fetchAllDepartments()
	fetchUserDepartments()
  
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
 

					{allDepartments.map( (department) => (
						

						<div key={department.id} className={` col-md-3  ms-2 ${locale === "ar" ? 'form-check-reverse' : 'form-check'} `}>
							<input
								className=" form-check-input  "
								type="checkbox"
								name={department?.department_name}
								id={`${department.id}_department_id`}
								// onChange={handleChange}

								checked={userDepartment.includes(department.id)} // Check if ID is in the list
								onChange={(e) => handleChange(department.id, e.target.checked)}



								disabled={!canEdit}
		
							/>
							<label className="form-check-label  small" htmlFor={`${department.id}_department_id`}>
								 
								{locale === "ar" ?  department?.department_name_ar : department?.department_name }
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
			
			<button onClick={()=> setCanEdit(true)}    className="btn mx-2 btn-outline-primary btn-sm  ">  
				{t('edit')}
			</button>

			}



		</div>



	<CustomModal  
	id="edit_user_department_id"
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


export default DepartmentAasignOrRemoveSection