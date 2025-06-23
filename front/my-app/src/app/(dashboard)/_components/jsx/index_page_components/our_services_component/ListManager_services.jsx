'use client'
import { useState, useEffect } from "react";
import { useCustomFetchMutation } from "@/app/(dashboard)/_components/redux_staff/features/authApiSlice"
import { toast } from "react-toastify";

import CustomModal from "@/app/(dashboard)/_components/jsx/myModal";



import { useTranslations, useLocale } from "next-intl";



export default function ListManagerServices() {
  const [data, setdata] = useState([]);
  const [editingItem, setEditingItem] = useState({
	id:null,
	service_name:'',
	service_name_ar:'',
  });

  const t = useTranslations('dashboard.site_managment.our_services.list_manager')
  const locale = useLocale()



  const [isModalOpen, setIsModalOpen] = useState(false); // State to control modal visibility


  const [addingItem, setAddingItem] = useState(false)
  const [deletingItemId, setDeletingItemId] = useState(null); // Track which item is being deleted

  const [editingItemId, setIditingItemId] = useState(null);  
  const [itemIdToDelete, setItemIdToDelete] = useState(null)


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
		
	(editingItem.service_name && editingItem.service_name.trim() !== '') &&
	(editingItem.service_name_ar && editingItem.service_name_ar.trim() !== '') 
  ){ 
	try {

		const response = await customFetch({
		  url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/staff/site/service/${editingItem.id}/`,
		  method: "PUT",
		  body: form, // Send FormData as the body
		});
  
		if( response && response.data){
			if(locale === "ar"){
				
			}
		
			if(locale === "ar"){
				toast.success("تم تعديل البيانات بنجاح");
	  
			  }else {
				toast.success("your data has been updated ");
	  
			  }



		  fetchData(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/staff/site/service/`)
		  setEditingItem({
					id:null,
					service_name:'',
					service_name_ar:''				
				})
		} else{
		  console.log(response)
		  if(locale === "ar"){
			toast.error("حصل خطأ رقم 1 أثناء عملية التعديل . يرجى المحاولة مجدداً");
  
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
			toast.error(JSON.stringify(response?.error?.data));
		  }		  






		}
  
	  } catch (error) {
		console.error("Error submitting form:", error);
		if(locale === "ar"){
			toast.error("حصل خطأ رقم 2 أثناء عملية التعديل . يرجى المحاولة مجدداً");
	
		  } else {
			toast.error("Error submitting form2.");
	
		}
	  }

  } else {
	if(locale === "ar"){
        toast.error("جميع الحقول مطلوبة");

      } else {
        toast.error("Error. all fields are required ");

      }

  }

//   setAddingItem(false);
	setIditingItemId(null)

	  
};











  const [customFetch] = useCustomFetchMutation()
	const [newItem, setNewItem] = useState({
		service_name:'',
		service_name_ar:''

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

	fetchData(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/staff/site/service/`)
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


	(  newItem.service_name &&   newItem.service_name.trim() !== '' ) && 
	(  newItem.service_name_ar &&  newItem.service_name_ar.trim() !== '' ) 

  ){ 
	try {

		const response = await customFetch({
		  url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/staff/site/service/`,
		  method: "POST",
		  body: form, // Send FormData as the body
		});
  
		if( response && response.data){
		  

		  if(locale === "ar"){
			toast.success("تم إضافة البيانات بنجاح");
  
		  }else {
			toast.success("your item been Added ");
  
		  }




		  fetchData(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/staff/site/service/`)
			setNewItem({
				service_name:'',
				service_name_ar:''
			})
		} else{
		  console.log(response)
		  if(locale === "ar"){
			toast.error("حصل خطأ رقم 1 أثناء عملية الإضافة . يرجى المحاولة مجدداً");
  
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
			toast.error(JSON.stringify(response?.error?.data));
		  }
		}  
	  } catch (error) {
		console.error("Error submitting form:", error);
		if(locale === "ar"){
			toast.error("حصل خطأ رقم 2 أثناء عملية الإضافة . يرجى المحاولة مجدداً");
  
		  } else {
			toast.error("Error submitting form 2.");
  
		  }




	  } finally{ setAddingItem(false);}

  } else {
	if(locale === "ar"){
        toast.error("جميع الحقول مطلوبة");

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
		url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/staff/site/service/${id}`,
		method: 'DELETE', // Only use 'GET' for fetching data
		headers: {
		  'Content-Type': 'application/json',
		}, 
	  });
 
	  if( response && response.data) {

		if(locale === "ar"){
			toast.success("تم حذف العنصر بنجاح");
  
		  }else {
			toast.success("your item been deleted ");
  
		  }



		fetchData(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/staff/site/service/`);

	} else{
		console.log(response)
		if(locale === "ar"){
		  toast.error("حصل خطأ رقم 1 أثناء عملية الإضافة . يرجى المحاولة مجدداً");

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
		  toast.error(JSON.stringify(response?.error?.data));
		}
	  }







	  setDeletingItemId(null)



  };

  return (
    <div className="container mt-5">
      <h6>{t('title')}</h6>

      {/* Table Display */}
      <table className="table table-bordered mt-4">
        <thead className="table-light">
          <tr>
				<th style={{ width: '5%' }}>#</th>
				<th style={{ width: '35%' }}>{t('content')}</th>
				<th style={{ width: '35%' }}  > {t('content_ar')}  </th>
				<th style={{ width: '25%' }}>{t('actions')}</th>
          </tr>
        </thead>
        <tbody>
          {data?.map((item, index) => (
            <tr key={item.id}>
              <td>{index +1}</td>
              <td  dir='ltr'   >{item.service_name}</td>
              <td className="text-end" >{item.service_name_ar}</td>
              <td>
                <button
                  className="btn btn-sm btn-primary m-2"
					onClick={() => {
						setEditingItem({
							id:item.id,
							service_name:item.service_name,
							service_name_ar:item.service_name_ar
							}
						)
					}}

                  data-bs-toggle="modal"
                  data-bs-target="#editModal_services"
				  style={{ minWidth: '75px' }}
                >
                  
				  {editingItemId === item.id ? t('editing') : t('edit')}


                </button>




                <button
                  className="btn btn-sm btn-danger m-2"
					onClick= { () => {
						setItemIdToDelete(item.id)
						setIsModalOpen(true)
					
					}}

				  disabled={deletingItemId === item.id}
				  style={{ minWidth: '75px' }}
                >
                  {deletingItemId === item.id ? t('deleting') : t('delete')}
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
			<label htmlFor="service_name" className="form-label">
			{t('form_add.Content')}
			</label>
			<input
				type="text"
				className="form-control"
				id="service_name"
				name="service_name"
				value={newItem?.service_name  || ""}
				onChange={handleChange}
				dir='ltr'

			/>
		</div>


		<div className="mb-3">
			<label htmlFor="service_name_ar" className="form-label">
			{t('form_add.Content_ar')}
			</label>
			<input
				type="text"
				className="form-control"
				id="service_name_ar"
				name="service_name_ar"
				value={newItem?.service_name_ar  || ""}
				onChange={handleChange}
			/>
		</div>








		<button
			className="btn btn-success mt-2"
			onClick={handleaddItem}
			disabled={isButtonDisabled || addingItem }
		>

			{addingItem ? t('form_add.adding_item') : t('form_add.add_item')}
			
		</button>



		</form>


		</div>

		{/* end form */}





      {/* Modal for Editing */}
      <div
        className="modal fade"
        id="editModal_services"
        tabIndex="-1"
        aria-labelledby="editModal_servicesLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="editModal_servicesLabel"> {t('form_edit.title')}</h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>




			<form   className="   modal-body  "     >


					
				<div className="  ">
				<label htmlFor="service_name" className="form-label">
				 {t('form_edit.Content')}
				</label>
				<input
					type="text"
					className="form-control"
					id="service_name"
					name="service_name"
					value={editingItem?.service_name  || ""}
					onChange={handleChangeEditingItem}
					dir='ltr'


				/>
				</div>


				<div className="mb-3">
				<label htmlFor="service_name_ar" className="form-label">
				  {t('form_edit.Content_ar')}
				</label>
				<input
					type="text"
					className="form-control text-end "
					id="service_name_ar"
					dir="rtl"

					name="service_name_ar"
					value={editingItem?.service_name_ar  || ""}
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
				{editingItemId  ? t('form_edit.updating') : t('form_edit.update') }
              </button>
            </div>
          </div>
        </div>
      </div>



	  <CustomModal  
		id="list_manager_services"
		handleSubmit={ () =>   deleteItem(itemIdToDelete)}
		submitting={deletingItemId}
		message={t('modal_del_msg')}
		operationType = "Delete"
		showModal={true} 
		isModalOpen={isModalOpen}
		setIsModalOpen={setIsModalOpen}

		/>  









    </div>





  );
}
