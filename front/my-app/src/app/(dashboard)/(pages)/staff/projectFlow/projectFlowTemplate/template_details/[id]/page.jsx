'use client';

import { useState, useEffect } from "react"
import { useParams } from 'next/navigation'

import { useCustomFetchMutation } from "@/app/(dashboard)/_components/redux_staff/features/authApiSlice";

import { ProjectFlowNotes } from "@/app/(dashboard)/_components/jsx/project_flow_template/project_comments/projectFlowComments";

import { parseISO, format } from "date-fns";
  
 
import { useSelector } from "react-redux";
 
import Link from "next/link";

 

import { toast } from "react-toastify";

import { useRouter } from "next/navigation";

 
import { useTranslations, useLocale } from "next-intl";

import { ar, enUS } from "date-fns/locale"; // Import necessary locales

import { Timeline } from "@/app/(dashboard)/_components/jsx/project_flow_template/timeline";

 import CustomModal from "@/app/(dashboard)/_components/jsx/myModal";

import { useTrueFalseLabel, useStepsProcessStrategy, useManualStartMode } from "@/app/public_utils/hooks"; 


const Page = () => {

    const getTrueFalseLabel = useTrueFalseLabel()

    const getStepsProcessStrategy = useStepsProcessStrategy()
    const getManualStartMode = useManualStartMode()


    const t = useTranslations('dashboard.projectFlow.template_details')


    const locale = useLocale(); // Get the current locale



    const currentLocale = locale === "ar" ? ar : enUS;
 
    const {id} = useParams()  

    const [data, setData] = useState({})
    const [loading, setLoading] = useState(true); // Loading state

    const [customFetch] = useCustomFetchMutation();

    const router = useRouter()
 
    
    const [isModalOpen, setIsModalOpen] = useState(false); // State to control modal visibility
    const [deleting, setDeleting] = useState(false)


   const handleDelete = async () => {
    setDeleting(true)
     try {   
       const response = await customFetch({
         url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/staff/project_flow_template/${id}/`,
         method: "DELETE",
       });  
       if (response && response.data) {
        router.push('/staff/projectFlow/projectFlowTemplate')
        if(locale === 'ar'){
        toast.success('تم الحذف بنجاح')

        } else{
        toast.success('the object has been deleted')

        }
       } else {
         toast.error(getErrorMessage(response?.error?.data))
 
       }
     } catch (error) {
       toast.error(getErrorMessage(error.data || error.message) || "Something went wrong");
     } finally{setDeleting(false)}
   };



    const [reloadFlag , setReloadFlag] = useState(false)

    const reloadComponentMethod = () => {
      setReloadFlag((prev) => !prev);  
    };
  
  
 



    const formatDate = (dateString) => {
   
        if (dateString) {
            return format(parseISO(dateString), 'dd MMM yyyy - h:mm a', { locale: currentLocale });
        }
    };
 

 
   
      const formatNumber = (number) => {
        const formatter = new Intl.NumberFormat(locale === "ar" ? "ar-EG" : "en-US"); // Arabic for "ar", fallback to English
        return formatter.format(number);
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
     
          if(response && response.data) {
            setData(response.data)
            console.log('data', response.data)

          } else {
                console.log(response) 
                router.push('/404')
            }

        } catch (error) {
          console.error("Error fetching data:", error);
        }
        setLoading(false);
       };
    


useEffect(() => {    
    const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/staff/project_flow_template/${id}/get_full_flow/`
    fetchData(url)
}, [ reloadFlag ]);


    return (



        <div  className="container-fluid overflow-hidden w-100 p-0 m-0" > 
            <div className="app-content-header ">
    

    
            </div>
    
            <div className="app-content  bg-white    pt-4 ">
    
    
            
            <div className="   mt-2  ">
                <h6> <Link href='/staff/projectFlow/projectFlowTemplate/'>
                {t('mini_nav.Project_Flow_Template')}
                </Link>   - {t('mini_nav.Template_Details')} </h6>
                <hr />
            </div>


        <div className="   ">


 

        <div className=" col-11  border-bottom border-2   my-2  ">
            <h3 className="text-break mx-2 " dir="auto">{data?.template_name} </h3>
        </div>

        <div className="row d-flex justify-content-between">


            <div className="col-lg-4 col-md-10 d-lg-none d-block    ">
                <div className="dropdown ">
                    <div className="container  ">

                <button
                    className="d-block d-lg-none border-0   border-bottom collapse btn  "
                    id="toggleButton"
                    data-bs-toggle="collapse"
                    data-bs-target="#collapseExample"
                    aria-expanded="false"
                    aria-controls="collapseExample"
                >
                    {/* Ticket Details  */}
                    <i className="bi bi-caret-down ms-2 me-2" />
                    {t('detail')} 
                    
                </button>



                    <hr className="d-block" />
                    <div
                        id="collapseExample"
                        className="card collapse  toggle-content mt-3 "
                    >


                        <div className="card-body">


                            <div className="p-1 row col-12 ">
                                <div className="col-6  text-muted">
                                    
                                    {t('Template_ID')}
                                </div>
                                <div className="col-6">
                                    #{ formatNumber(data?.id)  }
                                </div>
                            </div>



                            <div className="p-1 row col-12 ">
                                <div className="col-6  text-muted">
                                    {t('Template_Name')} 
                                </div>
                                <div className="col-6">
                                    { data?.template_name }
                                </div>
                            </div>


                            <div className="p-1 row col-12 ">
                                <div className="col-6  text-muted">
                                    {t('Steps_Process_Strategy')} 
                                </div>
                                <div className="col-6">
                                    {   getStepsProcessStrategy(data?.default_start_process_step_or_sub_step_strategy)  }
                                </div>
                            </div>

                            <div className="p-1 row col-12 ">
                                <div className="col-6  text-muted">
                                    {/* Manual Start Mode */}
                                     {t('Manual_Start_Mode')}  
                                </div>
                                <div className="col-6">
                                    { getManualStartMode(data?.manual_start_mode)  }
                                </div>
                            </div>



                            <div className="p-1 row col-12 ">
                                <div className="col-6  text-muted">
                                    {/* Auto Start First Step  */}
                                     {t('Auto_Start_First_Step')}
                                </div>
                                <div className="col-6">
                                    { getTrueFalseLabel(data?.auto_start_first_step_after_clone)     }
                                </div>
                            </div>


                            <div className="p-1 row col-12 ">
                                <div className="col-6  text-muted">
                                    {/* Show Steps To Client */}
                                     {t('Show_Steps_To_Client')} 
                                </div>
                                <div className="col-6">
                                    { getTrueFalseLabel(data?.show_steps_to_client)    }
                                </div>
                            </div>


                            <div className="p-1 row col-12 ">
                                <div className="col-6  text-muted">
                                    {/* Show Step Status Logs To Client  */}
                                     {t('Show_Step_Status_Logs_To_Client')}
                                </div>
                                <div className="col-6">
                                    {getTrueFalseLabel( data?.show_steps_or_sub_steps_status_log_to_client)    }
                                </div>
                            </div>



                            <Link

                                href={`/staff/projectFlow/projectFlowTemplate/step/${data?.id}/add_new_step`}
                                
                                className="text-success mx-2"
                                title= {t('Add_New_Step')}>
                                <i className="bi   bi-plus-circle-fill"></i> 
                            </Link>

                            <Link 
                                href={`/staff/projectFlow/projectFlowTemplate/edit_template/${data?.id}`}

                                className="text-primary mx-2" title={t('Edit')}><i className="bi bi-pencil-fill"></i>
                            </Link> 


                            <Link href=""
                                onClick={(e) => {
                                        e.preventDefault()
                                        setIsModalOpen(true) 
                                    } 
                                }
                                className="text-danger mx-2" title={t('Delete')}><i className="bi bi-trash-fill"></i>
                            </Link>


                        </div>







                    </div>
                    </div>
                </div>
            </div>


            <div className="col-lg-7  ">
                {/* start template body   */}
                    

                <Timeline data={data} reloadComponentMethod={reloadComponentMethod} />


                {/* end template body */}
            </div>




            <div className="col-lg-5  ">
                <div className="card   d-lg-block d-none">

                    <div className="card-body">


                        <div className="p-1 row col-12 ">
                            <div className="col-6  text-muted">
                                {t('Template_ID')} 
                            </div>
                            <div className="col-6">
                                #{ formatNumber(data?.id)  }
                            </div>
                        </div>



                        <div className="p-1 row col-12 ">
                            <div className="col-6  text-muted">
                                {t('Template_Name')} 
                            </div>
                            <div className="col-6">
                                { data?.template_name }
                            </div>
                        </div>


                        <div className="p-1 row col-12 ">
                            <div className="col-6  text-muted">
                                {t('Steps_Process_Strategy')} 
                            </div>
                            <div className="col-6">
                                {   getStepsProcessStrategy(data?.default_start_process_step_or_sub_step_strategy)  }
                            </div>
                        </div>
 
                        <div className="p-1 row col-12 ">
                            <div className="col-6  text-muted">
                                 {t('Manual_Start_Mode')} 
                            </div>
                            <div className="col-6">
                                { getManualStartMode(data?.manual_start_mode)  }
                            </div>
                        </div>



                        <div className="p-1 row col-12 ">
                            <div className="col-6  text-muted">
                                {t('Auto_Start_First_Step')}
                            </div>
                            <div className="col-6">
                                { getTrueFalseLabel(data?.auto_start_first_step_after_clone)     }
                            </div>
                        </div>

 
                        <div className="p-1 row col-12 ">
                            <div className="col-6  text-muted">
                                {t('Show_Steps_To_Client')} 
                            </div>
                            <div className="col-6">
                                    { getTrueFalseLabel(data?.show_steps_to_client)    }
                            </div>
                        </div>


                        <div className="p-1 row col-12 ">
                            <div className="col-6  text-muted">
                                 {t('Show_Step_Status_Logs_To_Client')} 
                            </div>
                            <div className="col-6">
                                    {getTrueFalseLabel( data?.show_steps_or_sub_steps_status_log_to_client)    }
                            </div>
                        </div>

 

                        <Link

                            href={`/staff/projectFlow/projectFlowTemplate/step/${data?.id}/add_new_step`}
                            
                            className="text-success mx-2"
                             title= {t('Add_New_Step')}>
                            <i className="bi   bi-plus-circle-fill"></i> 
                        </Link>

                        <Link 
                            href={`/staff/projectFlow/projectFlowTemplate/edit_template/${data?.id}`}
                        
                            className="text-primary mx-2" title={t('Edit')}><i className="bi bi-pencil-fill"></i>
                        </Link> 


                        <Link href=""
                            onClick={(e) => {
                                    e.preventDefault()
                                    setIsModalOpen(true) 
                                } 
                            }
                            className="text-danger mx-2" title={t('Delete')}><i className="bi bi-trash-fill"></i>
                        </Link>
 

                    </div>



                </div>

                <hr />

                
                <ProjectFlowNotes notes={data?.notes || []} project_id={data?.id} />

            </div>










        </div>
        </div>
     
    






    
            </div>


    <CustomModal  
        id="delete_template_id"
        handleSubmit={handleDelete}
 
        submitting={deleting}
        message={t('modal_msg')}
        showModal={true} 
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}

    /> 








          </div>


 
    )
}


export default Page