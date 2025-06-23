'use client';

import { useState, useEffect } from "react"
import { useParams } from 'next/navigation'
import { useCustomFetchMutation } from "@/app/(site)/_components/redux/features/siteApiSlice";
import { parseISO, format } from "date-fns";
import getTicketStatusColor from "@/app/(site)/_components/jsx/tickets/ticket_status_colors";
import AddNewReplayForm from "@/app/(site)/_components/jsx/tickets/ticketReply/addReplay";
import Link from "next/link";

import CloseTicketButton from "@/app/(site)/_components/jsx/tickets/close_ticket/closeTicket";
import ReOpenTicketButton from "@/app/(site)/_components/jsx/tickets/reopen_ticket/reOpenTicket";

import { useTranslations } from "next-intl";
import { useLocale } from "next-intl"; // Get the current locale from next-intl
import { ar, enUS } from "date-fns/locale"; // Import necessary locales

import { ProgressCircleDetailsInfo, ProgressCircle } from "@/app/(site)/_components/jsx/projectFlow/progress";
import { ProjectFlowNotes } from "@/app/(site)/_components/jsx/projectFlow/project_comments/projectFlowComments";

import { Timeline } from "@/app/(site)/_components/jsx/projectFlow/timeline";

import { getprojectStatusBadgeColors } from "@/app/public_utils/utils";

import { ViewProductInstalledButton } from "@/app/(site)/_components/jsx/projectFlow/installed_products/view_installed_products_buttun_modal/button_view_modal";

import { useRouter } from "next/navigation";


import { useTrueFalseLabel, useStepsProcessStrategy, useManualStartMode, useProjectStatus } from "@/app/public_utils/hooks"; 


const Page = () => {


    const getProjectStatus = useProjectStatus()

    const t = useTranslations('dashboard.projectFlow.projectflow.projectflow_details')
    const t_common = useTranslations('common')

    const locale = useLocale(); // Get the current locale

    const router = useRouter()

    const currentLocale = locale === "ar" ? ar : enUS;



    const formatDate = (dateString) => {
   
        if (dateString) {
            return format(parseISO(dateString), 'dd MMM yyyy - h:mm a', { locale: currentLocale });
        }
    };
 

 
   
      const formatNumber = (number) => {
        if(number){
            const formatter = new Intl.NumberFormat(locale === "ar" ? "ar-EG" : "en-US"); // Arabic for "ar", fallback to English
            return formatter.format(number);
        }

      };




    const {project_flow_slug} = useParams()
    

    const [projectDetails, setProjectDetails] = useState({})

    const [loading, setLoading] = useState(true); // Loading state
    const [customFetch] = useCustomFetchMutation();
 
    const [reloadFlag , setReloadFlag] = useState(false)

    const reloadComponentMethod = () => {
      setReloadFlag((prev) => !prev); // Toggle state to trigger a reload
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
          if (response?.data) {
            setProjectDetails(response.data);
          } else if (response?.error?.status === 404) {
            router.push('/404');
          } else {
            console.warn("Unexpected response:", response);
          }


 
        } catch (error) {
          console.error("Error fetching data:", error);

 


        }
        finally{
            setLoading(false);
         }

      };
    


 


useEffect(() => {    
    const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/site/project_flow/${project_flow_slug}/`
    fetchData(url)
}, [  reloadFlag ]);



    if(!projectDetails){
        return
    }




 
    return (

        
 
<div> 
        <div className=" px-md-5 px-2 mt-2">
            <h6> 
                <Link href='/projectflow'> 
                    {locale === 'ar' ? 'مشاريعي' : 'ProjectFlow'} 
                    
                </Link>
                   - {t('mini_nav.projectflow_Details')}
            </h6>
            <hr />
        </div>

 

    <div className="  container-fluid overflow-hidden text-break w-100 "  >

    <div className=" col-11  border-bottom border-2   my-2   "    >
        <h3 className="text-break  " dir="auto" >{projectDetails?.project_type_name} </h3>
    </div>


    <div className="row d-flex justify-content-between">


        <div className=" col-md-10 d-md-none d-block  ">
            <div className="dropdown ">
                <div className="container mt-2">

                <button
                    className="d-block d-md-none border-0   border-bottom collapse btn  "
                    dir="auto"
                    id="toggleButton"
                    data-bs-toggle="collapse"
                    data-bs-target="#collapseExample"
                    aria-expanded="false"
                    aria-controls="collapseExample"
                >
                    {/* Ticket Details  */}
                    <i className="fa-solid fa-caret-down fs-3 ms-2 me-2" />

    
                   {t('details_btn')} 
                </button>








                <hr className="d-block" />

                {/* // ticket details on small screen  */}

                <div
                    id="collapseExample"
                    className="card collapse  toggle-content mt-3  "
                >
    
                    <div className="card-body   "     >

                        <div className="p-1 row col-12 ">
                            <div className="col-6  text-muted">
            
                                {t('Requester')}
                            </div>
                            <div className="col-6">
                                {projectDetails?.project_created_user?.full_name}
                            </div>
                        </div>

                        <div className="p-1 row col-12">
                            <div className="col-6  text-muted">
                                 {t('Created')} 
                            </div>
                            <div className="col-6">
                                {formatDate( projectDetails?.created_date)}
                            </div> 
                        </div>
                        <div className="p-1 row col-12 ">
                            <div className="col-6  text-muted">
                                {t('Latest_activity')}
                            </div>
                            <div className="col-6">
                                {formatDate( projectDetails?.latest_activity)}
                            </div>
                        </div>



                        <div className="p-1 row col-12 ">
                            <div className="col-6  text-muted">
            
                            {locale === 'ar' ? 'هاتف التواصل' : 'Contact phone'}
                            </div>
                            <div className="col-6">
                                {projectDetails?.contact_phone_no}
                            </div>
                        </div>

                        <div className="p-1 row col-12 ">
                            <div className="col-6  text-muted">
            
                            {locale === 'ar' ? 'مكان تنفيذ المشروع' : 'Project Address'}
                            </div>
                            <div className="col-6">
                                {projectDetails?.project_address}
                            </div>
                        </div>









                        <hr />

            

                        <div className="p-1 row col-12">

                            <div className="col-6  text-muted">
                               {t('projectflow_id')}
                            </div>
                            <div className="col-6">
                                #{ formatNumber(projectDetails?.id) }
                            </div>
                        </div>

                        <div className="p-1 row col-12">
                            <div className="col-6  text-muted">
                                {t('status')}
                            </div>
                            <div className="col-6">

                                <p className={`p-0 m-0    p-1  `}  >
                                    <span className={` ${getprojectStatusBadgeColors(projectDetails?.project_flow_status)}  `}>
                                         {  getProjectStatus( projectDetails?.project_flow_status) }
                                    </span>
                                </p>
                                
                            </div>

                        </div>


                        <div>
                            <ViewProductInstalledButton modal_id="productInstalledModal_site_mini"  projectflow_id={projectDetails?.id}/>
                        </div>





                        <hr />
                        <div className="p-1 row col-12 d-flex justify-content-start   align-items-center ">
                            <div className="col-6  text-muted">
                                 {t('Progress')}
                            </div>
                            <div className="col-6">

                                <ProgressCircleDetailsInfo  targetPercentage={projectDetails?.steps_completion_percentage || 0} animation_speed={100}/>
            
                            </div>

                        </div>
    
                    
                    </div> 

                </div>

    

                </div>

                
            </div>
        </div>


        <div className="col-md-7 mb-5   ">

   
        <div className="ticket-prof   mt-3  ">


            <div className=" d-flex  align-items-center mb-5">

                <img

                src={projectDetails?.project_created_user?.PRF_image ? projectDetails.project_created_user.PRF_image : "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBwgHBgkIBwgKCgkLDRYPDQwMDRsUFRAWIB0iIiAdHx8kKDQsJCYxJx8fLT0tMTU3Ojo6Iys/RD84QzQ5OjcBCgoKDQwNGg8PGjclHyU3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3N//AABEIAJQAswMBIgACEQEDEQH/xAAaAAEAAwEBAQAAAAAAAAAAAAAAAQIDBAUH/8QALBABAAICAAUDAgUFAAAAAAAAAAECAxEEEjFBUSEycZGhEyJSYbEUIzNCgf/EABUBAQEAAAAAAAAAAAAAAAAAAAAB/8QAFBEBAAAAAAAAAAAAAAAAAAAAAP/aAAwDAQACEQMRAD8A+4gAAAAAAAAiZ13BIrzx5OevkFhEWiZ9JhIAAAAAAAAAAAAAAAAClrxHyre+/SOigLTaZ+PCoAAAJiZjogBpGTtZeJjswTW01BuIrMTHokAAAAAAAAAABlktv0jovedV/diAAACJmIjczqPIJGFuKpHtibfZEcVH6J+oOgUx5KXj8s7nvC4AAJrPLO20TtgvjtqdA1AAAAAAAABEzqJBled2VAAAETOomZ6Q4cuT8S2+3aHTxVtY4iO8uMABUTE6ncdXbhy/iV9fdHVwtuFtrLEdpRXYAAADes7hLPHPZoAAAAAAArf2yspk9sgyAAABz8X7K/LldvE158Xp2nbiUABBpg/y1+Wbbha82XfgHYAigAL4vdLVjj9zYAAAAAABW3SVgHOExqdAAADjz4ZrO6xM1/h2Im0R1mI+ZB5w7bUw268v/JRGLDHj6g5aUm86rDux0jHXlj6kTSI1E1j4lYAAAAF8XWWqmONVXAAAAAAAABnkjuzbzG40xtHLOgQplyRjruevaPK8zqJmekPPyXnJabSC2TNfJ1nUeIZgqGjQAajwmtppO6zqUAOvDxHPPLedW7T5bvNdvD358fr1j0RWqaxM2iOyGuOuo35BcAAAAAAAAABW1eaFgHHxO64rbcL18uOuWvLbo87Nw98XrPrXzCjEOwIAAAAN+En+5MeYZY6WyW1SJl38NwsYvzWndv4BpSneerUEUAAAAAAAAAAAAABhl4XFkneuW3mGF+Bt/peJ+YdwDzP6TN4ifiSOEzfp+70wHnV4LJPWax92+Pgsce+Zs6gEVrFY1WIiP2SAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP//Z"}

                width="40" height="40" 
                className="  rounded-circle me-2"
                />


                <div className="d-flex flex-column justify-content-center ">
                    <h6 className="m-0 fs-6 text-muted">{projectDetails?.project_created_user?.full_name}

                    {projectDetails?.project_created_user?.is_staff &&  <span className="badge bg-light text-dark ms-2"> {t_common('staff')} </span> }

                    </h6>
                    <p className="m-0 text-muted"> {formatDate( projectDetails?.created_date)  }</p> 
                </div>


            </div>


            <div className="ticket-details-text" dir="auto" >
             {projectDetails?.details}

                <div className=" pt-3 mt-3 ">
                    {projectDetails?.files?.map(file => {

                        return(
                            <div key={file.id} className=" m-0 p-0 ">
                                <Link href={file.file} className="  m-0 p-0" target="_blank">
                                    <i className="fa fa-file me-2"></i> {file.file_name}
                                </Link>
                            </div>
                            
                        )
                    })}
                </div>

            </div>
            <hr   />
        </div>







            <Timeline data={projectDetails} reloadComponentMethod={reloadComponentMethod} />
 

            <hr />

 





        </div>




        <div className="col-md-5   px-md-2 ">
    
            <div  className="card  d-md-block d-none " >
    
                <div className="card-body  "     >

                    <div className="p-1 row col-12 ">
                        <div className="col-6  text-muted">
        
                           {t('Requester')}
                        </div>
                        <div className="col-6">
                            {projectDetails?.project_created_user?.full_name}
                        </div>
                    </div>

                    <div className="p-1 row col-12">
                        <div className="col-6  text-muted">
                             {t('Created')} 
                        </div>
                        <div className="col-6">
                            {formatDate( projectDetails?.created_date)}
                        </div> 
                    </div>
                    <div className="p-1 row col-12 ">
                        <div className="col-6  text-muted">
                            {t('Latest_activity')}
                        </div>
                        <div className="col-6">
                            {formatDate( projectDetails?.latest_activity)}
                        </div>
                    </div>



                    <div className="p-1 row col-12 ">
                        <div className="col-6  text-muted">
        
                        {locale === 'ar' ? 'هاتف التواصل' : 'Contact phone'}
                        </div>
                        <div className="col-6">
                            {projectDetails?.contact_phone_no}
                        </div>
                    </div>

                    <div className="p-1 row col-12 ">
                        <div className="col-6  text-muted">
        
                        {locale === 'ar' ? 'مكان تنفيذ المشروع' : 'Project Address'}
                        </div>
                        <div className="col-6">
                            {projectDetails?.project_address}
                        </div>
                    </div>






                    <hr />

        

                    <div className="p-1 row col-12">

                        <div className="col-6  text-muted">
                             {t('projectflow_id')}
                        </div>
                        <div className="col-6">
                            #{ formatNumber(projectDetails?.id) }
                        </div>
                    </div>

                    <div className="p-1 row col-12">
                        <div className="col-6  text-muted">
                             {t('status')}
                        </div>
                        <div className="col-6">

                            <p className={`p-0 m-0    p-1  `}  >
                                {/* { projectDetails?.project_flow_status  } */}
                                <span className={` ${getprojectStatusBadgeColors(projectDetails?.project_flow_status)}  `}>
                                    {  getProjectStatus( projectDetails?.project_flow_status) }
                                </span>

                            </p>
                            
                        </div>

                    </div>


                    <div>
                        <ViewProductInstalledButton modal_id="productInstalledModal_site_lg"  projectflow_id={projectDetails?.id}/>
                    </div>




                    <hr />
                    
                    <div className="p-1 row col-12 d-flex justify-content-start   align-items-center ">
                        <div className="col-6  text-muted">
                            {t('Progress')}
                        </div>
                        <div className="col-6">

                            <ProgressCircleDetailsInfo  targetPercentage={projectDetails?.steps_completion_percentage || 0} animation_speed={100}/>
        
                        </div>

                    </div>
    
    

                </div> 









    {/* end new */}

    
            </div>
 
            <hr />
            <ProjectFlowNotes project_status={projectDetails?.project_flow_status} notes={projectDetails?.notes || []} project_id={projectDetails?.id} />

        </div>

    </div>
    </div>
    {/* End Ticket Details */}
</div>
 


 

 
    )


 


}


export default Page