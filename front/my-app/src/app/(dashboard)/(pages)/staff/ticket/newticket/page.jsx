'use client'

import { useEffect, useState, useRef} from "react"
import { useCustomFetchMutation } from "@/app/(site)/_components/redux/features/siteApiSlice";
import { toast } from "react-toastify";
import { useRouter } from 'next/navigation';

import NewTicketUsersSearchInput from "@/app/(dashboard)/_components/jsx/tickets/new_ticket/input_search_users/page";

import { useTranslations, useLocale } from "next-intl";
import { getErrorMessage } from "@/app/public_utils/utils";

const Page = () =>  {


  const t = useTranslations('dashboard.ticket.add_new_ticket')
  const locale = useLocale()


  const [customFetch] = useCustomFetchMutation();
  const [departments, setDepartments] = useState([])

  const fileInputRefs = useRef([]); // Ref to hold references to file inputs
  const [files, setFiles] = useState([{ id: 1, file: null }]);
  const router = useRouter()
  const [userId, setUserId] = useState(''); // Ticket status state


  const [formData, setFormData] = useState({
    ticket_department: "",
    ticket_subject: "",
    ticket_body: "",
  });



  const handleUserIdChange = (selectedValue) => {
    setUserId(selectedValue);
  };




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
    const form = new FormData();

    // Append text fields to form data

    form.append("ticket_subject", formData.ticket_subject);
    form.append("ticket_body", formData.ticket_body);
    form.append("ticket_department", formData.ticket_department);
    form.append("ticket_user", userId);
 

    if (
      
      // formData.ticket_subject.trim() !== '' 
      // && formData.ticket_body.trim() !== ''
      // && formData.ticket_department.trim() !== ''
  
      (formData.ticket_subject && formData.ticket_subject.trim() !== '') && 
      (formData.ticket_body && formData.ticket_body.trim() !== '') && 
      (formData.ticket_department && formData.ticket_department.trim() !== '')   
      // (userId && userId.trim() !== '')  

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
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/staff/ticket/tickets/`,
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
        setUserId('')
        setFiles([{ id: 1, file: null }]);
        fileInputRefs.current.forEach((input) => {
          if (input) input.value = ""; // Reset file input value
        });


        if(locale === "ar"){
          toast.success("تم إنشاء التذكرة بنجاح");

        }else {
          toast.success("Your ticket has been added successfully!");

        }






        router.push('/staff/ticket');  
      } else {
        if(locale === "ar"){
          toast.error("حصل خطأ رقم 1 في إنشاء التذكرة");

        } else {
          toast.error("Failed 1 to submit the request.");

        }
        if (response?.error?.data?.message) {
          toast.error(getErrorMessage(response.error.data.message));
        } 



        if (response?.error?.data?.detail) {
          if(response.error.data.detail === "Permission denied for this operation."){
            if(locale === "ar") {
              toast.error(" لا يوجد لديك صلاحيات للقيام بهذه العملية!");
      
            } else {
              toast.error(response.error.data.detail);
            }
  
          }
        }


        console.log('response', response)
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      if(locale === "ar"){
        toast.error("حصل خطأ رقم 2 في إنشاء التذكرة");

      } else {
        toast.error("Error 2 submitting form.");

      }
    }

      
      console.log("Form is valid");
    } else {
      if(locale === "ar"){
        toast.error("جميع الحقول مطلوبة ");

      } else {
        toast.error("all fields are required ");

      }
    }







  };













useEffect(() => {
  const fetchDepartments = async () => {
    try {
      // Await the customFetch call to get the response
      const response = await customFetch({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/staff/ticket/departments/`,
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
 

      <div> 
      <div className="app-content-header">




      </div>

      <div className="app-content">



        <div className="container-fluid  min-vh-150 bg-white p-3 border rounded " >


          <h2>{t('form_title')}</h2>
          <form className="col-md-8 col-12 mb5 " onSubmit={handleSubmit}>



          <NewTicketUsersSearchInput label={ t('Search_Per_User_label') } handleUserIdChange={handleUserIdChange} userId={userId} />


            <div className="mb-3">
              <label htmlFor="requestType" className="form-label">
              {t('department_label')}
              </label>


                <select 
                  className="form-select" 
                  id="requestType"
                  name="ticket_department"  // Correct place for name
                  onChange={handleChange}  // Handle the change event
                  defaultValue="" 
                >

                <option disabled   value=''> {t('department_default_option')}</option>
                  {departments?.map((item) => (
                    <option key={item.id} value={item.id}>
                       { locale ==="ar"  ? item.department_name_ar :  item.department_name}
                    </option>
                  ))}
                </select>



            </div>


            <div className="mb-3">
              <label htmlFor="subject" className="form-label">
              {t('subject')} <span className="text-danger">*</span>
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
              {t('description')} <span className="text-danger">*</span>
              </label>
              <textarea
                className="form-control"
                id="description"
                rows={6}
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
                {t('upload_file') } {index + 1}
                </label>
                <input
                type="file"
                className="form-control-file mx-2"
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
                          {t('btn_remove_file')}
                        </button>
                    </div>

                    
                </div>
            )}
            </div>
        </div>
        ))}








            {/* <div className="mb-3">
              <label htmlFor="formFile" className="form-label">
                Attachments
              </label>
              <input className="form-control"  id="formFile" 
              
              type="file"
              name="files" 
              onChange={handleChange}             
              
              />
              <small className="form-text text-muted">
                Add file or drop files here
              </small>
            </div> */}



            <button type="submit" className="btn btn-primary">
              {t('submit')}
            </button>
          </form>
          </div>
          

          </div>
        </div>
    )

}




 export default Page 


 