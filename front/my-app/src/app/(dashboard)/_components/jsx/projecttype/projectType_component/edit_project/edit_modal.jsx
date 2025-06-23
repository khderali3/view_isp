

import { useTranslations } from "next-intl"
import { useEffect, useState, useRef } from "react"
import { useCustomFetchMutation } from "@/app/(dashboard)/_components/redux_staff/features/authApiSlice"
import { toast } from "react-toastify"
import { getErrorMessage } from "@/app/public_utils/utils"

import { AddFilesComponent } from "../add_project_components/extra_images"

 
import { FormSearchInput } from "../../../project_flow_template/input_search_templates/page"

import {useLocale} from "next-intl"

export const EditModalComponent = ({ id, onClose , handleReloadFlag=null}) => {
    const locale = useLocale()
    const t = useTranslations('dashboard.projectFlow.projectType.form_add_or_edit')
    const [customFetch] = useCustomFetchMutation()
    const [data, setData] = useState({
        project_name:'',
        project_name_hint: "",
        project_description: '',
        project_name_ar: '',
        project_name_hint_ar: '',
        project_description_ar: '',
        main_image: '',
        is_published:false,
        is_auto_clone_template: false,
        default_template_to_clone: ''
     })

     const [projectMainImageSelected, setProjectMainImageSelected] = useState(null)
     const mainImagefileInputRef = useRef(null);

    const [filesExtraImages, setFilesExtraImages] = useState([{ id: 1, file: null }]);
    const fileInputRefsExtraImages = useRef([]);

    const [filesAttachment, setFilesAttachment] = useState([{ id: 1, file: null }]);
    const fileInputRefsFilesAttachment = useRef([]);


     const [isSubmitting, setIsSubmitting] = useState(false)
     

 
    const handleChangeSelectedClonedTemplate =  (template_id) => {

        setData((prevState) => ({
          ...prevState,
          default_template_to_clone: template_id,
          }));

    }






  const handleSubmit = async (e) => {
    e.preventDefault()

 
    const fieldsToCheck = [
        'project_name',
        'project_name_hint',
        'project_description',
        'project_name_ar',
        'project_name_hint_ar',
        'project_description_ar'
    ];

    const emptyFields = Object.entries(data)
        .filter(([key, value]) => fieldsToCheck.includes(key) && !value.trim()) // Check only specified fields
        .map(([key]) => key); // Extract field names

    if (emptyFields.length > 0) {
        if(locale === 'ar'){
        toast.error(`جميع الحقول مطلوبة: ${emptyFields.join(", ")}`);

        } else {
        toast.error(`Please fill in all fields: ${emptyFields.join(", ")}`);

        }
        return;
    }


    try{
      setIsSubmitting(true)

      const formData = new FormData()

      Object.entries(data).forEach(([key, value]) => {
        if (
          key === "project_name" ||  
          key === "project_name_hint" ||  
          key === "project_description" ||  
          key === "project_name_ar" ||  
          key === "project_name_hint_ar" ||  
          key === "project_description_ar" ||  
          key === "is_published" ||
          key === 'is_auto_clone_template'
        ) {
          formData.append(key, value);
        }
      });

			if(data?.default_template_to_clone) {
				formData.append("default_template_to_clone", data?.default_template_to_clone  );
			}






      if (projectMainImageSelected) {
        formData.append("main_image", projectMainImageSelected);
      }

      filesExtraImages.forEach((fileInput) => {
        if (fileInput.file) {
          formData.append("extra_images[]", fileInput.file);
        }
      });

      filesAttachment.forEach((fileInput) => {
        if (fileInput.file) {
          formData.append("attachment[]", fileInput.file);
        }
      });



 


      const response = await customFetch({
         url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/staff/projectflow/project_type/${id}/`,
         method: "PUT",
         body: formData, 
       });

      if(response && response.data){

       if(locale === 'ar'){
        toast.success('تم تحديث البيانات بنجاح')

       } else {
        toast.success('your data has been changed')

       }



        onClose()
        if(handleReloadFlag){handleReloadFlag()}

        if (mainImagefileInputRef.current) {
          mainImagefileInputRef.current.value = ""; // Reset the file input
        }

 


 
 

      } else{
        setIsSubmitting(false)
        console.log('response', response)
        if (response?.error?.data) {
          toast.error(getErrorMessage(response.error.data));
        }
      }


    } catch(error){
      console.log('error', error)			
      toast.error(getErrorMessage(error.data || error.message) || "Something went wrong");
    } finally{ setIsSubmitting(false) }

  }








     const handleChange = (e) => {
        const { name, value, type, files } = e.target;
    
        if (type === "file") {
          // If the input is a file, update the selectedFile state
          setProjectMainImageSelected(files[0]);
        } else {
          // If the input is not a file, update the data state
          setData((prevState) => ({
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
        setData(response.data)
      } else{
        console.log(response)
      }
  
    } catch (error) {
      console.error("Error fetching data:", error);
    }
    };


  useEffect(() => {

    fetchData(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/staff/projectflow/project_type/${id}`)
  }, [id]);


 
 



  useEffect(() => {
    const modalElement = document.getElementById('editModal_project');
  
    if (modalElement) {
     
      const modalInstance = new window.bootstrap.Modal(modalElement, {
        backdrop: true,  
        keyboard: true,  
      });
  
      modalInstance.show();
  
 
      const handleModalClose = () => {
        if(onClose){
           
          document.activeElement?.blur(); 
          // document.body.style.overflow = ""; // Restore scrolling

          document.body.style.overflow = "";
          document.body.style.paddingRight = "";


          onClose(); 
        }
      };
  
 
      modalElement.addEventListener("hidden.bs.modal", handleModalClose);
  
 
      return () => {
        modalElement.removeEventListener("hidden.bs.modal", handleModalClose);
        modalInstance.dispose();
        // document.body.style.overflow = ""; // Ensure scrolling is restored
        document.body.style.overflow = "";
        document.body.style.paddingRight = "";

      };
    }
  }, [id, onClose]);
   
 


 



    return (

 
        <div
        className="modal fade  modal-lg   "
        id="editModal_project"
        tabIndex="1"
        aria-labelledby="editModal_projectLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog        ">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="editModal_projectLabel">{t('edit_project_type')}</h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                // aria-label="Close"
 
              ></button>
            </div>



          <div className="modal-body">


            <form   className=" p-2 "     >

            
              
              <div className="mb-3">
                  <label htmlFor="project_name_edit" className="form-label small">
                  {t('project_name')}
                  </label>
                  <input
                      type="text"
                      className="form-control form-control-sm "
                      id="project_name_edit"
                      name="project_name"
                      value={data.project_name  || ""}
                      onChange={handleChange}
                      dir='ltr'


                  />
              </div>




              <div className="mb-3">
                  <label htmlFor="project_name_hint_edit" className="form-label small">
                       {t('project_name_hint')}
                  </label>
                  <input
                      type="text"
                      className="form-control  form-control-sm"
                      id="project_name_hint_edit"
                      name="project_name_hint"
                      value={data.project_name_hint  || ""}
                      onChange={handleChange}
                      dir='ltr'


                  />
              </div>

              <div className="mb-3">
                  <label htmlFor="project_description_edit" className="form-label small">
                    {t('details')}
                  </label>
                  <textarea 
                      className="form-control  form-control-sm" 
                      id="project_description_edit"
                      name="project_description"
                      value={data.project_description  || ""}
                      onChange={handleChange}
                      dir='ltr'
                  >

                  </textarea>

              </div>




              <div className="mb-3">
                  <label htmlFor="project_name_ar_edit" className="form-label small">
                   {t('project_name_ar')}
                  </label>
                  <input
                      type="text"
                      className="form-control   form-control-sm text-end"
                      dir="rtl"
                      id="project_name_ar_edit"
                      name="project_name_ar"
                      value={data.project_name_ar  || ""}
                      onChange={handleChange}
                  />
              </div>


              <div className="mb-3">
                  <label htmlFor="project_name_hint_ar_edit" className="form-label small">
                   {t('project_name_hint_ar')}
                  </label>
                  <input
                      type="text"
                      className="form-control   form-control-sm text-end"
                      dir='rtl'
                      id="project_name_hint_ar_edit"
                      name="project_name_hint_ar"
                      value={data.project_name_hint_ar  || ""}
                      onChange={handleChange}


                  />
              </div>

              <div className="mb-3">
                  <label htmlFor="project_description_ar_edit" className="form-label small">
                     {t('details_ar')}
                  </label>
                  <textarea 
                      className="form-control   form-control-sm text-end"
                      dir='rtl' 

                      id="project_description_ar_edit"
                      name="project_description_ar"
                      value={data.project_description_ar  || ""}
                      onChange={handleChange}

                  >

                  </textarea>

              </div>


              <div className={` col-md-3  ms-2 ${locale === "ar" ? 'form-check-reverse' : 'form-check'} `}>
                <input
                    className="form-check-input small"
                    type="checkbox"

                    id="is_published_edit"
                    checked={data?.is_published}
                    // onChange={(e) => setIsPublished(e.target.checked)}
                    onChange={ (e) => {
                      setData((prevState) => ({
                        ...prevState,
                        is_published: e.target.checked,
                        }));
                      }
                    }
                />
                <label className="form-check-label small " htmlFor="is_published_edit">
                    {t('Published')}
                </label>
              </div>


              <div className={` col-md-3  ms-2 ${locale === "ar" ? 'form-check-reverse' : 'form-check'} `}>
                <input
                  className="form-check-input small"
                  type="checkbox"
            
                  id="is_auto_clone_template"
                  checked={data?.is_auto_clone_template}
                  onChange={ (e) => {
                    setData((prevState) => ({
                      ...prevState,
                      is_auto_clone_template: e.target.checked,
                      }));
                    }
                  }
                />
                <label className="form-check-label small " htmlFor="is_auto_clone_template">
                   {t('auto_clone_template')}
                </label>
              </div>


            {data?.is_auto_clone_template &&
              <FormSearchInput  handleobjectIdChange={handleChangeSelectedClonedTemplate} objectId={data?.default_template_to_clone} lable={t('search_template_lable')} ph={t('search_template_ph')} />

            }





              <div className="mb-3">
                <label htmlFor="main_image_edit" className="form-label small">
                  {t('main_image')}
                </label>
                <input
                  type="file"
                  className="form-control   form-control-sm"
                  accept="image/*"
                  id="main_image_edit"
                  name="main_image"                
                  onChange={handleChange}
                  ref={mainImagefileInputRef}
                />

                {data?.main_image &&  <a href={data?.main_image || '/#'} target="_blank">  {t('current_image')}  </a> }

              </div>


      <AddFilesComponent 
          custom_id = "extra_images_edit_form"
          title = {t('extra_images')}
          filesExtraImages={filesExtraImages} 
          setFilesExtraImages={setFilesExtraImages} 
          fileInputRefsExtraImages={fileInputRefsExtraImages} 
          only_image={true}
          isEdit_form={true}
          editProject_id={data?.id}
          files_type={"extra_images"}
      />

      <AddFilesComponent 
          custom_id = "attachment_edit"
          title = {t('Attachments')}
          filesExtraImages={filesAttachment} 
          setFilesExtraImages={setFilesAttachment} 
          fileInputRefsExtraImages={fileInputRefsFilesAttachment} 
          only_image={false}
          isEdit_form={true}

          editProject_id={data?.id}
          files_type={"attachment"}
      />



      



     





                </form>

              </div>



 
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
 

              >
                {/* {t('form_edit.cancel')} */}
                 {t('cancel')}
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleSubmit}
                // data-bs-dismiss="modal"
                disabled={isSubmitting}
              >
				{/* {editingItemId  ? t('form_edit.updating') : t('form_edit.update') } */}
                 {t('update')}
              </button>
            </div>
          </div>
        </div>
      </div>
 


    )
}