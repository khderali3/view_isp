'use client'
import { useState  } from "react";
import { useTranslations } from "next-intl";


import useSubmitForm from "@/app/(site)/_components/hooks/project_hoks/use_submit_form";





export const AddNewNote =  ({note_for="step", step_or_step_id=null, handleReloadFlag=null}) => {

    const t = useTranslations('site.ticket.ticket_details_msgs.ticket_reply_form')


    const tt = useTranslations('dashboard.projectFlow.projectflow.projectflow_step.add_note')




    const [files, setFiles] = useState([{ id: 1, file: null }]);
    const [formData, setFormData] = useState({note : ""});

    const submit_url = note_for === "step" 
        ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/staff/projectflow/projectflow/step/${step_or_step_id}/note/`
        : `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/staff/projectflow/projectflow/step/sub_step/${step_or_step_id}/note/`  
 
        

    const { isSubmitting, handleSubmit, fileInputRefs } = useSubmitForm(
        submit_url,
        handleReloadFlag
    );


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

    return(
 

        <div className="    new-note-form mt-4">
            <form onSubmit={(e) => handleSubmit(e, formData, ['note'],"POST", setFormData, files, setFiles)}>
                {/* Note Textarea */}
                <div className="mb-2">
                    <textarea
                        id={`${note_for}-${step_or_step_id}-noteText`}
                        className="form-control form-control-sm"
                        rows="2"
                        placeholder={tt('input_ph')}
 
                        name="note"
                        value={formData.note}
                        onChange={(e) => setFormData({ ...formData, note: e.target.value })} // Correctly updating state



                    ></textarea>
                </div>

 


 


                {files.map((fileInput, index) => (
                        <div className="card p-2 m-2  shadow-sm border rounded" key={fileInput.id}>


                            <div className="form-group">



                                <div className="mb-3">
                                    <label 

                                    htmlFor={`${note_for}-${step_or_step_id}-fileInput-${fileInput.id}`} 
                                    className="form-label fw-bold me-1 ms-1 small "
                                    >
                                  
                                    {t('upload_file') } {index + 1}

                                    </label>

                                    <input
                                    type="file"
                                    className="form-control w-100 form-control-sm"
                                    id={`${note_for}-${step_or_step_id}-fileInput-${fileInput.id}`}
                                    onChange={(e) => handleFileChange(e, fileInput.id)}
                                    name="files[]"
                                    ref={(el) => (fileInputRefs.current[index] = el)}  
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


 


 
                <button type="submit" disabled={isSubmitting} className="btn btn-sm btn-primary">{tt('btn_label')}</button>
            </form>
        </div>
       

       
    )
}