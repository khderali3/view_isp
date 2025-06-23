
import { useState, useRef } from "react"
import { toast } from "react-toastify";
 
import { getErrorMessage } from "@/app/public_utils/utils";
import { useCustomFetchMutation } from "@/app/(site)/_components/redux/features/siteApiSlice"

import { useTranslations, useLocale } from "next-intl";
import { AddFilesComponent } from "./add_project_components/extra_images";

import { FormSearchInput } from "../../project_flow_template/input_search_templates/page";

 



export const AddNewProjectComponent = ({handleReloadFlag=null}) => {
	const t = useTranslations('dashboard.projectFlow.projectType.form_add_or_edit')
	const locale = useLocale()
	const [customFetch] = useCustomFetchMutation();



    const [data, setData] = useState({
        project_name:'',
        project_name_hint: "",
        project_description: '',
        project_name_ar: '',
        project_name_hint_ar: '',
        project_description_ar: '',
     })

	 const [isPublished, setIsPublished] = useState(false) 
	 const [isAutoCloneTemplate, setIsAutoCloneTemplate] = useState(false)

	 const [selectedClonedTemplate, setSelectedClonedTemplate] = useState('')



	const isButtonDisabled = Object.values(data).some((value) => value.trim() === "");
    const [projectMainImageSelected, setProjectMainImageSelected] = useState(null)
    const mainImagefileInputRef = useRef(null);

	const [filesExtraImages, setFilesExtraImages] = useState([{ id: 1, file: null }]);
    const fileInputRefsExtraImages = useRef([]);


	const [filesAttachment, setFilesAttachment] = useState([{ id: 1, file: null }]);
    const fileInputRefsFilesAttachment = useRef([]);


	const [isSubmitting, setIsSubmitting] = useState(false)

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



	const handleSubmit = async (e) => {
		e.preventDefault()

		const emptyFields = Object.entries(data)
		.filter(([key, value]) => !value.trim()) // Check for empty values (ignoring spaces)
		.map(([key]) => key); // Extract field names
	
	  if (emptyFields.length > 0) {
		if(locale === 'ar'){
		toast.error(`جميع الحقول مطلوبة: ${emptyFields.join(", ")}`)

		} else {
		toast.error(`Please fill in all fields: ${emptyFields.join(", ")}`)

		}
		return;
	  }

	  if (!projectMainImageSelected){
		if(locale === 'ar'){
		toast.error(` يرجى إختيار صورة رئيسية للمشروع `)

		} else {
		toast.error(` kinely select main project type image `)

		}
		return;

	  }





		try{
			setIsSubmitting(true)

			const formData = new FormData()

            Object.entries(data).forEach(([key, value]) => {
                formData.append(key, value);
              });


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



			formData.append("is_published", isPublished);
			formData.append("is_auto_clone_template", isAutoCloneTemplate);

			if(selectedClonedTemplate) {
				formData.append("default_template_to_clone", selectedClonedTemplate  );
			}
 
 




 			const response = await customFetch({
			   url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/staff/projectflow/project_type/`,
			   method: "POST",
			   body: formData, 
			 });

			if(response && response.data){
				if (mainImagefileInputRef.current) {
					mainImagefileInputRef.current.value = ""; // Reset the file input
				}
 
 
				

				setData({
					project_name:'',
					project_name_hint: "",
					project_description: '',
					project_name_ar: '',
					project_name_hint_ar: '',
					project_description_ar: '',
				 })
				 setIsPublished(false);  // This resets the checkbox to unchecked
				 setIsAutoCloneTemplate(false)
				 setSelectedClonedTemplate(null)

				if(handleReloadFlag){handleReloadFlag()}

                setFilesExtraImages([{ id: 1, file: null }]);
                fileInputRefsExtraImages.current.forEach((input) => {
                    if (input) input.value = "";
                });



				setFilesAttachment([{ id: 1, file: null }]);
                fileInputRefsFilesAttachment.current.forEach((input) => {
                    if (input) input.value = "";
                });
				if( locale === 'ar'){

				} else {
					toast.success('your data has been submited')

				}


			} else{
				setIsSubmitting(false)
				console.log('response', response)
				if (response?.error?.data) {
					toast.error(getErrorMessage(response.error.data));
				}
			}


		} catch(error){
			console.log(error)			
			toast.error(getErrorMessage(error.data || error.message) || "Something went wrong");
		} finally{ setIsSubmitting(false) }

	}








    return ( 

		<div className="mb-3 col-md-10 col-12">

		<form   className="    "     >

          
			
			<div className="mb-3">
				<label htmlFor="project_name" className="form-label small">
 				{t('project_name')}
				</label>
				<input
					type="text"
					className="form-control form-control-sm "
					id="project_name"
					name="project_name"
					value={data.project_name  || ""}
					onChange={handleChange}
					dir='ltr'


				/>
			</div>


			<div className="mb-3">
				<label htmlFor="project_name_hint" className="form-label small">
                   {t('project_name_hint')}
				</label>
				<input
					type="text"
					className="form-control  form-control-sm"
					id="project_name_hint"
					name="project_name_hint"
					value={data.project_name_hint  || ""}
					onChange={handleChange}
					dir='ltr'


				/>
			</div>

			<div className="mb-3">
				<label htmlFor="project_description" className="form-label small">
 				 {t('details')}
				</label>
				<textarea 
					className="form-control  form-control-sm" 
 
					id="project_description"
					name="project_description"
					value={data.project_description  || ""}
					onChange={handleChange}
					dir='ltr'

				>

				</textarea>

			</div>



			
			<div className="mb-3">
				<label htmlFor="project_name_ar" className="form-label small">
 				  {t('project_name_ar')}
				</label>
				<input
					type="text"
					className="form-control   form-control-sm text-end"
					dir="rtl"
					id="project_name_ar"
					name="project_name_ar"
					value={data.project_name_ar  || ""}
					onChange={handleChange}
 				/>
			</div>


			<div className="mb-3">
				<label htmlFor="project_name_hint_ar" className="form-label small">
                {t('project_name_hint_ar')}
				</label>
				<input
					type="text"
					className="form-control   form-control-sm text-end"
					dir='rtl'
					id="project_name_hint_ar"
					name="project_name_hint_ar"
					value={data.project_name_hint_ar  || ""}
					onChange={handleChange}


				/>
			</div>

			<div className="mb-3">
				<label htmlFor="project_description_ar" className="form-label small">
                   {t('details_ar')}
				</label>
				<textarea 
					className="form-control   form-control-sm text-end"
					dir='rtl' 
 
					id="project_description_ar"
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
	
				id="is_published"
				checked={isPublished}
				onChange={(e) => setIsPublished(e.target.checked)}
			/>
			<label className="form-check-label small " htmlFor="is_published">
				  {t('Published')}
			</label>
		</div>


		<div className={` col-md-3  ms-2 ${locale === "ar" ? 'form-check-reverse' : 'form-check'} `}>
			<input
				className="form-check-input small"
				type="checkbox"
	
				id="is_auto_clone_template"
				checked={isAutoCloneTemplate}
				onChange={(e) => setIsAutoCloneTemplate(e.target.checked)}
			/>
			<label className="form-check-label small " htmlFor="is_auto_clone_template">
				 {t('auto_clone_template')}
			</label>
		</div>


		{isAutoCloneTemplate &&
			<FormSearchInput  handleobjectIdChange={setSelectedClonedTemplate} objectId={selectedClonedTemplate} lable={t('search_template_lable')} ph={t('search_template_ph')}  />

		}






            <div className="mb-3 mt-5">
              <label htmlFor="prod_image" className="form-label small">
 				 {t('main_image')}
              </label>
              <input
                type="file"
                className="form-control   form-control-sm"
                accept="image/*"
                id="prod_image"
                name="prod_image"                
                onChange={handleChange}
				ref={mainImagefileInputRef}
              />
              
            </div>


			<AddFilesComponent 
				custom_id = "extra_images"
				title =  {t('extra_images')}
				filesExtraImages={filesExtraImages} 
				setFilesExtraImages={setFilesExtraImages} 
				fileInputRefsExtraImages={fileInputRefsExtraImages} 
				only_image={true} 
			/>


			<AddFilesComponent 
				custom_id = "attachment"
				title = {t('Attachments')}
				filesExtraImages={filesAttachment} 
				setFilesExtraImages={setFilesAttachment} 
				fileInputRefsExtraImages={fileInputRefsFilesAttachment} 
				only_image={false} 
			/>


 








		<button
			className="btn btn-success mt-2"
			onClick={handleSubmit}
			disabled={isButtonDisabled || isSubmitting }
 		>

			{/* {addingItem ? t('form_add.adding_item') : t('form_add.add_item')} */}
			 {t('add')}
		</button>



		</form>


		</div>  


 









    )
}