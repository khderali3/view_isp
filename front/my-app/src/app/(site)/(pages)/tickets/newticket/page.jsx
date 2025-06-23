'use client'

import { useEffect, useState, useRef} from "react"
import { useCustomFetchMutation } from "@/app/(site)/_components/redux/features/siteApiSlice";
import { toast } from "react-toastify";
import { useRouter } from 'next/navigation';
import Link from "next/link";


import { useTranslations, useLocale } from "next-intl";




const Page = () =>  {

  const t = useTranslations('site.ticket.add_new_ticket')
  const locale = useLocale()

  const [customFetch] = useCustomFetchMutation();
  const [departments, setDepartments] = useState([])

  const fileInputRefs = useRef([]); // Ref to hold references to file inputs
  const [files, setFiles] = useState([{ id: 1, file: null }]);
  const router = useRouter()

  const [isSubmitting, setIsSubmitting] = useState(false)


  const [formData, setFormData] = useState({
    ticket_department: "",
    ticket_subject: "",
    ticket_body: "",
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





  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true)
    const form = new FormData();

    // Append text fields to form data
    form.append("ticket_department", formData.ticket_department);
    form.append("ticket_subject", formData.ticket_subject);
    form.append("ticket_body", formData.ticket_body);



    if (formData.ticket_subject.trim() !== '' 
      && formData.ticket_body.trim() !== ''
      && formData.ticket_department.trim() !== ''
  
    ) {
      
    // Append each file to the FormData object
    files.forEach((fileInput) => {
      if (fileInput.file) {
        form.append("ticket_files[]", fileInput.file);
      }
    });


    try {
      // Send form data using customFetch mutation
      const response = await customFetch({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/ticket/`,
        method: "POST",
        body: form, // Send FormData as the body
      });

      if (response && response.data) {
        // Clear form fields and files on successful submission
        setFormData({
          ticket_department: "",
          ticket_subject: "",
          ticket_body: "",
        });
        setFiles([{ id: 1, file: null }]);
        fileInputRefs.current.forEach((input) => {
          if (input) input.value = ""; // Reset file input value
        });

        if(locale === "ar"){
          toast.success("تم إنشاء التذكرة بنجاح");

        } else{
          toast.success("Your ticket has been created successfully!");
        }
        router.push('/tickets');  
      } else {
        if(locale === "ar"){
          toast.error("خطأ1 في انشاء التذكرة يرجى المحاولة مجدداً");

        } else{
          toast.error("Failed 1 to submit the request.");

        }
        console.log(response)
      }
    } catch (error) {
      if(locale === "ar"){
        toast.error("خطأ2  في انشاء التذكرة يرجى المحاولة مجدداً");

      } else {
        toast.error("Failed 2 to submit the request.");

      }

      console.error("Error submitting form:", error);
    } finally{    setIsSubmitting(false)  }

      
      console.log("Form is valid");
    } else {

      if(locale === "ar"){
        toast.error("يرجى ملئ كافة الحقول ");

      } else{
        toast.error("Please fill out department - subject and Description  ");

      }
      setIsSubmitting(false) 

    }







  };













useEffect(() => {
  const fetchDepartments = async () => {
    try {
      // Await the customFetch call to get the response
      const response = await customFetch({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/ticket/departments/`,
        method: "GET",
        // body: formData,  // Use FormData as the body (if needed)
      });
  
      // Check if response and response.data are available
      if (response && response.data) {

        setDepartments(response.data);
      } else {
        // Handle the error case if there's no data or an error in the response
        console.log("Failed to get departments. Please try again.");
      }
    } catch (error) {
      // Catch any errors during the fetch operation
      console.error("Error fetching departments:", error);
    }
  };
  
  fetchDepartments()

}, []);


    return (
      <div className="mb-5 pb-5">  
      <div className="container mt-2">
        <h6> <Link href='/tickets'> Tickets </Link>   - New Request </h6>
        <hr />
      </div>



        <div className="container ">






          <h2>
            {/* Submit a request */}
            {t('form_title')}
          </h2>
          <form className="col-md-8 col-12 mb5 " onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="requestType" className="form-label">
                {/* Please select target department */}
                {t('department_label')}
              </label>


                <select 
                  className="form-select" 
                  id="requestType"
                  name="ticket_department"  // Correct place for name
                  onChange={handleChange}  // Handle the change event
                  defaultValue="" 
                >

                <option disabled   value=''> 
                  {/* Select Department */}
                  {t('department_default_option')}
                  </option>
                  {departments?.map((item) => (
                    <option key={item.id} value={item.id}>
                      { locale ==="ar"  ? item.department_name_ar :  item.department_name}
                    </option>
                  ))}
                </select>



            </div>


            <div className="mb-3">
              <label htmlFor="subject" className="form-label">
                {/* Subject  */}
                {t('subject')}
                <span className="text-danger">*</span>
              </label>
              <input  
              name="ticket_subject" 
              onChange={handleChange}

              className="form-control" 
              id="subject" required="" 
              maxLength="50" 

              />
            </div>


            <div className="mb-3">
              <label htmlFor="description" className="form-label">
                {/* Description  */}
                {t('description')}
                <span className="text-danger">*</span>
              </label>
              <textarea
                className="form-control"
                id="description"
                rows={6}
                // placeholder="Please enter the details of your request, and our staff will respond as soon as possible."
                placeholder={t('description_placeholder')}


                required=""
                // onChange={handleChange}
                name="ticket_body"
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
                name="ticket_files[]"
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






 


            <button type="submit" className="btn btn-primary"
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


 