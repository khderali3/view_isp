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


const Page = () => {
    const t = useTranslations('site.ticket')
    const t_common = useTranslations('common')

    const locale = useLocale(); // Get the current locale



    const currentLocale = locale === "ar" ? ar : enUS;



    const formatDate = (dateString) => {
   
        if (dateString) {
            return format(parseISO(dateString), 'dd MMM yyyy - h:mm a', { locale: currentLocale });
        }
    };
 

 
   
      const formatNumber = (number) => {
        const formatter = new Intl.NumberFormat(locale === "ar" ? "ar-EG" : "en-US"); // Arabic for "ar", fallback to English
        return formatter.format(number);
      };




    const {ticket_slug} = useParams()
    

    const [ticketDetails, setTcketDetails] = useState({})
    const [loading, setLoading] = useState(true); // Loading state
    const [customFetch] = useCustomFetchMutation();
 
    const [reloadFlag , setReloadFlag] = useState(false)

    const reloadComponentMethod = () => {
      setReloadFlag((prev) => !prev); // Toggle state to trigger a reload
    };

    const [canReply, setCanReply] = useState(false)


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
     
          setTcketDetails(response.data)

        } catch (error) {
          console.error("Error fetching data:", error);
        }
        finally{
            setLoading(false);
         }

      };
    



useEffect(() => {    

if(   

    (!ticketDetails?.ticket_closed_by)
    ) {
    setCanReply(true)
    } else { setCanReply(false)}

}, [  ticketDetails ]);


useEffect(() => {    
    const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/ticket/${ticket_slug}/`
    fetchData(url)
}, [  reloadFlag ]);


 
    return (

        
 
<div> 
        <div className="container mt-2">
            <h6> 
                <Link href='/tickets'> 
                    {/* Tickets  */}
                    {t('mini_nav.tickets')}

                </Link>
                   {/* - Tecket Details  */}
                   - {t('mini_nav.ticket_details')}
            </h6>
            <hr />
        </div>

 

    <div className="container "  >

    <div className=" col-11  border-bottom border-2   my-2   "    >
        <h3 className="text-break mx-2   " dir="auto" >{ticketDetails?.ticket_subject} </h3>
    </div>


    <div className="row d-flex justify-content-between">


        <div className="col-lg-4 col-md-10 d-lg-none d-block   ">
        <div className="dropdown ">
            <div className="container mt-2">

            <button
                className="d-block d-lg-none border-0   border-bottom collapse btn  "
                dir="auto"
                id="toggleButton"
                data-bs-toggle="collapse"
                data-bs-target="#collapseExample"
                aria-expanded="false"
                aria-controls="collapseExample"
            >
                 {/* Ticket Details  */}
                 <i className="fa-solid fa-caret-down fs-3 ms-2 me-2" />

                 {t('ticket_details_msgs.ticket_details_btn')}  
                 {/* {t('mini_nav.ticket_details')} */}
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
                            {t_common('ticket_card.requester')} 
                        </div>
                        <div className="col-6">
                            {ticketDetails?.ticket_created_by?.fullname}
                        </div>
                    </div>


                    <div className="p-1 row col-12">
                        <div className="col-6  text-muted">
                            {t_common('ticket_card.created')} 
                        </div>
                        <div className="col-6">
                            {formatDate( ticketDetails?.ticket_created_date)}
                        </div> 
                    </div>

                    <div className="p-1 row col-12 ">
                        <div className="col-6  text-muted">
                            {t_common('ticket_card.latest_activity')} 
                        </div>
                        <div className="col-6">
                            {formatDate( ticketDetails?.ticket_latest_activity)}
                        </div>
                    </div>
                    <hr />
                    <div className="p-1 row col-12 ">
                        <div className="col-6  text-muted">
                            {t_common('ticket_card.assigned_to')} 
                        </div>
                        <div className="col-6">
                            {ticketDetails?.ticket_assigned_to ? ticketDetails?.ticket_assigned_to?.fullname : t_common('ticket_card.pending')}
                        </div>
                    </div>


                    <div className="p-1 row col-12">

                        <div className="col-6  text-muted">
                            {t_common('ticket_card.id')}
                        </div>
                        <div className="col-6">
                            #{ formatNumber(ticketDetails?.id) }
                        </div>
                    </div>

                    <div className="p-1 row col-12">
                        <div className="col-6  text-muted">
                            {t_common('ticket_card.status')}
                        </div>
                        <div className="col-6">
                            <p className={`p-0 m-0 text-light badge  p-1  ${getTicketStatusColor(ticketDetails?.ticket_status)}`}  >
                                { ticketDetails?.ticket_status && t_common(`ticket_status.${ticketDetails.ticket_status}`) }
                            </p>
                        </div>
                    </div>


                    <hr />
                    <div className="p-1 row col-12">
                        <div className="col-6  text-muted">
                            {t_common('ticket_card.department')}
                        </div>
                        <div className="col-6">
                            
                            { locale === "ar" ?  ticketDetails?.ticket_department?.department_name_ar
                                    :   ticketDetails?.ticket_department?.department_name}
                        </div>
                    </div>



                    <div className="p-1 row col-12">
                        <div className="col-6  text-muted">
                            {t_common('ticket_card.priority_support')}
                        </div>
                        <div className="col-6">
                            
                            {ticketDetails?.ticket_pr_support ? t_common('yes') : t_common('no')}
                        </div>
        
                    </div>

                    
                    <hr />
                    <div className="d-flex justify-content-between position-relative p-1">

                        { ticketDetails?.ticket_closed_by ?     

                            <ReOpenTicketButton ticket_id={ticketDetails?.id} reloadComponentMethod={reloadComponentMethod}  customflag={'10'} />
    
                                : 

                            <CloseTicketButton ticket_id={ticketDetails?.id} reloadComponentMethod={reloadComponentMethod} customflag={'10'}/>  

                        } 

    

                    </div>
                
                </div> 

            </div>
            </div>

            
        </div>
        </div>


        <div className="col-lg-8 ">

   
        <div className="ticket-prof   mt-3 mb">


            <div className=" d-flex  align-items-center mb-5">

                <img

                src={ticketDetails?.ticket_user?.PRF_image ? ticketDetails.ticket_user.PRF_image : "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBwgHBgkIBwgKCgkLDRYPDQwMDRsUFRAWIB0iIiAdHx8kKDQsJCYxJx8fLT0tMTU3Ojo6Iys/RD84QzQ5OjcBCgoKDQwNGg8PGjclHyU3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3N//AABEIAJQAswMBIgACEQEDEQH/xAAaAAEAAwEBAQAAAAAAAAAAAAAAAQIDBAUH/8QALBABAAICAAUDAgUFAAAAAAAAAAECAxEEEjFBUSEycZGhEyJSYbEUIzNCgf/EABUBAQEAAAAAAAAAAAAAAAAAAAAB/8QAFBEBAAAAAAAAAAAAAAAAAAAAAP/aAAwDAQACEQMRAD8A+4gAAAAAAAAiZ13BIrzx5OevkFhEWiZ9JhIAAAAAAAAAAAAAAAAClrxHyre+/SOigLTaZ+PCoAAAJiZjogBpGTtZeJjswTW01BuIrMTHokAAAAAAAAAABlktv0jovedV/diAAACJmIjczqPIJGFuKpHtibfZEcVH6J+oOgUx5KXj8s7nvC4AAJrPLO20TtgvjtqdA1AAAAAAAABEzqJBled2VAAAETOomZ6Q4cuT8S2+3aHTxVtY4iO8uMABUTE6ncdXbhy/iV9fdHVwtuFtrLEdpRXYAAADes7hLPHPZoAAAAAAArf2yspk9sgyAAABz8X7K/LldvE158Xp2nbiUABBpg/y1+Wbbha82XfgHYAigAL4vdLVjj9zYAAAAAABW3SVgHOExqdAAADjz4ZrO6xM1/h2Im0R1mI+ZB5w7bUw268v/JRGLDHj6g5aUm86rDux0jHXlj6kTSI1E1j4lYAAAAF8XWWqmONVXAAAAAAAABnkjuzbzG40xtHLOgQplyRjruevaPK8zqJmekPPyXnJabSC2TNfJ1nUeIZgqGjQAajwmtppO6zqUAOvDxHPPLedW7T5bvNdvD358fr1j0RWqaxM2iOyGuOuo35BcAAAAAAAAABW1eaFgHHxO64rbcL18uOuWvLbo87Nw98XrPrXzCjEOwIAAAAN+En+5MeYZY6WyW1SJl38NwsYvzWndv4BpSneerUEUAAAAAAAAAAAAABhl4XFkneuW3mGF+Bt/peJ+YdwDzP6TN4ifiSOEzfp+70wHnV4LJPWax92+Pgsce+Zs6gEVrFY1WIiP2SAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP//Z"}

                width="40" height="40" 
                className="  rounded-circle me-2"
                />


                <div className="d-flex flex-column justify-content-center ">
                    <h6 className="m-0 fs-6 text-muted">{ticketDetails?.ticket_user?.fullname}

                    {ticketDetails?.ticket_user?.is_staff &&  <span className="badge bg-light text-dark ms-2"> {t_common('staff')} </span> }

                    </h6>
                    <p className="m-0 text-muted"> {formatDate( ticketDetails?.ticket_created_date)  }</p> 
                </div>


            </div>





            <div className="ticket-details-text" dir="auto" >
             {ticketDetails?.ticket_body}

                <div className=" pt-3 mt-3 ">
                    {ticketDetails?.ticket_files?.map(file => {

                        return(
                            <div key={file.id} className=" m-0 p-0 ">
                                <Link href={file.ticket_file_ticket_file} className="  m-0 p-0" target="_blank">
                                    <i className="fa fa-file me-2"></i> {file.ticket_file_name}
                                </Link>
                            </div>
                            
                        )
                    })}
                </div>

            </div>
            <hr   />
        </div>


        {ticketDetails?.ticket_replies?.map(  replied => {

            return( 
                <div key={replied.id} >
                
                <div  className="  ">

                <div className="  d-flex  align-items-center mb-5">
                    <img
                    src={replied?.ticket_replay_from?.PRF_image ? replied.ticket_replay_from.PRF_image : "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBwgHBgkIBwgKCgkLDRYPDQwMDRsUFRAWIB0iIiAdHx8kKDQsJCYxJx8fLT0tMTU3Ojo6Iys/RD84QzQ5OjcBCgoKDQwNGg8PGjclHyU3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3N//AABEIAJQAswMBIgACEQEDEQH/xAAaAAEAAwEBAQAAAAAAAAAAAAAAAQIDBAUH/8QALBABAAICAAUDAgUFAAAAAAAAAAECAxEEEjFBUSEycZGhEyJSYbEUIzNCgf/EABUBAQEAAAAAAAAAAAAAAAAAAAAB/8QAFBEBAAAAAAAAAAAAAAAAAAAAAP/aAAwDAQACEQMRAD8A+4gAAAAAAAAiZ13BIrzx5OevkFhEWiZ9JhIAAAAAAAAAAAAAAAAClrxHyre+/SOigLTaZ+PCoAAAJiZjogBpGTtZeJjswTW01BuIrMTHokAAAAAAAAAABlktv0jovedV/diAAACJmIjczqPIJGFuKpHtibfZEcVH6J+oOgUx5KXj8s7nvC4AAJrPLO20TtgvjtqdA1AAAAAAAABEzqJBled2VAAAETOomZ6Q4cuT8S2+3aHTxVtY4iO8uMABUTE6ncdXbhy/iV9fdHVwtuFtrLEdpRXYAAADes7hLPHPZoAAAAAAArf2yspk9sgyAAABz8X7K/LldvE158Xp2nbiUABBpg/y1+Wbbha82XfgHYAigAL4vdLVjj9zYAAAAAABW3SVgHOExqdAAADjz4ZrO6xM1/h2Im0R1mI+ZB5w7bUw268v/JRGLDHj6g5aUm86rDux0jHXlj6kTSI1E1j4lYAAAAF8XWWqmONVXAAAAAAAABnkjuzbzG40xtHLOgQplyRjruevaPK8zqJmekPPyXnJabSC2TNfJ1nUeIZgqGjQAajwmtppO6zqUAOvDxHPPLedW7T5bvNdvD358fr1j0RWqaxM2iOyGuOuo35BcAAAAAAAAABW1eaFgHHxO64rbcL18uOuWvLbo87Nw98XrPrXzCjEOwIAAAAN+En+5MeYZY6WyW1SJl38NwsYvzWndv4BpSneerUEUAAAAAAAAAAAAABhl4XFkneuW3mGF+Bt/peJ+YdwDzP6TN4ifiSOEzfp+70wHnV4LJPWax92+Pgsce+Zs6gEVrFY1WIiP2SAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP//Z"}

                    width="40" height="40" 
                    className="  rounded-circle me-2"

                    />
                    <div className="d-flex flex-column justify-content-center">
                        <h4 className="m-0 fs-6 text-muted">{replied?.ticket_replay_from?.fullname}  
                            {replied?.ticket_replay_from?.is_staff &&  <span className="badge bg-light text-dark ms-2">{t_common('staff')}</span> }
                            
                        
                        </h4>
                        

                        <p className="m-0 text-muted">{formatDate(replied?.ticket_replay_created_date)}</p>
                    </div>

                </div>


                <div dir="auto" className="ticket-details-text" style={{ whiteSpace: 'pre-line' }}>

                    {replied?.ticket_replay_body}





                    <div className=" pt-3 mt-3 ">
                        {replied?.ticket_reply_files?.map(file => {

                        return(
                            <div key={file.id} className=" m-0 p-0 ">
                                <Link href={file.ticket_replay_file} className="  m-0 p-0" target="_blank">
                                <i className="fa fa-file me-2"></i> {file.ticket_replay_file_name}
                                </Link>
                            </div>

                        )
                        })}
                    </div>




                
                </div>
                <hr />
                </div>
                </div>
 
 
            )



        }  )}




        {/* <AddNewReplayForm  ticket_id={ticketDetails?.id} handleReplayAdded={reloadComponentMethod}/> */}



        { canReply ? 
                <AddNewReplayForm  ticket_id={ticketDetails?.id} handleReplayAdded={reloadComponentMethod}/>
                :
                <div className="mt-5 text-center"> 
                    <p className="text-info"> 
                        {locale === "ar"   
                            ? "لا تستطيع الرد على هذه التذكرة لأنها مغلفة" 
                            : "you can't reply to this ticket because it is closed." 
                        }
                    </p>
                </div>
            } 








        </div>




        <div className="col-md-4  d-md-block d-none">
 
        <div className="card">
 





{/* new  */}



            <div className="card-body  "     >

 



            <div className="p-1 row col-12 ">
                <div className="col-6  text-muted">
                    {t_common('ticket_card.requester')} 
                </div>
                <div className="col-6">
                    {ticketDetails?.ticket_created_by?.fullname}
                </div>
            </div>



            <div className="p-1 row col-12">
                <div className="col-6  text-muted">
                    {t_common('ticket_card.created')} 
                </div>
                <div className="col-6">
                    {formatDate( ticketDetails?.ticket_created_date)}
                </div> 
            </div>

            <div className="p-1 row col-12 ">
                <div className="col-6  text-muted">
                    {t_common('ticket_card.latest_activity')} 
                </div>
                <div className="col-6">
                    {formatDate( ticketDetails?.ticket_latest_activity)}
                </div>
            </div>
            <hr />

            <div className="p-1 row col-12 ">
                <div className="col-6  text-muted">
                    {t_common('ticket_card.assigned_to')} 
                </div>
                <div className="col-6">
                    {ticketDetails?.ticket_assigned_to ? ticketDetails?.ticket_assigned_to?.fullname : t_common('ticket_card.pending')}
                </div>
            </div>



            <div className="p-1 row col-12">

                <div className="col-6  text-muted">
                    {t_common('ticket_card.id')}
                </div>
                <div className="col-6">
                    #{ formatNumber(ticketDetails?.id) }
                </div>
            </div>

            <div className="p-1 row col-12">
                <div className="col-6  text-muted">
                    {t_common('ticket_card.status')}
                </div>
                <div className="col-6">

                    <p className={`p-0 m-0 text-light badge  p-1  ${getTicketStatusColor(ticketDetails?.ticket_status)}`}  >
                         { ticketDetails?.ticket_status && t_common(`ticket_status.${ticketDetails.ticket_status}`) }
                    </p>
                    
                </div>

 
            </div>
            <hr />

            <div className="p-1 row col-12">
                <div className="col-6  text-muted">
                    {t_common('ticket_card.department')}
                </div>
                <div className="col-6">
                    
                    { locale === "ar" ?  ticketDetails?.ticket_department?.department_name_ar
                            :   ticketDetails?.ticket_department?.department_name}
                </div>
 
            </div>




            <div className="p-1 row col-12">
                <div className="col-6  text-muted">
                    {t_common('ticket_card.priority_support')}
                </div>
                <div className="col-6">
                    
                    {ticketDetails?.ticket_pr_support ? t_common('yes') : t_common('no')}
                </div>
 
            </div>

            <hr />
            <div className="d-flex justify-content-between position-relative p-1">


                { ticketDetails?.ticket_closed_by ?     

                    <ReOpenTicketButton ticket_id={ticketDetails?.id} reloadComponentMethod={reloadComponentMethod}  customflag={'11'} />

                        : 

                    <CloseTicketButton ticket_id={ticketDetails?.id} reloadComponentMethod={reloadComponentMethod} customflag={'11'}/>  

                } 


            


            </div>

            </div> 









{/* end new */}





            
        </div>
        </div>
    </div>
    </div>
    {/* End Ticket Details */}
</div>
 


 

 
    )
}


export default Page