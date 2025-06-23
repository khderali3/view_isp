"use client";

import { useState, useRef } from "react";
import { toast } from "react-toastify";
import { getErrorMessage } from "@/app/public_utils/utils";

 

import { useCustomFetchMutation } from "@/app/(site)/_components/redux/features/siteApiSlice"


import { useLocale } from "next-intl";


const useSubmitForm = (endpoint, onSuccess) => {
    const locale = useLocale()

    const [isSubmitting, setIsSubmitting] = useState(false);
    const fileInputRefs = useRef([]);
    const [customFetch] = useCustomFetchMutation();

    const handleSubmit = async (e, formData, requiredFields=[], method="POST",  setFormData,files, setFiles, onsuccess_message=null) => {
        e.preventDefault();
        

 
        for (const field of requiredFields) {
            if (!formData[field] || formData[field].trim() === "") {
                if (field === "note") {
                    toast.error("Comment note body can't be empty");
                } else if (field === "project_type") {
                    toast.error("project type can't be empty");
 
                } else if (field === "details") {
                    toast.error("details can't be empty");
                }
                return;  
            }
        }



        setIsSubmitting(true);

        try {
            const requestData = new FormData();

            Object.entries(formData).forEach(([key, value]) => {
                requestData.append(key, value);
              });
 
            files.forEach((fileInput) => {
                if (fileInput.file) {
                    requestData.append("file[]", fileInput.file);
                }
            });

            const response = await customFetch({
                url: endpoint,
                method: method,
                body: requestData, 
            });

            if (response && response.data) {
                if(onsuccess_message){
                     toast.success(onsuccess_message)
                } else {
                    if(locale === 'ar') {
                        toast.success("تم إضافة التعليق بنجاح.");
                    } else {
                        toast.success("Your comment has been added.");
                    }
                }

           
                setFormData({note: ""});
                setFiles([{ id: 1, file: null }]);

                fileInputRefs.current.forEach((input) => {
                    if (input) input.value = "";
                });

                if (onSuccess) onSuccess();  // Execute additional actions if provided
            } else {
                toast.error("Failed to submit the request.");
                if (response?.error?.data) {
                    toast.error(getErrorMessage(response.error.data));
                }
            }
        } catch (error) {
            console.error("Submission Error:", error);
            toast.error(getErrorMessage(error.data || error.message) || "Something went wrong");
        } finally {
            setIsSubmitting(false);
        }
    };

    return { isSubmitting, handleSubmit, fileInputRefs };
};

export default useSubmitForm;




