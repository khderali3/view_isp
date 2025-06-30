'use client'

import { useState, useEffect } from "react";
import { useCustomFetchMutation } from "@/app/(dashboard)/_components/redux_staff/features/authApiSlice";

import { toast } from "react-toastify";

import { useLocale, useTranslations } from "next-intl"
import { ar, enUS } from "date-fns/locale"; // Import necessary locales

import { parseISO, format } from "date-fns";
 
  


const ProjectFlowLisenseComponent = () =>{


    const locale = useLocale()
    const t = useTranslations('dashboard.licenses')

    const [data, setData] = useState({
        license_id: '',
        device_app_fingerprint: '',
        issued_at: '',
        expires_at: '',
        license_type: '',
        application: '',
        app_installation_id: '',
        issued_to : "",
        is_valid : "",
        reason : null,
    });

    const [customFetch] = useCustomFetchMutation();


    const currentLocale = locale === "ar" ? ar : enUS;

    const formatDate = (dateString) => {
   
        if (dateString) {
            return format(parseISO(dateString), 'dd MMM yyyy - h:mm a', { locale: currentLocale });
        }
    };
 







    const fetchData = async () => {
        try {
        const response = await customFetch({
            url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/staff/projectFlowApp/licanse/`,
            method: "GET",
        });

        if (response && response?.data) {
            setData(response.data.license_data);
        } else {
            toast.error(getErrorMessage(response?.error?.data));
        }
        } catch (error) {
        toast.error(getErrorMessage(error.data || error.message) || "Something went wrong");
        }
    };

  useEffect(() => {
    fetchData();
  }, []);


 

    return(
        <>
        
            <div className="row justify-content-center">
              <div className=" ">
 

                <div className="card shadow-sm">
                  <div className="card-header bg-light ">
                    <h5 className="mb-0">{t('title')} : {t('project_flow')}</h5>
                  </div>
                  <div className="card-body">
                    <div className="row mb-3">
                      <div className="col-md-6">
                        <strong>{t('License_ID')} : </strong>
                        <div className="text-muted">{data.license_id || "N/A"}</div>
                      </div>
                      <div className="col-md-6">
                        <strong>{t('Application')} : </strong>
                        <div className="text-muted">{data.application || "N/A"}</div>
                      </div>
                    </div>

                    <div className="row mb-3">
                      <div className="col-md-6">
                        <strong>{t('Issued_At')} : </strong>
                        <div className="text-muted">  
                          {data?.issued_at ? formatDate(data.issued_at) : "N/A"}
                        </div>
                      </div>
                      <div className="col-md-6">
                        <strong>{t('Expires_At')} : </strong>
                        <div className="text-muted">
                           {data?.expires_at ? formatDate(data.expires_at) : "N/A"}

                        </div>
                      </div>
                    </div>

                    <div className="row mb-3">
                      <div className="col-md-6">
                        <strong>{t('License_Type')} : </strong>
                        <div className="text-muted">{data.license_type || "N/A"}</div>
                      </div>
                      <div className="col-md-6">
                        <strong>{t('App_Installation_ID')} : </strong>
                        <div className="text-muted">{data.app_installation_id || "N/A"}</div>
                      </div>
                    </div>

                    <div className="row mb-3">
                      <div className="col-md-6">
                        <strong>{t('Issued_To')} : </strong>
                        <div className="text-muted">{data.issued_to || "N/A"}</div>
                      </div>
                      <div className="col-md-6">
                        <strong>{t('Device_And_App_Fingerprint')}  : </strong>
                        <div className="text-muted">{data.device_app_fingerprint || "N/A"}</div>
                      </div>
                    </div>

                    <div className="row mb-3">
                      <div className="col-md-6">
                        <strong>{t('Status')} : </strong>
                        <span className={`badge mx-2 ${data.is_valid ? 'bg-success' : 'bg-danger'}`}>

                          {locale === "ar" 
                            ? (data.is_valid ? "صالحة" : "غير صالحة") 
                            : (data.is_valid ? "Valid" : "Invalid")
                          }
 
                        </span>
                      </div>

                      {data.reason && (
                        <div className="col-md-6">
                          <strong>Reason:</strong>
                          <div className="text-danger">{data.reason}</div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <hr />    
         
        
        </>




    )
}

export default ProjectFlowLisenseComponent