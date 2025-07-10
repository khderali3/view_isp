'use client'
import { useEffect, useState } from "react";

 
import { format, parseISO } from "date-fns";

  



import { useCustomFetchMutation } from "@/app/(dashboard)/_components/redux_staff/features/authApiSlice"

import { useRef } from "react";

 
 
import { useLocale, useTranslations } from "next-intl";
import { ar, enUS } from "date-fns/locale"; // Import necessary locales
import UsersSearchInputGlopal from "@/app/(dashboard)/_components/jsx/input_search_users/page";

import { useSelector } from "react-redux";

 
  
import { getErrorMessage } from "@/app/public_utils/utils";
import { toast } from "react-toastify";


import { DeleteSelectedButtonLogs } from "@/app/(dashboard)/_components/jsx/logs/error_logs/delete_selected_button";
import { FlushLogsButton } from "@/app/(dashboard)/_components/jsx/logs/error_logs/flush_records_button";


 
const Page = () => {


  
  const t = useTranslations('dashboard.logs.error_logs')



  const { permissions, is_superuser, is_staff  } = useSelector(state => state.staff_auth);

  const hasPermissionToLogsView = () => {
    if (is_superuser || (permissions?.includes('usersAuthApp.logs_view') && is_staff)) {
        return true
    }
      return false
  }



  const hasPermissionToLogsDelete = () => {
    if (is_superuser || (permissions?.includes('usersAuthApp.logs_delete') && is_staff)) {
        return true
    }
      return false
  }

 

 
 
   const locale = useLocale(); // Get the current locale

  const formatNumber = (number) => {
    const formatter = new Intl.NumberFormat(locale === "ar" ? "ar-EG" : "en-US"); // Arabic for "ar", fallback to English
    return formatter.format(number);
  };



 
    const currentLocale = locale === "ar" ? ar : enUS;



    const formatDate = (dateString) => {
   
        if (dateString) {
            return format(parseISO(dateString), 'dd MMM yyyy - h:mm a', { locale: currentLocale });
        }
    };






  const baseUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/staff/log/error_logs/`
  const [customFetch] = useCustomFetchMutation();

  const isFetching = useRef(false);
  const isInitialLoad = useRef(true);
  const [data, setData] = useState([]); // Store the ticket data
  const [nextPage, setNextPage] = useState(null)
  const [loading, setLoading] = useState(true); // Loading state

  

  const [userId, setUserId] = useState('');  
 
  const handleUserIdChange = (selectedValue) => {
    if(selectedValue){
      setUserId(selectedValue);
    } else{
      setUserId('');
    }
    
    console.log(selectedValue); // This will now log the selected user ID
  };
 

 

 

   const [selectedIds, setSelectedIds] = useState([]);
  const toggleSelectAll = () => {
    if (selectedIds.length === data.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(data.map(obj => obj.id));
    }
  };

  const toggleSelectRow = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };
 


  const handleReloadComponent = () => {
        setSelectedIds([]);
        setData([]);         
        setNextPage(null);   
        fetchData(baseUrl);  
  }





 

  const fetchData = async (pageUrl) => {
    setLoading(true);
    try {
      const response = await customFetch({
        url: pageUrl,
        method: 'GET', // Only use 'GET' for fetching data
        headers: {
          'Content-Type': 'application/json',
        }, 
      });
 
      if(response && response.data ){

        setNextPage(response.data.next_page_url);
        // setData(prevData => [...prevData, ...response.data.results]);
   
        const newData = response.data.results;
  
        // Merge existing data with new data and remove duplicates based on ticket.id
        setData(prevData => {
          const combinedData = [...prevData, ...newData];
          const uniqueData = combinedData.reduce((acc, current) => {
            // Check if the ticket.id is already in the accumulator
            const isDuplicate = acc.find(item => item.id === current.id);
            if (!isDuplicate) {
              acc.push(current);
            }
            return acc;
          }, []);
          
          return uniqueData;
  
  
        });

  
      } else {

            if(locale === 'ar'){
              if(getErrorMessage(response?.error?.data) === 'detail: Permission denied for this operation.'){
                 toast.error('لايوجد لديك صلاحيات للقيام بهذه العملية')
              } else {
                 toast.error(getErrorMessage(response?.error?.data))
              }
            } else {
               toast.error(getErrorMessage(response?.error?.data))
            }





 
        console.log(response)
      }
     
    } catch (error) {

      toast.error(getErrorMessage(error.data || error.message) || "Something went wrong");

      console.error("Error fetching data:", error);
    }
    setLoading(false);
  };


 


  useEffect(() => {
    if (isInitialLoad.current) {
      isInitialLoad.current = false; // Mark the initial load as complete
      return;
    }
      const performSearch = () => {
        const queryParams = new URLSearchParams({

          userId : userId,


        });
  
        // Construct the full URL with query parameters
        const searchUrl = `${baseUrl}?${queryParams.toString()}`;
        setData([]); // Clear previous data for a new search
        setNextPage(null); // Reset pagination
        fetchData(searchUrl); // Fetch with new search criteria
      };
      const timeoutId = setTimeout(() => {
        performSearch();
      }, 1000); // 3-second delay
  
      return () => clearTimeout(timeoutId);
  }, [  userId ]);



 

const handleScroll = () => {
  if (isFetching.current) return;

  if (
    window.innerHeight + window.scrollY >= document.body.offsetHeight - 500 && 
    !loading && 
    nextPage !== null 

  ) {
    isFetching.current = true; 
    fetchData(nextPage).then(() => {
      isFetching.current = false; 
    });
}};
  






  useEffect(() => {
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);

    };
  }, [loading, nextPage]); // Dependencies: loading and nextPage
  



  

  useEffect(() => {
    if (isFetching.current) return;
    fetchData(baseUrl).then(() => {
      isFetching.current = false; // Allow new featch  after fetch completes
      
    });
  }, [   ]);


 

 



if (!hasPermissionToLogsView()  ) {
  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100">
      <div className="text-danger">
      {locale === 'ar' ? 'ليس لديك صلاحيات لعرض هذه الصفحة' : ' You don’t have permission to view this page.'}
      </div>
    </div>
  )  
}


 



    return (

        <div> 
        <div className="app-content-header">



        </div>

        <div className="app-content  ">



          <div className="container-fluid  min-vh-150 bg-white p-3 border rounded " >



{ /*  start  sections   */}

            <div className="  mt-1 mb-5 pb-5 ms-2  me-2 ">
            
              

                <div className="row  ">
                  <div className="col-12 col-md-6  ">
                    <h4 className="mb-2">{t('title')}</h4>



                  </div>
                
                  <div className="col-12 col-md-6  d-flex justify-content-md-end">


                  {hasPermissionToLogsDelete() &&
                    <div className="d-flex gap-2 mb-3">

                        <DeleteSelectedButtonLogs selectedIds={selectedIds} handleReloadComponent={ handleReloadComponent} Delete_Selected_text={ t('Delete_Selected')} />
                        <FlushLogsButton  handleReloadComponent={ handleReloadComponent} Delete_Selected_text={t('Flush_All_Logs')} data_len={data?.length} />

                    </div>                  
                  }







                  </div>   




 
                </div>





              <hr />
              <div className=" ">
                <div className="  mb-3">
                  <div
                    className="container-fluid"
                    
                  >
                    <form className="pb-2">
                      <div className="row ">
            
  





                        <div className="col-md-5 col-12 pt-2  small">
            
                          <UsersSearchInputGlopal 
                                handleUserIdChange={handleUserIdChange}
                                userId={userId}
                                ph={t('user_search_ph')}
                                lable={t('user_search_lebel')}
                            />


                        </div>

  

                      </div>

 

                    </form>
                  </div>
                </div>
              </div>


              
            <div className="table-responsive">
              <table className="table table-hover table-bordered table-striped table-sm align-middle small d-none d-md-table w-100">
                <thead className="table-light">
                  <tr>
                    <th style={{ width: "3%" }}>
                      <input
                        type="checkbox"
                        checked={selectedIds.length === data.length && data.length > 0}
                        onChange={toggleSelectAll}
                      />
                    </th>
                    <th style={{ width: "15%" }}>{t('User')}</th>
                    <th style={{ width: "8%" }}>{t('ip_address')}</th>
                    <th style={{ width: "7%" }}>{t('Level')}</th>
                    <th style={{ width: "12%" }}>{t('Method')}</th>
                    <th style={{ width: "8%" }}>{t('Path')}</th>
                    <th style={{ width: "18%" }}>{t('Message')}</th>
                    <th style={{ width: "18%" }}>{t('Date')}</th>
                    <th style={{ width: "15%" }}>{t('Traceback')}</th>
                  </tr>
                </thead>
                  <tbody>
                    {data?.length > 0 ? (
                      data.map((obj) => (
                        <tr key={`table_${obj.id}`}>
                          <td>
                            <input
                              type="checkbox"
                              checked={selectedIds.includes(obj.id)}
                              onChange={() => toggleSelectRow(obj.id)}
                            />
                          </td>

                          <td className="text-truncate text-nowrap" title={obj?.user?.email}>
                            {obj?.user?.email}
                          </td>

                          <td className="text-truncate text-nowrap" title={obj?.ip_address}>
                            {obj?.ip_address}
                          </td>

                          <td className="text-truncate text-nowrap" title={obj?.level}>
                            {obj?.level}
                          </td>

                          <td className="text-truncate text-nowrap" title={obj?.request_method}>
                            {obj?.request_method}
                          </td>

                          <td className="text-truncate text-nowrap" title={obj?.request_path}>
                            {obj?.request_path}
                          </td>

                          <td className="text-truncate text-nowrap" title={obj?.message}>
                            {obj?.message}
                          </td>

                          <td className="text-truncate text-nowrap" title={formatDate(obj?.timestamp)}>
                            {formatDate(obj?.timestamp)}
                          </td>

                          <td>
                            {obj?.traceback ? (
                              <pre
                                className="mb-0"
                                style={{
                                  maxWidth: "100%",
                                  maxHeight: "200px",
                                  overflow: "auto",
                                  fontSize: "0.75rem",
                                  fontFamily: "monospace",
                                  whiteSpace: "pre-wrap",
                                  direction: "ltr",
                                }}
                                title="Click to copy"
                              >
                                {obj.traceback}
                              </pre>
                            ) : (
                              <span className="text-muted fst-italic">{t('No_Errors')}</span>
                            )}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={9} className="text-center text-muted py-4">
                          {t('No_data_available')}
                        </td>
                      </tr>
                    )}
                  </tbody>

              </table>
            </div>


















              {/* Loading Indicator */}
              {loading && (
                <div className="text-center mt-4">
                  <p>
                    {locale === "ar" ? "جاري تحميل المحتوى..." : " Loading data..." }
                  
                  
                  </p>
                </div>
              )}



              {/* Card View for small-screens */}

 
              <div className="d-block d-md-none small-screens">
                {/* Select All Checkbox */}
                <div className={`mb-2 ${locale === 'ar' ? 'form-check-reverse' : 'form-check'}`}>
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="selectAllMobile"
                    checked={selectedIds.length === data.length && data.length > 0}
                    onChange={toggleSelectAll}
                  />
                  <label className="form-check-label" htmlFor="selectAllMobile">
                    {t('Select_All')}
                  </label>
                </div>

                {/* Show log cards or fallback message */}
                {data?.length > 0 ? (
                  data.map((obj) => (
                    <div className="card mb-3 shadow-sm" key={`card_${obj?.id}`}>
                      <div className="card-body">
                        {/* Row Checkbox */}
                        <div className={`mb-2 ${locale === 'ar' ? 'form-check-reverse' : 'form-check'}`}>
                          <input
                            className="form-check-input"
                            type="checkbox"
                            id={`checkbox_${obj.id}`}
                            checked={selectedIds.includes(obj.id)}
                            onChange={() => toggleSelectRow(obj.id)}
                          />
                          <label className="form-check-label" htmlFor={`checkbox_${obj.id}`}>
                            {t('Select_this_log')}
                          </label>
                        </div>

                        <div className="mb-1">
                          <strong>{t('User')} : </strong> {obj?.user?.email  }
                        </div>

                        <div className="mb-1">
                          <strong>{t('ip_address')} : </strong> {obj?.ip_address || <span className="text-muted fst-italic">{t('N/A')}</span>}
                        </div>

                        <div className="mb-1">
                          <strong>{t('Level')} : </strong> {obj?.level}
                        </div>

                        <div className="mb-1">
                          <strong>{t('Method')} : </strong> {obj?.request_method}
                        </div>

                        <div className="mb-1">
                          <strong>{t('Path')} : </strong><br />
                          <code className="d-block text-break">{obj?.request_path}</code>
                        </div>

                        <div className="mb-1">
                          <strong>{t('Message')} : </strong><br />
                          <div className="text-break small">{obj?.message}</div>
                        </div>

                        <div className="mb-1">
                          <strong>{t('Date')} : </strong> {formatDate(obj?.timestamp)}
                        </div>

                        <div className="mb-2">
                          <strong>{t('Traceback')} : </strong><br />
                          {obj?.traceback ? (
                            <pre
                              className="small p-2 bg-light border rounded"
                              style={{
                                maxHeight: "200px",
                                overflow: "auto",
                                fontFamily: "monospace",
                                whiteSpace: "pre-wrap",
                                direction: "ltr",
                              }}
                            >
                              {obj.traceback}
                            </pre>
                          ) : (
                            <span className="text-muted fst-italic">{t('No_Errors')}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="alert alert-light text-center text-muted py-4" role="alert">
                    {t('No_data_available')}
                  </div>
                )}
              </div>





              
            </div>
 
  

          </div>
          

        </div>
      </div>


    )



  


}

export default Page