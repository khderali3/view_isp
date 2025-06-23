'use client'
import { useState , useRef } from "react";
import { useCustomFetchMutation } from "../../../redux/features/siteApiSlice";
import { toast } from 'react-toastify';
 

import { useTranslations, useLocale } from "next-intl";


const  AddNewReplayForm = ({ticket_id, handleReplayAdded }) => {

    const t = useTranslations('site.ticket.ticket_details_msgs.ticket_reply_form')
    const locale = useLocale()

    const [customFetch] = useCustomFetchMutation();

    const [files, setFiles] = useState([{ id: 1, file: null }]);
    const [loading, setLoading] = useState(false);
    const [ticketReplayBody, setTicketReplayBody] = useState("");
    const fileInputRefs = useRef([]); // Ref to hold references to file inputs



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



    






  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Create FormData to handle file and text data
    const formData = new FormData();
    formData.append("ticket_replay_body", ticketReplayBody);
    formData.append("ticket_replay_ticket", ticket_id);



    if (ticketReplayBody.trim() !== '' ){ 
        // Append each file to the FormData object
        files.forEach((fileInput) => {
          if (fileInput.file) {
            formData.append("ticket_reply_files[]", fileInput.file);

          }
        });


        for (let pair of formData.entries()) {
            console.log(`${pair[0]}:`, pair[1]); // Logs key-value pairs in FormData
          }


          try {
            setLoading(true);
            
            // Send data using customFetch mutation
            const response = await customFetch({
              url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/ticket/ticket_replay/`,
              method: "POST",
              body: formData,  // Use FormData as the body
      
            });
      
      
          if (response && response.data) {
              if( locale === "ar" ){
                toast.success("تم إضافة الرد بنجاح");

              } else {
                toast.success("Your Replay added successfully");

              }
              setTicketReplayBody("");
              setFiles([{ id: 1, file: null }]);
        
              // Clear all file input values using refs
              fileInputRefs.current.forEach((input) => {
                if (input) input.value = ""; // Reset file input value
              });
        
              handleReplayAdded();
            } else {
              // Handle the error case if there's no data or an error in the response
              console.log("response", response)
              if( locale === "ar" ) {
                toast.error("حدث خطأ في اضافة الرد يرجى المحاولة مجدداً");

              } else {
                toast.error("Failed to add replay. Please try again.");

              }
            }
      
          } catch (error) {
            console.error("Error submitting data:", error);

            if( locale === "ar" ) {
              toast.error("حدث خطأ في اضافة الرد يرجى المحاولة مجدداً");

            } else {
              toast.error('Error submitting data');

            }

          }
          setLoading(false);

      
    } else {

      toast.error("your replay can't be empty !");

    }

    
  };




    return(


        <div>


 
<form className="mt-5 mb-5" onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="exampleFormControlTextarea1">
          {/* Add A New Replay */}
          {t('add_a_new_reply')}
        </label>
        <textarea
          className="form-control"
          id="exampleFormControlTextarea1"
          rows={6}
          name="ticket_replay_body"
          value={ticketReplayBody}
          onChange={(e) => setTicketReplayBody(e.target.value)}
        />
      </div>
      


        {/* Render file inputs dynamically */}
        {files.map((fileInput, index) => (
        <div className="card  p-2 m-2 shadow-sm border rounded" key={fileInput.id}>
            <div className="form-group">
            <div className="mb-3">
                <label 
                htmlFor={`fileInput-${fileInput.id}`} 
                className="form-label fw-bold me-1 ms-1"
                >
                {/* Upload File {index + 1} */}
                {t('upload_file') } {index + 1}

                </label>
                <input
                type="file"
                className="form-control-file"
                id={`fileInput-${fileInput.id}`}
                onChange={(e) => handleFileChange(e, fileInput.id)}
                name="ticket_reply_files[]"
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




      <button type="submit" className="btn btn-outline-primary  mt-3 mb-5 btn-flexible" disabled={loading}>

      { loading && ( <span className="spinner-border spinner-border-sm me-2"></span> ) }  

        {/* Submit */}
        {t('btn_submit')}
      </button>
    </form>
 
 
 




        </div>





    )
}


export default AddNewReplayForm