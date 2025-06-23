'use client'
import { useState, useEffect } from "react";
import { useCustomFetchMutation } from "@/app/(dashboard)/_components/redux_staff/features/authApiSlice"
import { toast } from "react-toastify";

import CustomModal from "@/app/(dashboard)/_components/jsx/myModal";




import { useTranslations, useLocale } from "next-intl";


export default function ListManagerDepartments() {
  const [data, setdata] = useState([]);
  const [editingItem, setEditingItem] = useState({
	id:null,
	department_name:'',
	department_name_ar:'',
  });

  const t = useTranslations('dashboard.users_managment.departmnets_managment')
  const locale = useLocale()
  const [isModalOpen, setIsModalOpen] = useState(false); // State to control modal visibility


  const [addingItem, setAddingItem] = useState(false)

  const [deletingItemId, setDeletingItemId] = useState(null); // Track which item is being deleted
  const [itemIdToDelete, setItemIdToDelete] = useState(null)

  const [editingItemId, setIditingItemId] = useState(null);  


  const handleEditingItem = async (e) => {
	// setAddingItem(true);
	e.preventDefault();
	setIditingItemId(editingItem.id)
	const form = new FormData();

	for (const key in editingItem) {
		if (editingItem.hasOwnProperty(key)) {
			if(key !== 'id') {
				form.append(key, editingItem[key]);
				console.log('key is' , key)
			}

		}}

	if (
		
	(editingItem.department_name && editingItem.department_name.trim() !== '') &&
	(editingItem.department_name_ar && editingItem.department_name_ar.trim() !== '') 

	
  ){ 
	try {

		const response = await customFetch({
		  url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/staff/ticket/departments/${editingItem.id}/`,
		  method: "PUT",
		  body: form, // Send FormData as the body
		});
  
		if( response && response.data){

			if(locale === "ar"){
				toast.success("تم تحديث البيانات بنجاح ");

			} else {
				toast.success("your item been Updated ");

			}
		  fetchData(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/staff/ticket/departments`)
		  setEditingItem({
					id:null,
					department_name:'',
					department_name_ar:''				
				})
		} else{
		  console.log(response)
		  if(locale === "ar"){
			toast.error("حصل خطأ رقم 1 في تحديث البيانات . يرجى المحاولة مجدداً");

		  } else {
			toast.error("Error submitting form 1.");

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
				toast.error(JSON.stringify(response.error.data));
			}






		}
  
	  } catch (error) {
		console.error("Error submitting form:", error);
		if(locale === "ar"){
			toast.error("حصل خطأ رقم 2 في تحديث البيانات . يرجى المحاولة مجدداً");

		  } else {
			toast.error("Error submitting form 2.");

		  }

 	  } finally{setIditingItemId(null)}

  } else {
	if(locale === "ar"){
		toast.error("جميع الحقول مطلوبة ");

	} else {
		toast.error("Error. all fields are required ");

	}

  }

//   setAddingItem(false);
	setIditingItemId(null)

	  
};











  const [customFetch] = useCustomFetchMutation()

	const [newItem, setNewItem] = useState({
		department_name:'',
		department_name_ar:''

	})

	const isButtonDisabled = Object.values(newItem).some((value) => value.trim() === "");

	const handleChange = (e) => {
		const { name, value } = e.target;
		setNewItem((prevState) => ({
			...prevState,
			[name]: value,
		  }));
		}


		const handleChangeEditingItem = (e) => {
			const { name, value } = e.target;
			setEditingItem((prevState) => ({
				...prevState,
				[name]: value,
			  }));
			}



const fetchData = async (pageUrl) => {
	try {
	  const response = await customFetch({
		url: pageUrl,
		method: 'GET', // Only use 'GET' for fetching data
		headers: {
		  'Content-Type': 'application/json',
		}, 
	  });
 
	  if( response && response.data) {
		setdata(response.data)

	  }


	} catch (error) {
	  console.error("Error fetching data:", error);
	}
  };

  useEffect(() => {

	fetchData(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/staff/ticket/departments/`)
}, []);




const handleaddItem = async (e) => {
	setAddingItem(true);
	e.preventDefault();
	const form = new FormData();

	for (const key in newItem) {
		if (newItem.hasOwnProperty(key)) {
			form.append(key, newItem[key]);
		}}

	if ( 


	(  newItem.department_name &&   newItem.department_name.trim() !== '' ) && 
	(  newItem.department_name_ar &&  newItem.department_name_ar.trim() !== '' ) 

  ){ 
	try {

		const response = await customFetch({
		  url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/staff/ticket/departments/`,
		  method: "POST",
		  body: form, // Send FormData as the body
		});
  
		if( response && response.data){
			if(locale === "ar"){
				toast.success("تم إضافة القسم بنجاح ");

			} else {
				toast.success("your item been Added ");

			}
		  fetchData(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/staff/ticket/departments/`)
			setNewItem({
				department_name:'',
				department_name_ar:''
			})
		} else{
		  console.log(response)
		  if(locale === "ar"){
			toast.error("حصل خطأ رقم 1 في إضافة البيانات . يرجى المحاولة مجدداً");

		  } else {
			toast.error("Error submitting form 1.");

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
				toast.error(JSON.stringify(response.error.data));
			}


		}
  
	  } catch (error) {
		console.error("Error submitting form:", error);
		if(locale === "ar"){
			toast.error("حصل خطأ رقم 2 في إضافة البيانات . يرجى المحاولة مجدداً");

		  } else {
			toast.error("Error submitting form 2.");

		  }
 	  } finally{ setAddingItem(false);}

  } else {
	if(locale === "ar"){
		toast.error("جميع الحقول مطلوبة ");

	} else {
		toast.error("Error. all fields are required ");

	}

  }

  setAddingItem(false);
	  
};



  // Delete item
  const deleteItem = async (id) => {
	setDeletingItemId(id)
	const response = await customFetch({
		url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/staff/ticket/departments/${id}`,
		method: 'DELETE',  
		headers: {
		  'Content-Type': 'application/json',
		}, 
	  });
 
	  if( response && response.data) {

		if(locale === "ar"){
			toast.success("تم حذف القسم بنجاح ");

		} else {
			toast.success("your department has been deleted ");

		}

		fetchData(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/staff/ticket/departments/`);

	  } else {

		if (response?.error?.data?.detail) {
			if(response.error.data.detail === "Permission denied for this operation."){
				if(locale === "ar") {
					toast.error(" لا يوجد لديك صلاحيات للقيام بهذه العملية!");
	
				} else {
					toast.error(response.error.data.detail);
				}
	
			} 
		} else {
			toast.error(JSON.stringify(response.error.data));
		}


	  }








	  setDeletingItemId(null)
  };

  return (
    <div className="container  ">
		<hr />
      <h6>{t('title')}</h6>

      {/* Table Display */}
      <table className="table table-bordered mt-4">
        <thead className="table-light">
          <tr>
				<th style={{ width: '5%' }}>#</th>
				<th style={{ width: '35%' }}>{t('department_list.Department_Name')}</th>
				<th style={{ width: '35%' }}  >
				{t('department_list.Department_Name_ar')}
				</th>
				<th style={{ width: '25%' }}>{t('department_list.Actions')}</th>
          </tr>
        </thead>
        <tbody>
          {data?.map((item, index) => (
            <tr key={item.id}>
              <td>{index +1}</td>
              <td>{item.department_name}</td>
              <td className="text-end" >{item.department_name_ar}</td>
              <td>
                <button
                  className="btn btn-sm btn-primary m-2"
					onClick={() => {
						setEditingItem({
							id:item.id,
							department_name:item.department_name,
							department_name_ar:item.department_name_ar
							}
						)
					}}

                  data-bs-toggle="modal"
                  data-bs-target="#editModal_department"
				   
                >
                  
				  {editingItemId === item.id ? t('department_list.Editing') : t('department_list.Edit') }
                </button>




                <button
                  className="btn btn-sm btn-danger m-2"
					onClick= { () => {
						setItemIdToDelete(item.id)
						setIsModalOpen(true)
					
					}}

				  disabled={deletingItemId === item.id}
				  
                >
                  {deletingItemId === item.id ? t('department_list.Deleting') : t('department_list.Delete')}
                 </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>


		{/* form */ }
		<div className="mb-3">

		<form   className="    "     >

          
           
		<div className="mb-3">
			<label htmlFor="department_name" className="form-label">
			{t('department_list.Department_Name')}
			</label>
			<input
				type="text"
				className="form-control"
				id="department_name"
				name="department_name"
				value={newItem?.department_name  ?? ""}
				onChange={handleChange}
			/>
		</div>


		<div className="mb-3">
			<label htmlFor="department_name_ar" className="form-label">
			{t('department_list.Department_Name_ar')}
			</label>
			<input
				type="text"
				className="form-control"
				id="department_name_ar"
				name="department_name_ar"
				value={newItem?.department_name_ar  ?? ""}
				onChange={handleChange}
			/>
		</div>








		<button
			className="btn btn-success mt-2"
			onClick={handleaddItem}
			disabled={isButtonDisabled || addingItem }
		>

			{addingItem ?  t('form_add.adding') : t('form_add.add_item') }
		</button>



		</form>


		</div>

		{/* end form */}





      {/* Modal for Editing */}
      <div
        className="modal fade"
        id="editModal_department"
        tabIndex="-1"
        aria-labelledby="editModal_departmentLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="editModal_departmentLabel">{t('form_edit.title')}</h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>




			<form   className="   modal-body  "     >


					
				<div className="  ">
				<label htmlFor="department_name" className="form-label">
				{t('department_list.Department_Name')}
				</label>
				<input
					type="text"
					className="form-control"
					id="department_name"
					name="department_name"
					value={editingItem?.department_name  || ""}
					onChange={handleChangeEditingItem}


				/>
				</div>


				<div className="mb-3">
				<label htmlFor="department_name_ar" className="form-label">
				{t('department_list.Department_Name_ar')} 
				</label>
				<input
					type="text"
					className="form-control text-end "
					id="department_name_ar"
					dir="rtl"

					name="department_name_ar"
					value={editingItem?.department_name_ar  || ""}
					onChange={handleChangeEditingItem}

				/>
				</div>





			</form>












            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                {t('form_edit.cancel')}
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleEditingItem}
                data-bs-dismiss="modal"
              >
				{editingItemId  ? t('form_edit.saving') : t('form_edit.save_changes')}
               </button>
            </div>
          </div>
        </div>
      </div>



	  <CustomModal  
		id="list_manager_department_delete"
		handleSubmit={ () =>   deleteItem(itemIdToDelete)}
		submitting={deletingItemId}
		message={t('department_list.modal_del_msg')}
		operationType = "Delete"
		showModal={true} 
		isModalOpen={isModalOpen}
		setIsModalOpen={setIsModalOpen}

		/>  









    </div>





  );
}
