'use client'
import { useEffect, useState } from "react";
import Link from "next/link";
 
 
import { useRouter } from 'next/navigation';


// import { useCustomFetchMutation } from "../../_components/redux/features/siteApiSlice";
import { useCustomFetchMutation } from "@/app/(dashboard)/_components/redux_staff/features/authApiSlice"

import { useRef } from "react";

 
 
import { useLocale, useTranslations } from "next-intl";
import { ar, enUS } from "date-fns/locale"; // Import necessary locales
import { useTrueFalseLabel, useStepsProcessStrategy, useManualStartMode } from "@/app/public_utils/hooks";
 

import { toast } from "react-toastify";
import { getErrorMessage } from "@/app/public_utils/utils";
 


const Page = () => {
  const getTrueFalseLabel = useTrueFalseLabel()
  const getStepsProcessStrategy = useStepsProcessStrategy()
  const getManualStartMode = useManualStartMode()



  const t = useTranslations('dashboard.projectFlow.projectflow_template')
  const locales = { ar, en: enUS }; // Map of supported locales
  const locale = useLocale(); // Get the current locale

  const formatNumber = (number) => {
    const formatter = new Intl.NumberFormat(locale === "ar" ? "ar-EG" : "en-US"); // Arabic for "ar", fallback to English
    return formatter.format(number);
  };

 

  const baseUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/staff/project_flow_template/`
  const [customFetch] = useCustomFetchMutation();

  const isFetching = useRef(false);
  const isInitialLoad = useRef(true);
  const [data, setData] = useState([]); // Store the ticket data
  const [nextPage, setNextPage] = useState(null)
  const [loading, setLoading] = useState(true); // Loading state

  const [searchTemplateNameQuery, setSearchTemplateNameQuery] = useState(''); // Search query state


 
  const router = useRouter();

 
  const [reloadFlag , setReloadFlag] = useState(false)

 

 

 
  const handleAddNewTemplate = () => {
    router.push('/staff/projectFlow/projectFlowTemplate/add_new_template');  
  };


 








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
        console.log(response)


           if (response?.error?.data?.message) {
             toast.error(getErrorMessage(response.error.data.message));
           } else {
             console.log(response);
           }


      }
     
    } catch (error) {
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
          template_name: searchTemplateNameQuery,

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
  }, [searchTemplateNameQuery]);




 

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
  }, [ ]);



    const handleSearchChange = (e) => {
      setSearchTemplateNameQuery(e.target.value);
    };
  
  


    return (

        <div> 
        <div className="app-content-header">



        </div>

        <div className="app-content">



          <div className="container-fluid  min-vh-150 bg-white p-3 border rounded " >



{ /*  start  sections   */}

<div className="  mt-1 mb-5 pb-5 ms-2  me-2 ">
  

 

    <div  className="row  ">
      <div className="col-12 col-md-6  ">
        <h4 className="mb-2">{t('main_page.page_title')}</h4>
      </div>

      <div className="col-12 col-md-6 d-flex justify-content-md-end">
        <button
          type="button"
          onClick={handleAddNewTemplate}
          className="btn btn-sm btn-outline-secondary"
        >
         {t('main_page.add_new_template')}
        </button>
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
 


            <div className="col-md-5 col-12 pt-2">
              <label htmlFor="template_name" className="form-label small"> 
               {t('main_page.template_name')}
            
              </label>
              <input
                type="text"
                className="form-control form-control-sm  "
                id="template_name"
                placeholder=  {t('main_page.search_ph')}
                aria-describedby="template_name"
                value={searchTemplateNameQuery}
                onChange={handleSearchChange}
              />
            </div>
 

          </div>

          <h6 className="text-muted mt-2 fs-6">{searchTemplateNameQuery && ` ${t('main_page.results')} : ${searchTemplateNameQuery}` }</h6>


        </form>
      </div>
    </div>
  </div>


  <table className="table table-striped d-none d-md-table ">
    <thead>
      <tr>
        <th scope="col">{t('main_page.id')}</th>
        <th scope="col">{t('main_page.template_name')}</th>
        <th scope="col">{t('main_page.show_steps_to_client')}</th>
 
        <th scope="col">{t('main_page.steps_process_strategy')}</th>
        <th scope="col">{t('main_page.manual_start_mode')}</th>

      </tr>
    </thead>
    <tbody>

      {data?.map((obj) => (
        <tr key={`table_${obj.id}`}>

          <td>{`#${formatNumber(obj?.id)}`}</td>


          <td>
            <Link href={`/staff/projectFlow/projectFlowTemplate/template_details/${obj.id}`}  >
              {obj?.template_name.length > 25 
              ? `${obj?.template_name.slice(0, 25)}...` 
              : obj?.template_name
              }        
            
            </Link>


          </td>
          <td>
            {/* {obj?.show_steps_to_client ? 'yes' : 'No'} */}
            {getTrueFalseLabel(obj?.show_steps_to_client)}
          </td>
 
          <td>{ getStepsProcessStrategy(obj?.default_start_process_step_or_sub_step_strategy)}</td>
          <td>{ getManualStartMode(obj?.manual_start_mode)}</td>

        </tr>
      ))}
    </tbody>
  </table>

  {/* Loading Indicator */}
  {loading && (
    <div className="text-center mt-4">
      <p>
        {locale === "ar" ? "جاري تحميل المحتوى..." : " Loading data..." }
       
      
      </p>
    </div>
  )}



  {/* Card View for smaller screens */}

 
 
 
 


    <div className="d-block d-md-none">
    {data?.map((obj) => (
      <div className="card mb-3" key={`card_${obj?.id}`}>
        <div className="card-body">

          <p>
            <strong>{t('main_page.id')} : </strong> #{formatNumber(obj?.id)}
          </p>




          <p>
            <strong>{t('main_page.template_name')} : </strong>

            <Link href={`/staff/projectFlow/projectFlowTemplate/template_details/${obj.id}`}  >
              {obj?.template_name.length > 25 
              ? `${obj?.template_name.slice(0, 25)}...` 
              : obj?.template_name
              }        
            
            </Link>
          </p>
          
          <p>
            <strong>{t('main_page.show_steps_to_client')} : </strong> {getTrueFalseLabel(obj?.show_steps_to_client)}
          </p>
 
           
          <p>
            <strong>{t('main_page.steps_process_strategy')}: </strong> { getStepsProcessStrategy(obj?.default_start_process_step_or_sub_step_strategy)}
          </p>
 
          <p>
            <strong>{t('main_page.manual_start_mode')} : </strong> { getManualStartMode(obj?.manual_start_mode)}
          </p>



        </div>
      </div>
    ))}
  </div>

   
</div>
 
  

          </div>
          

        </div>
      </div>


    )


}

export default Page