


import { useState, useRef } from "react";

import { ProjectFileList } from "../edit_project/projectType_files_list";

import { useTranslations } from "next-intl";

export const AddFilesComponent = ({
    title="Files" ,
    custom_id="custom_id", 
    filesExtraImages=null, 
    setFilesExtraImages=null, 
    fileInputRefsExtraImages, 
    only_image=false,
    isEdit_form=false,
    editProject_id=null,
    files_type // or "attachment"

    }) => {

    const t = useTranslations('site.ticket.ticket_details_msgs.ticket_reply_form')

	

    // Handler to add a new file input
    const handleAddMoreExtraImages = (e) => {
		e.preventDefault();
		setFilesExtraImages([...filesExtraImages, { id: filesExtraImages.length + 1, file: null }]);
	  };
  
    // Handler to remove the last file input
    const handleDeleteLastExtraImages = (e) => {
        e.preventDefault();
        // Only remove if there are more than one file inputs
        if (filesExtraImages.length > 1) {
        setFilesExtraImages(filesExtraImages.slice(0, -1));
        }
    };
	
	
    // Handler to update the file state when a file is selected
    const handleFileChangeExtraImages = (e, id) => {
        const updatedFiles = filesExtraImages.map((file) =>
        file.id === id ? { ...file, file: e.target.files[0] } : file
        );
        setFilesExtraImages(updatedFiles);
    };








return(



    <div className="mt-2 extra-images">

    <div>{title}</div>


    {isEdit_form && editProject_id && <ProjectFileList project_id={editProject_id} files_type={files_type} /> }

 

    {/* Render file inputs dynamically */}
    {filesExtraImages.map((fileInput, index) => (
    <div className="card  p-2 m-2 shadow-sm border rounded" key={fileInput.id}>
        <div className="form-group">
        <div className="mb-3">
            <label 
            htmlFor={`fileInput-extra-images-${fileInput.id}-${custom_id}`} 
            className="form-label fw-bold me-1 ms-1 small"
            >
            {/* Upload File {index + 1} */}
            {t('upload_file') } {index + 1}

            </label>
            <input
            type="file"
            className="form-control-file   "
            id={`fileInput-extra-images-${fileInput.id}-${custom_id}`}
            onChange={(e) => handleFileChangeExtraImages(e, fileInput.id)}
            name="extra_images[]"
            ref={(el) => (fileInputRefsExtraImages.current[index] = el)} // Assign ref to each input

            accept={only_image ? "image/*" : undefined} // Conditional accept attribute
            

            />
        </div>
        
        {/* Only show the "Add More" and "Delete" buttons for the last file input */}
        {index === filesExtraImages.length - 1 && (
            <div className="row pt-0 mt-0">
                <div className="col-12 col-md-auto">
                    <button
                    type="button"
                    className="btn btn-outline-secondary w-100 mb-2 mb-md-0 me-md-2 btn-sm  "
                    onClick={handleAddMoreExtraImages}
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
                    onClick={handleDeleteLastExtraImages}
                    disabled={filesExtraImages.length <= 1}  
                    >
                    <i className="fa fa-trash me-2"></i> 
                    {/* Delete */}
                    {t('btn_remove_file')}
                    </button>
                </div>

                
            </div>
        )}
        </div>
    </div>
    ))}


</div>









)



}