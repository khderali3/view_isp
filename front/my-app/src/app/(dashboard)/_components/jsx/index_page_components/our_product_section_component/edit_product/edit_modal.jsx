

import { useTranslations } from "next-intl"
import { useEffect, useState, useRef } from "react"
import { useCustomFetchMutation } from "@/app/(dashboard)/_components/redux_staff/features/authApiSlice"
import { toast } from "react-toastify"
import { getErrorMessage } from "@/app/public_utils/utils"

 import { AddFilesComponent } from "../add_product_components/extra_images"

 
// import { FormSearchInput } from "../../../project_flow_template/input_search_templates/page"

import {useLocale} from "next-intl"

export const EditModalComponent = ({ id, onClose , handleReloadFlag=null}) => {
    const locale = useLocale()
    const t = useTranslations('dashboard.site_managment.our_product.list_manager')
    const [customFetch] = useCustomFetchMutation()


    const [editingItem, setEditingItem] = useState({
      id:null,
      prod_name:'',
      prod_name_hint:'',
      prod_details:'',
      prod_name_ar:'',
      prod_name_hint_ar:'',
      prod_details_ar:'',
      prod_image: ''
     })

 

    const [filesExtraImages, setFilesExtraImages] = useState([{ id: 1, file: null }]);
    const fileInputRefsExtraImages = useRef([]);

    const [filesAttachment, setFilesAttachment] = useState([{ id: 1, file: null }]);
    const fileInputRefsFilesAttachment = useRef([]);


     const [isSubmitting, setIsSubmitting] = useState(false)
     

 
  const [editSelectedFile, setEditSelectedFile] = useState(null)
  const editFileInputRef = useRef(null)

		const handleChangeEditingItem = (e) => {
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



 
  const handleSubmit = async (e) => {
  // setAddingItem(true);
  e.preventDefault();
   const form = new FormData();
 
  for (const key in editingItem) {
    if (editingItem.hasOwnProperty(key)) {
      if(key !== 'id' && key !== 'prod_image') {
        form.append(key, editingItem[key]);
      }
 
    }}
 
  if(editSelectedFile instanceof File  ) {
    form.append("prod_image", editSelectedFile);
  }

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


  
 
  if (
    
  (editingItem.prod_name && editingItem.prod_name.trim() !== '') &&
  (editingItem.prod_name_hint && editingItem.prod_name_hint.trim() !== '') &&
  (editingItem.prod_details && editingItem.prod_details.trim() !== '')&&
  (editingItem.prod_name_ar && editingItem.prod_name_ar.trim() !== '')&&
  (editingItem.prod_name_hint_ar && editingItem.prod_name_hint_ar.trim() !== '')&&
  (editingItem.prod_details_ar && editingItem.prod_details_ar.trim() !== '')
 
 
   ){ 
  try {
 
    const response = await customFetch({
      url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/staff/site/product/${editingItem.id}/`,
      method: "PUT",
      body: form, // Send FormData as the body
    });
   
    if( response && response.data){
 
      if(locale === "ar") {
        toast.success("تم تحديث المنتج بنجاح");
 
      } else {
        toast.success("your item been Updated ");
 
      }



        if (editFileInputRef.current) {
          editFileInputRef.current.value = ""; // Reset the file input
        }

      
			// Clear extra images inputs
			fileInputRefsExtraImages.current.forEach((input) => {
			if (input) input.value = "";
			});

			// Clear attachment inputs
			fileInputRefsFilesAttachment.current.forEach((input) => {
			if (input) input.value = "";
			});

      onClose()
      if(handleReloadFlag){handleReloadFlag()}



    } else{
      if(locale === "ar"){
        toast.error("حدث خطأ رقم 1 أثناء تحديث المنتج . يرجى المحاولة مجدداً");
 
      }else {
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
      toast.error("حدث خطأ رقم 2 أثناء تحديث المنتج . يرجى المحاولة مجدداً");
 
    } else {
      toast.error("Error submitting form2.");
 
    }
    }
 
   } else {
  if(locale === "ar"){
    toast.error("كافة الحقول مطلوبة ");
 
  } else {
    toast.error("Error. all fields are required ");
 
  }
 
   }
 
  
    
 };
 
 





 

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
        setEditingItem(response.data)
      } else{
        console.log(response)
      }
  
    } catch (error) {
      console.error("Error fetching data:", error);
    }
    };


  useEffect(() => {
    if(id){
      fetchData(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/staff/site/product/${id}/`)

    }
  }, [id]);


 
 



  // useEffect(() => {
  //   const modalElement = document.getElementById('editModal_product');
  
  //   if (modalElement) {
     
  //     const modalInstance = new window.bootstrap.Modal(modalElement, {
  //       backdrop: true,  
  //       keyboard: true,  
  //     });
  
  //     modalInstance.show();
  
 
  //     const handleModalClose = () => {
  //       if(onClose){
  //         onClose();  
  //         document.activeElement?.blur(); 
  //         document.body.style.overflow = ""; // Restore scrolling
 
  //       }
  //     };
  
 
  //     modalElement.addEventListener("hidden.bs.modal", handleModalClose);
  
 
  //     return () => {
  //       modalElement.removeEventListener("hidden.bs.modal", handleModalClose);
  //       modalInstance.dispose();
  //       document.body.style.overflow = ""; // Ensure scrolling is restored

  //     };
  //   }
  // }, [id, onClose]);
   
 


useEffect(() => {
  const timeout = setTimeout(() => {
    const modalElement = document.getElementById('editModal_product');
    if (!modalElement) return;

    const modalInstance = new window.bootstrap.Modal(modalElement, {
      backdrop: true,
      keyboard: true,
    });

    modalInstance.show();

    const handleModalClose = () => {
      document.activeElement?.blur();
      // document.body.style.overflow = "";
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";

      onClose?.();


    };

    modalElement.addEventListener("hidden.bs.modal", handleModalClose);

    // Cleanup
    return () => {
      modalElement.removeEventListener("hidden.bs.modal", handleModalClose);
      modalInstance.dispose();
      // document.body.style.overflow = "";
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";




    };
  }, 0);

  return () => clearTimeout(timeout);
}, [id, onClose]);













    return (

       <div
        className="modal fade modal-lg "
        id="editModal_product"
        tabIndex="-1"
        aria-labelledby="editModal_productLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog   ">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="editModal_productLabel">{t('form_edit.title')}</h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>




			<form   className="   modal-body    "     >

			
			<div className="mb-3">
				<label htmlFor="prod_name" className="form-label">
				{t('form_edit.Product_Name')}
				</label>
				<input
					type="text"
					className="form-control"
					id="prod_name"
					name="prod_name"
					value={editingItem?.prod_name  || ""}
					onChange={handleChangeEditingItem}
					dir='ltr'


				/>
			</div>





			<div className="mb-3">
				<label htmlFor="prod_name_hint" className="form-label">
				{t('form_edit.Product_Name_hint')}
				</label>
				<input
					type="text"
					className="form-control"
					id="prod_name_hint"
					name="prod_name_hint"
					value={editingItem?.prod_name_hint  || ""}
					onChange={handleChangeEditingItem}
					dir='ltr'


				/>
			</div>

			<div className="mb-3">
				<label htmlFor="prod_details" className="form-label">
				{t('form_edit.Product_Details')}
				</label>
				<textarea 
					className="form-control" 
					rows="3"
					id="prod_details"
					name="prod_details"
					value={editingItem?.prod_details  || ""}
					onChange={handleChangeEditingItem}
					dir='ltr'

				>

				</textarea>

			</div>



			
			<div className="mb-3">
				<label htmlFor="prod_name_ar" className="form-label">
				{t('form_edit.Product_Name_ar')}
				</label>
				<input
					type="text"
					className="form-control text-end"
					dir="rtl"
					id="prod_name_ar"
					name="prod_name_ar"
					value={editingItem?.prod_name_ar  || ""}
					onChange={handleChangeEditingItem}


				/>
			</div>


			<div className="mb-3">
				<label htmlFor="prod_name_hint_ar" className="form-label">
				{t('form_edit.Product_Name_hint_ar')}
				</label>
				<input
					type="text"
					className="form-control text-end"
					dir='rtl'
					id="prod_name_hint_ar"
					name="prod_name_hint_ar"
					value={editingItem?.prod_name_hint_ar  || ""}
					onChange={handleChangeEditingItem}
				/>
			</div>

			<div className="mb-3">
				<label htmlFor="prod_details_ar" className="form-label">
				{t('form_edit.Product_Details_ar')}
				</label>
				<textarea 
					className="form-control text-end"
					dir='rtl' 
					rows="3"
					id="prod_details_ar"
					name="prod_details_ar"
					value={editingItem?.prod_details_ar  || ""}
					onChange={handleChangeEditingItem}

				>

				</textarea>

			</div>



            <div className="mb-3">
              <label htmlFor="prod_image" className="form-label">
			  {t('form_edit.image')}
              </label>
              <input
                type="file"
                className="form-control"
                accept="image/*"
                id="prod_image"
                name="prod_image"                
                onChange={handleChangeEditingItem}
              ref={editFileInputRef}
              />
              {editingItem?.prod_image &&  <a href={editingItem?.prod_image} target="_blank">  {t('form_edit.current_image')}  </a> }
             
            </div>






      <AddFilesComponent 
          custom_id = "extra_images_edit_form_product"
          title = {locale === 'ar' ?  'صور إضافية': 'Extra Images'}
          filesExtraImages={filesExtraImages} 
          setFilesExtraImages={setFilesExtraImages} 
          fileInputRefsExtraImages={fileInputRefsExtraImages} 
          only_image={true}
          isEdit_form={true}
          product_id={editingItem?.id}
          files_type={"extra_images"}
      />


      <AddFilesComponent 
          custom_id = "extra_images_edit_form_product"
          title = {locale === 'ar' ?  'المرفقات': 'attachment'}
          filesExtraImages={filesAttachment} 
          setFilesExtraImages={setFilesAttachment} 
          fileInputRefsExtraImages={fileInputRefsFilesAttachment} 
          only_image={false}
          isEdit_form={true}

          product_id={editingItem?.id}
          files_type={"attachment"}
      />







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
                onClick={handleSubmit}
                data-bs-dismiss="modal"
              >
                {locale === 'ar' ? "حفظ التغييرات" : "Update"}
              </button>

            </div>
          </div>
        </div>
      </div>

 


    )
}