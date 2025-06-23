'use client'

import { useEffect, useState, useRef} from "react"
import { useCustomFetchMutation } from "@/app/(site)/_components/redux/features/siteApiSlice";
import { toast } from "react-toastify";
import { useRouter } from 'next/navigation';
import Link from "next/link";

import { getErrorMessage } from "@/app/public_utils/utils";

import { useTranslations, useLocale } from "next-intl";

import useSubmitForm from "@/app/(site)/_components/hooks/project_hoks/use_submit_form";

import { useSearchParams } from 'next/navigation';
 

const Page = () =>  {

  const locale = useLocale()
  const searchParams = useSearchParams();
  const selectedProjectTypeId = searchParams.get('projecttype_id');




  const t = useTranslations('site.ticket.add_new_ticket')
 
  const [customFetch] = useCustomFetchMutation();
  const [projectTypes, setProjectTypes] = useState([])
  const [files, setFiles] = useState([{ id: 1, file: null }]);
  const router = useRouter()


  const onSuccessSubmit = () => {
    router.push('/projectflow');
  }

  
  const { isSubmitting, handleSubmit, fileInputRefs } = useSubmitForm(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/site/project_flow/`,
    onSuccessSubmit,
  );


  const [formData, setFormData] = useState({
    // project_type: "",
    project_type: selectedProjectTypeId || "",
    contact_phone_no : '',
    project_address: '',
    details: "",
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
      <div className="mb-5 pb-5">  
      <div className="container mt-2">
        <h6> 
          <Link href='/projectflow'>
          {locale === 'ar' ? 'مشاريعي' : 'Projects Flow '}
          </Link>   - {locale === 'ar' ? ' مشروع جديد' : 'New ProjectFlow'} </h6>
        <hr />
      </div>



        <div className="container ">






          <h2>

            {locale === 'ar' ? 'طلب مشروع جديد' : 'Apply for a new Project'}
 
          </h2>
          <form className="col-md-8 col-12 mb5 " onSubmit={(e) => handleSubmit(e, formData, ['project_type', 'details'],"POST", setFormData, files, setFiles)}>
            <div className="mb-3">
              <label htmlFor="project_type" className="form-label small">
               

              {locale === 'ar' ? 'يرجى إختيار نوع المشروع' : ' Please select Project Type'}


                <span className="text-danger">*</span>
              </label>


                <select 
                  className="form-select form-select-sm" 
                  id="project_type"
                  name="project_type"  // Correct place for name
                  onChange={handleChange}  // Handle the change event
                  value={formData?.project_type}
                  >

                <option disabled   value=''> 
                    {locale === 'ar' ? 'يرجى الإختيار' : ' please Select'}
 
                  </option>
                  {projectTypes?.map((item) => (
                    <option key={item.id} value={item.id}>
                      {locale === 'ar' ? item?.project_name_ar : item?.project_name}
                       {/* { locale ==="ar"  ? item.department_name_ar :  item.department_name} */}
                    </option>
                  ))}
                </select>



            </div>

  


            <div className="mb-3 mt-3">
              <label htmlFor="contact_phone_no" className="form-label small">
                {/* Contact Phone number */}
                  { locale === 'ar' ?  'رقم هاتف التواصل' : 'Contact Phone number' }
                 <span className="text-danger">*</span>
              </label>
              <input
                className="form-control form-control-sm"
                id="contact_phone_no"
 
                placeholder=  { locale === 'ar' ?  'يرجى كتابة رقم هاتف للتواصل عليه عند الحاجة' : 'write contact phone number please '}
                // placeholder={t('description_placeholder')}
                required="" 
                name="contact_phone_no"
                onChange={handleChange}
                maxLength={30}
              />
            </div>





            <div className="mb-3 mt-3">
              <label htmlFor="project_address" className="form-label small">
                  { locale === 'ar' ?  'مكان تنفيذ المشروع' : 'Project place Address' }
                 <span className="text-danger">*</span>
              </label>
              <input
                className="form-control form-control-sm"
                id="project_address"
                 placeholder=   { locale === 'ar' ?  'يرجى كتابة عنوان المكان الذي تريد تنفيذ المشروع به. ' :  'write the address where you want to implemet this project ' }
                required
                name="project_address"
                onChange={handleChange}
              />
            </div>






            <div className="mb-3">
              <label htmlFor="description" className="form-label small">
                {locale === 'ar' ? 'الشرح' : 'Description'}

                 
 
                <span className="text-danger">*</span>
              </label>
              <textarea
                className="form-control "
                id="description"
                rows={6}
                placeholder={ locale === 'ar' 
                  ? " يرجى كتابة تفاصيل حول بيئة المشروع , وسيتم المباشرة بالعمل عليه من قبل طاقم العمل في أسرع وقت ممكن "
                : "Please enter the details of your project environment, and our staff will start working on it as soon as possible." }
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
                className="form-label fw-bold me-2"
                >
                {/* Upload File {index + 1} */}
                {t('upload_file') } {index + 1}

                </label>
                <input
                type="file"
                className="form-control-file"
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






 


            <button type="submit" className="btn btn-primary btn-sm mt-4"
            disabled={isSubmitting}
            >
              {/* Submit */}
              {t('submit')}

            </button>
          </form>
        </div>

 
        </div>
    )

}




 export default Page 


 