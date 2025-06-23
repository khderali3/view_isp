'use client'
import { useState, useEffect, useRef } from "react";
import { useCustomFetchMutation } from "@/app/(dashboard)/_components/redux_staff/features/authApiSlice"
import { toast } from "react-toastify";

import CustomModal from "@/app/(dashboard)/_components/jsx/myModal";

import { AddFilesComponent } from "./add_product_components/extra_images";


import { useTranslations, useLocale } from "next-intl";

import { EditModalComponent } from "./edit_product/edit_modal";
 
import Link from "next/link";

export default function ListManagerProduct() {



const [selectedItemToEeditId, setSelectedItemToEeditId] = useState(null);



  const [data, setdata] = useState([]);

 

  const t = useTranslations('dashboard.site_managment.our_product.list_manager')
  const locale = useLocale()





  const [selectedFile, setSelectedFile] = useState(null)
  const fileInputRef = useRef(null);

 


	const [filesExtraImages, setFilesExtraImages] = useState([{ id: 1, file: null }]);
	const fileInputRefsExtraImages = useRef([]);



	const [filesAttachment, setFilesAttachment] = useState([{ id: 1, file: null }]);
	const fileInputRefsFilesAttachment = useRef([]);






  const [isModalOpen, setIsModalOpen] = useState(false); // State to control modal visibility


  const [addingItem, setAddingItem] = useState(false)
  const [deletingItemId, setDeletingItemId] = useState(null); // Track which item is being deleted

 
  const [itemIdToDelete, setItemIdToDelete] = useState(null)


 

  const [reloadFlag, setReloadFlag] = useState(false)

  const handleReloadFlag = () => {
	setReloadFlag(!reloadFlag)
  }






  const [customFetch] = useCustomFetchMutation()
	const [newItem, setNewItem] = useState({
		prod_name:'',
		prod_name_hint:'',
		prod_details:'',
		prod_name_ar:'',
		prod_name_hint_ar:'',
		prod_details_ar:'',
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

	fetchData(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/staff/site/product/`)
}, [reloadFlag]);




const handleaddItem = async (e) => {
	setAddingItem(true);
	e.preventDefault();
	const form = new FormData();

	for (const key in newItem) {
		if (newItem.hasOwnProperty(key)) {
			form.append(key, newItem[key]);
		}}


	if(selectedFile instanceof File  ) {
		form.append("prod_image", selectedFile);
	}






	if (

		(newItem.prod_name && newItem.prod_name.trim() !== '') &&
		(newItem.prod_name_hint && newItem.prod_name_hint.trim() !== '') &&
		(newItem.prod_details && newItem.prod_details.trim() !== '') &&
		(newItem.prod_name_ar && newItem.prod_name_ar.trim() !== '') &&
		(newItem.prod_name_hint_ar && newItem.prod_name_hint_ar.trim() !== '') &&
		(newItem.prod_details_ar && newItem.prod_details_ar.trim() !== '') 
  ){ 

 

	filesExtraImages.forEach((fileInput) => {
		if (fileInput.file) {
			form.append("extra_images[]", fileInput.file);
		}
	});

	filesAttachment.forEach((fileInput) => {
		if (fileInput.file) {
			form.append("attachment[]", fileInput.file);
		}
	});





	try {

		const response = await customFetch({
		  url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/staff/site/product/`,
		  method: "POST",
		  body: form, // Send FormData as the body
		});
  
		if( response && response.data){
			if(locale === "ar"){
				toast.success("تم إضافة المنتج بنجاح ");

			} else {
				toast.success("your item been Added ");

			}
		  fetchData(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/staff/site/product/`)
			setNewItem({
				prod_name:'',
				prod_name_hint:'',
				prod_details:'',
				prod_name_ar:'',
				prod_name_hint_ar:'',
				prod_details_ar:'',
			})

		} else{
		  console.log(response)
		  if(locale === "ar"){
			toast.error("حدث خطأ رقم 1 اثناء محاولة تحديث المنتج");
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
			setAddingItem(false);
		  }

		}
  
	  } catch (error) {
		console.error("Error submitting form:", error);
		if(locale === "ar"){
			toast.error("حدث خطأ رقم 2 اثناء محاولة تحديث المنتج");

		} else {
			toast.error("Error submitting form2.");

		}
	  } finally{ 
			setAddingItem(false);  
			fileInputRef.current.value = "";
			setSelectedFile(null)

			setFilesExtraImages([{ id: 1, file: null }])
			// fileInputRefsExtraImages.current.value = "";

			setFilesAttachment([{ id: 1, file: null }])
			// fileInputRefsFilesAttachment.current.value = "";

			// Clear extra images inputs
			fileInputRefsExtraImages.current.forEach((input) => {
			if (input) input.value = "";
			});

			// Clear attachment inputs
			fileInputRefsFilesAttachment.current.forEach((input) => {
			if (input) input.value = "";
			});

		}

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
		url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/staff/site/product/${id}`,
		method: 'DELETE',  
		headers: {
		  'Content-Type': 'application/json',
		}, 
	  });
 
	  if( response && response.data) {
		if(locale === "ar"){
			toast.success("تم حذف المنتج بنجاح ");

		} else {
			toast.success("the item has been deleted");

		}
		fetchData(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/staff/site/product/`);
		setIsModalOpen(false);

	  } else{
		console.log(response)
		if(locale === "ar"){
		  toast.error("حدث خطأ رقم 1 اثناء محاولة تحديث المنتج");
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
				<th style={{ width: '35%' }}  >
				{t('content_ar')}
				</th>
				<th style={{ width: '25%' }}>{t('actions')}</th>
          </tr>
        </thead>
        <tbody>
          {data?.map((item, index) => (
            <tr key={item.id}>
              <td>{index +1}</td>
              <td dir='ltr' >{item.prod_name}</td>
              <td className="text-end" >{item.prod_name_ar}</td>
              <td>

   

				<Link 
					href='#'
					onClick={(e) => {
						e.preventDefault()
						setSelectedItemToEeditId(item?.id)
						} 
					}

					className="text-primary mx-2" title={t('edit')}><i className="bi bi-pencil-fill"></i>

				</Link>


				<Link href=""
					onClick= { (e) => {
						e.preventDefault()
						setItemIdToDelete(item?.id)
						setIsModalOpen(true)
					
					}}
					className="text-danger mx-2" title="Delete"><i className="bi bi-trash-fill"></i>
				</Link>

 

              </td>
            </tr>
          ))}
        </tbody>
      </table>


		{/* form add product */ }
		<div className="mb-3">

		<form   className="    "     >

          
			
			<div className="mb-3">
				<label htmlFor="prod_name" className="form-label">
				{/* Product Name */}
				{t('form_add.Product_Name')}
				</label>
				<input
					type="text"
					className="form-control"
					id="prod_name"
					name="prod_name"
					value={newItem?.prod_name  || ""}
					onChange={handleChange}
					dir='ltr'


				/>
			</div>


			<div className="mb-3">
				<label htmlFor="prod_name_hint" className="form-label">
				{/* Product Name 'hint' */}
				{t('form_add.Product_Name_hint')}
				</label>
				<input
					type="text"
					className="form-control"
					id="prod_name_hint"
					name="prod_name_hint"
					value={newItem?.prod_name_hint  || ""}
					onChange={handleChange}
					dir='ltr'


				/>
			</div>

			<div className="mb-3">
				<label htmlFor="prod_details" className="form-label">
				{/* Product Details */}
				{t('form_add.Product_Details')}
				</label>
				<textarea 
					className="form-control" 
					rows="3"
					id="prod_details"
					name="prod_details"
					value={newItem?.prod_details  || ""}
					onChange={handleChange}
					dir='ltr'

				>

				</textarea>

			</div>



			
			<div className="mb-3">
				<label htmlFor="prod_name_ar" className="form-label">
				{/* Product Name (Ar) */}
				{t('form_add.Product_Name_ar')}
				</label>
				<input
					type="text"
					className="form-control text-end"
					dir="rtl"
					id="prod_name_ar"
					name="prod_name_ar"
					value={newItem?.prod_name_ar  || ""}
					onChange={handleChange}
				 


				/>
			</div>


			<div className="mb-3">
				<label htmlFor="prod_name_hint_ar" className="form-label">
				{/* Product Name 'hint' (Ar) */}
				{t('form_add.Product_Name_hint_ar')}
				</label>
				<input
					type="text"
					className="form-control text-end"
					dir='rtl'
					id="prod_name_hint_ar"
					name="prod_name_hint_ar"
					value={newItem?.prod_name_hint_ar  || ""}
					onChange={handleChange}


				/>
			</div>

			<div className="mb-3">
				<label htmlFor="prod_details_ar" className="form-label">
				{/* Product Details (Ar) */}
				{t('form_add.Product_Details_ar')}
				</label>
				<textarea 
					className="form-control text-end"
					dir='rtl' 
					rows="3"
					id="prod_details_ar"
					name="prod_details_ar"
					value={newItem?.prod_details_ar  || ""}
					onChange={handleChange}

				>

				</textarea>

			</div>



            <div className="mb-3">
              <label htmlFor="prod_image" className="form-label">
                {/* Image */}
				{t('form_add.image')}
              </label>
              <input
                type="file"
                className="form-control"
                accept="image/*"
                id="prod_image"
                name="prod_image"                
                onChange={handleChange}
				ref={fileInputRef}
              />
              {/* {newItem?.prod_image &&  <a href={newItem?.prod_image}>  Current Image  </a> } */}
             
            </div>





			<AddFilesComponent 
				custom_id = "add_extra_images"
				title =  {locale === 'ar' ?  'صور إضافية': 'Extra Images'}
				filesExtraImages={filesExtraImages} 
				setFilesExtraImages={setFilesExtraImages} 
				fileInputRefsExtraImages={fileInputRefsExtraImages} 
				only_image={true} 
			/>


			<AddFilesComponent 
				custom_id = "add_attachment"
				title = {locale === 'ar' ?  'المرفقات': 'attachment'}
				filesExtraImages={filesAttachment} 
				setFilesExtraImages={setFilesAttachment} 
				fileInputRefsExtraImages={fileInputRefsFilesAttachment} 
				only_image={false} 
			/>





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




 

	  <CustomModal  
		id="list_manager_Product"
		handleSubmit={ () =>   deleteItem(itemIdToDelete)}
		submitting={deletingItemId}
		message={t('modal_del_msg')}
		operationType = "Delete"
		showModal={true} 
		isModalOpen={isModalOpen}
		setIsModalOpen={setIsModalOpen}

		/>  




		{selectedItemToEeditId && 
		<EditModalComponent
		 id={selectedItemToEeditId}
		 onClose={() => setSelectedItemToEeditId(null)} 
		 handleReloadFlag={ handleReloadFlag }
		 />}




    </div>





  );
}
