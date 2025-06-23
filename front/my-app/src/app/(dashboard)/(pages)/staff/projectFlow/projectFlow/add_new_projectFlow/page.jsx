'use client'

import {  useState, useEffect  } from "react"

import { useCustomFetchMutation } from "@/app/(dashboard)/_components/redux_staff/features/authApiSlice"

import { toast } from "react-toastify";
import { useRouter } from 'next/navigation';

import { getErrorMessage } from "@/app/public_utils/utils";

import useSubmitForm from "@/app/(dashboard)/_components/hooks/project_hoks/use_submit_form";

import { useTranslations, useLocale } from "next-intl";

import UsersSearchInputGlopal from "@/app/(dashboard)/_components/jsx/input_search_users/page";


const Page = () =>  {

  const [projectUser, setProjectUser] = useState(''); // Ticket status state

  const t = useTranslations('site.ticket.add_new_ticket')
  const tt = useTranslations('dashboard.projectFlow.projectflow.add_new_projectflow')



  const locale = useLocale()

  const success_message = locale === 'ar' ? 'تم إنشاء المشروع بنجاح' : 'ProjectFlow has been added'



  const [customFetch] = useCustomFetchMutation();
  const [projectTypes, setProjectTypes] = useState([])
  const [files, setFiles] = useState([{ id: 1, file: null }]);
  const router = useRouter()


  const onSuccessSubmit = () => {
    router.push('/staff/projectFlow/projectFlow');
  }

  const handleUserIdChange = (selectedValue) => {
    if(selectedValue){
      setProjectUser(selectedValue);
    } else{
      setProjectUser('');
    } 
    console.log(selectedValue); // This will now log the selected user ID
  };

    
  const { isSubmitting, handleSubmit, fileInputRefs } = useSubmitForm(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/staff/projectflow/projectflow/`,
    onSuccessSubmit,
  );
  


  const [formData, setFormData] = useState({
    project_type: "",
    details: "",
    contact_phone_no : '',
    project_address: '',
    project_user: projectUser
  });

 
 
  // Handle input changes for text fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

    // Handler to add a new file input
    const handleAddMore = (e) => {
      e.preventDefault();
      setFiles([...files, { id: files.length + 1, file: null }]);
    };

    // Handler to remove the last file input
    const handleDeleteLast = (e) => {
        e.preventDefault();
        // Only remove if there are more than one file inputs
        if (files.length > 1) {
        setFiles(files.slice(0, -1));
        }
    };
  
  
    // Handler to update the file state when a file is selected
    const handleFileChange = (e, id) => {
        const updatedFiles = files.map((file) =>
        file.id === id ? { ...file, file: e.target.files[0] } : file
        );
        setFiles(updatedFiles);
    };

 
useEffect(() => {
  setFormData((prevState) => ({
    ...prevState,
    project_user: projectUser
  }));
}, [projectUser]);


 useEffect(() => {
   const fetchProjectTypes = async () => {
     try {
       // Await the customFetch call to get the response
       const response = await customFetch({
         url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/site/project/`,
         method: "GET",
         // body: formData,  // Use FormData as the body (if needed)
       });
   
       // Check if response and response.data are available
       if (response && response.data) {
 
         setProjectTypes(response.data);
       } else {
         // Handle the error case if there's no data or an error in the response
         console.log("Failed to get project.type" , response);
       }
     } catch (error) {
       // Catch any errors during the fetch operation
       console.error("Error fetching project.type:", error);
     }
   };
   
   fetchProjectTypes()
 
 }, []);
 

    return (
 

      <div> 
      <div className="app-content-header">


      </div>

      <div className="app-content">



        <div className="container-fluid  min-vh-150 bg-white p-3 border rounded " >


            <h4>{tt('title')} </h4>
            <form className="col-md-8 col-12 mb5 " onSubmit={(e) => handleSubmit(e, formData, ['project_type', 'details'],"POST", setFormData, files, setFiles, success_message)}>
            <div className="mb-3">
              <label htmlFor="project_type" className="form-label small">
                {tt('select_project_type_label')}
                <span className="text-danger">*</span>
              </label>


                <select 
                  className="form-select form-select-sm small" 
                  id="project_type"
                  name="project_type"  // Correct place for name
                  onChange={handleChange}  // Handle the change event
                  defaultValue="" 
                >

                <option disabled   value=''> 
                  {tt('Select_Project_Type')}
 
                  </option>
                  {projectTypes?.map((item) => (
                    <option key={item.id} value={item.id}>
                      { locale === 'ar' ?  item?.project_name_ar : item?.project_name }
                      {/* { locale ==="ar"  ? item.department_name_ar :  item.department_name} */}
                    </option>
                  ))}
                </select>



            </div>

          <UsersSearchInputGlopal 
                  handleUserIdChange={handleUserIdChange}
                  userId={projectUser}
                  ph= {tt('Select_ProjectFlow_User')}
                  lable={tt('Select_ProjectFlow_User')}
              />




            <div className="mb-3 mt-3">
              <label htmlFor="contact_phone_no" className="form-label small">
                {/* Contact Phone number */}
                 {tt('contact_phone_no')}
                 <span className="text-danger">*</span>
              </label>
              <input
                className="form-control form-control-sm"
                id="contact_phone_no"
 
                placeholder= {tt('contact_phone_no_ph')}
                // placeholder={t('description_placeholder')}
                required="" 
                name="contact_phone_no"
                onChange={handleChange}
                maxLength={30}
              />
            </div>

            <div className="mb-3 mt-3">
              <label htmlFor="project_address" className="form-label small">
                 {tt('project_address')}
                 <span className="text-danger">*</span>
              </label>
              <input
                className="form-control form-control-sm"
                id="project_address"
                 placeholder=  {tt('project_address_ph')}
                required
                name="project_address"
                onChange={handleChange}
              />
            </div>




            <div className="mb-3 mt-3">
              <label htmlFor="description" className="form-label small">
                {tt('Description')} 
 
                <span className="text-danger">*</span>
              </label>
              <textarea
                className="form-control  "
                id="description"
                rows={6}
                placeholder= {tt('Description_ph')}
                // placeholder={t('description_placeholder')}
                required=""
                // onChange={handleChange}
                name="details"
                onChange={handleChange}

              />
            </div>



        {/* Render file inputs dynamically */}
        {files.map((fileInput, index) => (
        <div className="card  p-2 m-2 shadow-sm border rounded" key={fileInput.id}>
            <div className="form-group">
            <div className="mb-3">
                <label 
                htmlFor={`fileInput-${fileInput.id}`} 
                className="form-label form-label-sm small fw-bold me-2"
                >
                {/* Upload File {index + 1} */}
                {t('upload_file') } {index + 1}

                </label>
                <input
                type="file"
                className="form-control-file small"
                id={`fileInput-${fileInput.id}`}
                onChange={(e) => handleFileChange(e, fileInput.id)}
                name="file[]"
                ref={(el) => (fileInputRefs.current[index] = el)} // Assign ref to each input
                />
            </div>
            
            {/* Only show the "Add More" and "Delete" buttons for the last file input */}
            {index === files.length - 1 && (
                <div className="row pt-0 mt-0">
                    <div className="col-12 col-md-auto">
                        <button
                        type="button"
                        className="btn btn-outline-secondary w-100 mb-2 mb-md-0 me-md-2 btn-sm  "
                        onClick={handleAddMore}
                        >
                        <i className="fa fa-plus me-2"></i> {/* Font Awesome icon */}
                        {/* Add More */}
                        {t('btn_add_More_file')}

                        </button>
                    </div>
                    <div className="col-12 col-md-auto">
                        <button
                        type="button"
                        className="btn btn-outline-danger w-100 btn-sm "
                        onClick={handleDeleteLast}
                        disabled={files.length <= 1} // Disable if only one input left
                        >
                        <i className="fa fa-trash me-2"></i> {/* Font Awesome icon */}
                        {/* Delete */}
                        {t('btn_remove_file')}

                        </button>
                    </div>

                    
                </div>
            )}
            </div>
        </div>
        ))}






 


            <button type="submit" className="btn btn-primary btn-sm"
            disabled={isSubmitting}
            >
              {/* Submit */}
               {tt('submit')}

            </button>
          </form>

          </div>
          

          </div>
        </div>
    )

}




 export default Page 


 