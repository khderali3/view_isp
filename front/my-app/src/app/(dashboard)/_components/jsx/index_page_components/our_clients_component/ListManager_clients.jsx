'use client'
import { useState, useEffect, useRef } from "react";
import { useCustomFetchMutation } from "@/app/(dashboard)/_components/redux_staff/features/authApiSlice"
import { toast } from "react-toastify";

import CustomModal from "@/app/(dashboard)/_components/jsx/myModal";



import { useTranslations, useLocale } from "next-intl";


export default function ListManagerClients() {
  const [data, setdata] = useState([]);
  const [editingItem, setEditingItem] = useState({
	id:null,
	our_client_name:'',
	our_client_image: ''
  });

  const t = useTranslations('dashboard.site_managment.our_clients.list_manager')
  const locale = useLocale()


  const [selectedFile, setSelectedFile] = useState(null)
  const fileInputRef = useRef(null);

  const [editSelectedFile, setEditSelectedFile] = useState(null)
  const editFileInputRef = useRef(null);



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
			if(key !== 'id' && key !== 'our_client_image') {
				form.append(key, editingItem[key]);
			}

		}}

	if(editSelectedFile instanceof File  ) {
		form.append("our_client_image", editSelectedFile);
	}

	if (
		
	(editingItem.our_client_name && editingItem.our_client_name.trim() !== '') 



  ){ 
	try {

		const response = await customFetch({
		  url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/staff/site/our_clients/${editingItem.id}/`,
		  method: "PUT",
		  body: form, // Send FormData as the body
		});
  
		if( response && response.data){
			if(locale === "ar"){
				toast.success("تم تحديث العميل بنجاح ");

			} else {
				toast.success("your item been Updated ");

			}
		  fetchData(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/staff/site/our_clients/`)
		  setEditingItem({
			id:null,
			our_client_name:'',
			our_client_image: ''
			})
		} else{
			if(locale === "ar"){
				toast.error("حصل خطأ رقم 1 أثناء التعديل يرجى المحاولة مجدداً");

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
			toast.error("حصل خطأ رقم 2 أثناء التعديل يرجى المحاولة مجدداً");

		} else {
			toast.error("Error submitting form2.");

		}
	  }  

  } else {
	if(locale === "ar"){
		toast.error("كافة الحقول مطلوبة");

	} else {
		toast.error("Error. all fields are required ");

	}

  }


	setIditingItemId(null)
	editFileInputRef.current.value = "";
	setEditSelectedFile(null)
	  
};











  const [customFetch] = useCustomFetchMutation()
	const [newItem, setNewItem] = useState({
			our_client_name:'',
			// our_client_image: ''

	})

	const isButtonDisabled = Object.values(newItem).some((value) => value.trim() === "");

	const handleChange = (e) => {
		const { name, value, type, files } = e.target;

		if (type === "file") {
		  // If the input is a file, update the selectedFile state
		  setSelectedFile(files[0]);
		} else {
		  // If the input is not a file, update the data state
		  setNewItem((prevState) => ({
			...prevState,
			[name]: value,
		  }));
		}


		}


		const handleChangeEditingItem = (e) => {
			// const { name, value } = e.target;
			// setEditingItem((prevState) => ({
			// 	...prevState,
			// 	[name]: value,
			//   }));

			const { name, value, type, files } = e.target;

			if (type === "file") {
			  // If the input is a file, update the selectedFile state
			  setEditSelectedFile(files[0]);
			} else {
			  // If the input is not a file, update the data state
			  setEditingItem((prevState) => ({
				...prevState,
				[name]: value,
			  }));
			}


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

	fetchData(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/staff/site/our_clients/`)
}, []);




const handleaddItem = async (e) => {
	setAddingItem(true);
	e.preventDefault();
	const form = new FormData();

	for (const key in newItem) {
		if (newItem.hasOwnProperty(key)) {
			form.append(key, newItem[key]);
		}}


	if(selectedFile instanceof File  ) {
		form.append("our_client_image", selectedFile);
	}






	if (

		(newItem.our_client_name && newItem.our_client_name.trim() !== '') && 
		(selectedFile)

  ){ 
	try {

		const response = await customFetch({
		  url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/staff/site/our_clients/`,
		  method: "POST",
		  body: form, // Send FormData as the body
		});
  
		if( response && response.data){
		
			if(locale === "ar"){
				toast.success("تم إضافة العميل بنجاح");
			} else {
				toast.success("the client has been Added ");
			}
		  
		  fetchData(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/staff/site/our_clients/`)
			setNewItem({
				our_client_name:''

			})
			

		} else{
		  console.log(response)
		  if(locale === "ar"){
			toast.error("حصل خطأ رقم 1 أثناء الإضافة يرجى المحاولة مجدداً");
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
			toast.error("حصل خطأ رقم 2  أثناء الإضافة يرجى المحاولة مجدداً");

		} else {
			toast.error("Error submitting form2.");

		}
	  }

  } else {
	if(locale === "ar"){
		toast.error("جميع الحقول مطلوبة ");

	} else {
		toast.error("Error. all fields are required ");

	}

  }

	setAddingItem(false);
	fileInputRef.current.value = "";
	setSelectedFile(null)
};



  // Delete item
  const deleteItem = async (id) => {
	setDeletingItemId(id)
	const response = await customFetch({
		url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/staff/site/our_clients/${id}`,
		method: 'DELETE',  
		headers: {
		  'Content-Type': 'application/json',
		}, 
	  });
 
	  if( response && response.data) {
		if(locale === "ar"){
			toast.success("تم حذف العنصر بنجاح");
		} else {
			toast.success("the item has been deleted ");
		}


		fetchData(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/staff/site/our_clients/`);
		setIsModalOpen(false);
	  } 

	  else{
		console.log(response)
		if(locale === "ar"){
		  toast.error("حصل خطأ رقم 1 أثناء الإضافة يرجى المحاولة مجدداً");
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

	<div className="table-responsive" >

	<table className="table table-bordered mt-4">
        <thead className="table-light">
          <tr>
				<th style={{ width: '5%' }}>#</th>
				<th style={{ width: '35%' }}>{t('Client_Name')}</th>
				<th style={{ width: '35%' }}  > {t('image')} </th>
				<th style={{ width: '25%' }}>{t('actions')}</th>
          </tr>
        </thead>
        <tbody>
          {data?.map((item, index) => (
            <tr key={item.id}>
              <td>{index +1}</td>
              <td   dir='ltr'   >{item.our_client_name}</td>
              <td   >

			  <img
                  src={item.our_client_image}
                  alt={`${item.our_client_name}'s avatar`}
                  className="img-thumbnail product_img_staff text-light"
                  style={{ width: "100px", height: "50px", objectFit: "contain" }}
                />

			  </td>
              <td>
                <button
                  className="btn btn-sm btn-primary m-2"
					onClick={() => {
						setEditingItem({
							id:item.id,
							our_client_name:item.our_client_name,
							our_client_image: item.our_client_image
						
							}
						)
					}}

                  data-bs-toggle="modal"
                  data-bs-target="#editModal_client"
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
                  {deletingItemId === item.id ?  t('deleting') : t('delete')}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>



	</div>

		{/* form add new item */ }
		<div className="mb-3">

		<form   className="    "     >

          
			
			<div className="mb-3">
				<label htmlFor="our_client_name" className="form-label">
				 
				{t('form_add.Client_Name')}
				</label>
				<input
					type="text"
					className="form-control"
					id="our_client_name"
					name="our_client_name"
					value={newItem?.our_client_name  || ""}
					onChange={handleChange}
					dir='ltr'


				/>
			</div>






            <div className="mb-3">
              <label htmlFor="our_client_image" className="form-label">
                {/* Image */}
				{t('form_add.image')}
              </label>
              <input
                type="file"
                className="form-control"
                accept="image/*"
                id="our_client_image"
                name="our_client_image"                
                onChange={handleChange}
				ref={fileInputRef}
              />
              {/* {newItem?.our_client_image &&  <a href={newItem?.our_client_image}>  Current Image  </a> } */}
             
            </div>






		<button
			className="btn btn-success mt-2"
			onClick={handleaddItem}
			disabled={isButtonDisabled || addingItem || !selectedFile }
		>

			{addingItem ? t('form_add.adding_item') : t('form_add.add_item')}
			
		</button>



		</form>


		</div>

		{/* end form */}





      {/* Modal for Editing */}
      <div
        className="modal fade modal-lg "
        id="editModal_client"
        tabIndex="-1"
        aria-labelledby="editModal_productLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog   ">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="editModal_clientLabel">{t('form_edit.title')}</h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>




			<form   className="   modal-body    "     >

			
			<div className="mb-3">
				<label htmlFor="edit_our_client_name" className="form-label">
				{/* Client Name */}
				{t('form_edit.Client_Name')}
				
				</label>
				<input
					type="text"
					className="form-control"
					id="edit_our_client_name"
					name="our_client_name"
					value={editingItem?.our_client_name  || ""}
					onChange={handleChangeEditingItem}

					dir='ltr'

				/>
			</div>






            <div className="mb-3">
              <label htmlFor="edit_our_client_image" className="form-label">
                {/* Image */}
				{t('form_edit.image')}
              </label>
              <input
                type="file"
                className="form-control"
                accept="image/*"
                id="edit_our_client_image"
                name="our_client_image"                
                onChange={handleChangeEditingItem}
				ref={editFileInputRef}
              />
              {editingItem?.our_client_image &&  <a href={editingItem?.our_client_image}>  {t('form_edit.current_image')}  </a> }
             
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
				{editingItemId  ? t('form_edit.updating') : t('form_edit.update')}
              </button>
            </div>
          </div>
        </div>
      </div>



	  <CustomModal  
		id="list_manager_clients"
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
