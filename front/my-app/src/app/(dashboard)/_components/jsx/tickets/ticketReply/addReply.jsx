'use client'
import { useState , useRef } from "react";
import { toast } from 'react-toastify';
import { useCustomFetchMutation } from "@/app/(site)/_components/redux/features/siteApiSlice";


import { useTranslations, useLocale } from "next-intl";


const  AddNewReplyForm = ({ticket_id, handleReplayAdded }) => {

    const t = useTranslations('dashboard.ticket.ticket_details_msgs.ticket_reply_form')
    const locale = useLocale()

    const [customFetch] = useCustomFetchMutation();

    const [files, setFiles] = useState([{ id: 1, file: null }]);
    const [loading, setLoading] = useState(false);
    const [ticketReplayBody, setTicketReplayBody] = useState("");
    const fileInputRefs = useRef([]); // Ref to hold references to file inputs

    const [waitCustomerReply, setWaitCustomerReply] = useState(false)



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

    if(waitCustomerReply) {
      formData.append("is_wait_customer_reply", waitCustomerReply);

    }


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
              url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/staff/ticket/ticket_reply/`,
              method: "POST",
              body: formData,  // Use FormData as the body
      
            });
      
      
          if (response && response.data) {

              if(locale === "ar"){
                toast.success("تم إضافة ردك بنجاح");

              } else {
                toast.success("Your Replay added successfully");

              }


              setTicketReplayBody("");
              setFiles([{ id: 1, file: null }]);
              setWaitCustomerReply(false)
        
              // Clear all file input values using refs
              fileInputRefs.current.forEach((input) => {
                if (input) input.value = ""; // Reset file input value
              });
        
              handleReplayAdded();
            } else {
              // Handle the error case if there's no data or an error in the response
              if(locale === "ar"){
                toast.error("حدث خطأ رقم 1 أثناء إضافة الرد , يرجى المحاولة مجدداً");

              } else {
                toast.error("Failed to add replay. Please try again.");

              }
              console.error("Error submitting data: response is:", response);

            }
      
          } catch (error) {
            
            console.error("Error submitting data:", error);
            if(locale === "ar"){
              toast.error('حدث خطأ رقم 2 أثناء محاولة إضافة الرد , يرجى المحاولة مجدداً');

            } else {
              toast.error('Error submitting data');

            }
          } finally{ setLoading(false);}

         

      
    } else {

      if(locale === "ar"){
        toast.error("لا يمكن أن يكون الرد فارغ");

      } else {
        toast.error("your replay can't be empty !");

      }



      setLoading(false);
    }

    
  };




    return(


        <div>


 
<form className="mt-5 mb-5" onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="exampleFormControlTextarea1" className="mb-2">{t('add_a_new_reply')}</label>
        <textarea
          className="form-control"
          id="exampleFormControlTextarea1"
          rows={6}
          name="ticket_replay_body"
          value={ticketReplayBody}
          onChange={(e) => setTicketReplayBody(e.target.value)}
        />
      </div>
      

  <div className="  mb-3">
    <input
    className="form-check-input"
    type="checkbox"
 
    id="wait_customer_reply"
    onChange={() => setWaitCustomerReply(!waitCustomerReply)}
    checked={waitCustomerReply} // Bind state to checkbox


    />
    <label className="form-check-label mx-2" htmlFor="wait_customer_reply">
    {/* Mark as "wait_customer_reply" status */}
      {t('mark_wait_customer_reply')}
    </label>
  </div>







        {/* Render file inputs dynamically */}
        {files.map((fileInput, index) => (
        <div className="card  p-2 m-2 shadow-sm border rounded" key={fileInput.id}>
            <div className="form-group">
            <div className="mb-3">
                <label 
                htmlFor={`fileInput-${fileInput.id}`} 
                className="form-label fw-bold mx-2"
                >
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




      <button type="submit" className="btn btn-outline-primary mt-3 mb-5 btn-flexible" disabled={loading} >
      {/* {loading ? "Submitting..." : "Submit"} */}

      { loading && ( <span className="spinner-border spinner-border-sm me-2"></span> ) }  
        {t('btn_submit')}
      </button>
    </form>
 
 
 




        </div>





    )
}


export default AddNewReplyForm