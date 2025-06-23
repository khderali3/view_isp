'use client'
import { useState  } from "react";
import { useTranslations, useLocale } from "next-intl";


import useSubmitForm from "@/app/(site)/_components/hooks/project_hoks/use_submit_form";

import { useProjectStatus } from "@/app/public_utils/hooks";


export const  AddNewComment = ({project_id, project_status='',  handleReplayAdded }) => {

    const t = useTranslations('site.ticket.ticket_details_msgs.ticket_reply_form')

    const tt = useTranslations('dashboard.projectFlow.projectflow.projectflow_notes.add_note')
    const locale = useLocale()
    const getProjectStatus = useProjectStatus()



    const [files, setFiles] = useState([{ id: 1, file: null }]);
    const [formData, setFormData] = useState({note : ""});

    const { isSubmitting, handleSubmit, fileInputRefs } = useSubmitForm(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/site/project_flow/${project_id}/notes/`,
      handleReplayAdded
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

      project_status === 'completed' || project_status === 'canceled' ? (
        <div>
          <p>{tt('cant_add_note')} '{getProjectStatus(project_status)}'.</p>
        </div>
      ) : (


      <div> 
        <form className="mt-5 mb-5" onSubmit={(e) => handleSubmit(e, formData, ['note'],"POST", setFormData, files, setFiles)}>
            <div className="form-group">
              <label htmlFor="add_comment_text_aria">
                {/* Add A New Replay */}
                { locale === 'ar' ? 'أضف تعليق جديد' : 'Add New Comment' }

              </label>
              <textarea
                className="form-control"
                id="add_comment_text_aria"
                rows={2}
                name="note"
                value={formData.note}
                onChange={(e) => setFormData({ ...formData, note: e.target.value })} // Correctly updating state
                />
            </div>
            


              {/* Render file inputs dynamically */}
              {files.map((fileInput, index) => (
              <div className="card  p-2 m-2 shadow-sm border rounded" key={fileInput.id}>
                  <div className="form-group">
                  <div className="mb-3">
                      <label 
                      htmlFor={`fileInput-comment-${fileInput.id}`} 
                      className="form-label fw-bold me-1 ms-1 small"
                      >
                      {/* Upload File {index + 1} */}
                      {t('upload_file') } {index + 1}

                      </label>
                      <input
                      type="file"
                      className="form-control-file"
                      id={`fileInput-comment-${fileInput.id}`}
                      onChange={(e) => handleFileChange(e, fileInput.id)}
                      name="files[]"
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




            <button type="submit" className="btn btn-outline-primary btn-sm  mt-3 mb-5  " disabled={isSubmitting}>

            { isSubmitting && ( <span className="spinner-border spinner-border-sm me-2"></span> ) }  

              {/* Submit */}
              {t('btn_submit')}
            </button>
        </form>
      
      </div>


    )


    )
}


