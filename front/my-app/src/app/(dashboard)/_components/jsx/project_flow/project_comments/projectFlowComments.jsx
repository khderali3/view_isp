
"use client"

import { useState, useEffect, useRef } from "react"

import { useTranslations, useLocale } from "next-intl";
import { ar, enUS } from "date-fns/locale"; // Import necessary locales
import { parseISO, format } from "date-fns";

import Link from "next/link";
 
import { AddNewComment } from "./add_Comment";

import { useCustomFetchMutation } from "@/app/(site)/_components/redux/features/siteApiSlice";


import { toast } from "react-toastify";
import { getErrorMessage } from "@/app/public_utils/utils";
import CustomModal from "@/app/(dashboard)/_components/jsx/myModal";

import { useSelector } from "react-redux";



export const ProjectFlowNotes = ({notes=[], project_status='',  project_id}) => {

    const t_common = useTranslations('common')
    const t = useTranslations('dashboard.projectFlow.projectflow.projectflow_notes')

   const [data, setData] = useState(notes)
   const [customFetch] = useCustomFetchMutation();


    const locale = useLocale(); // Get the current locale
    const isFirstRender = useRef(true); // Track first render



    const currentLocale = locale === "ar" ? ar : enUS;


    const [reloadComponentFlag, setReloadComponentFlag] = useState(false)




    const [isModalOpen, setIsModalOpen] = useState(false);
    const [objToDelete, setObjToDelete ] = useState(null)
    const [deleting, setDeleting] = useState(false)


    const { permissions, is_superuser, is_staff  } = useSelector(state => state.staff_auth);


    const hasPermissionToDeleteProjectNote = () => {
        if (is_superuser || (permissions?.includes('usersAuthApp.projectflow_note_delete') && is_staff)) {
            return true
        }
          return false
    }







    const handleDelete = async ( ) => {
      setDeleting(true)
       try {   
         const response = await customFetch({
          url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/staff/projectflow/projectflow/${project_id}/note/${objToDelete}/`,
         
          method: "DELETE",
         });  
         if (response && response.data) {
            setReloadComponentFlag(!reloadComponentFlag)
            if(locale === 'ar'){
                toast.success('تم حذف العنصر بنجاح')
            } else {
                toast.success('the item has been deleted')
            }
 
         } else {
           toast.error(getErrorMessage(response?.error?.data))
   
         }
       } catch (error) {
         toast.error(getErrorMessage(error.data || error.message) || "Something went wrong");
       } finally{
            setDeleting(false)
            setObjToDelete(null)
        }
     };





    const handleReloadComponent = () => {
        setReloadComponentFlag(!reloadComponentFlag)
    }


    const formatDate = (dateString) => {
   
        if (dateString) {
            return format(parseISO(dateString), 'dd MMM yyyy - h:mm a', { locale: currentLocale });
        }
    };



    const fetchData = async (pageUrl) => {
 
        try {
          const response = await customFetch({
            url: pageUrl,
            method: 'GET', // Only use 'GET' for fetching data
            headers: {
              'Content-Type': 'application/json',
            }, 
          });
     
          setData(response.data)
 
        } catch (error) {
          console.error("Error fetching data:", error);
        }
        finally{ }

      };



useEffect(() => {
    if (isFirstRender.current) {
        isFirstRender.current = false; // Mark as rendered
        return; // Prevent first execution
    }
    const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/staff/projectflow/projectflow/${project_id}/note/`

    fetchData(url);

}, [reloadComponentFlag]);


useEffect( () =>{
 
    setData(notes);
}, [notes] )



    return(
       
        
        <div className="container-fluid"> 
            <div>
                <h4>{t('title')}</h4>
                <hr />
            </div>

            <div>
                {data?.map(  note => {
                    return( 
                        <div key={note.id} >
                        
                        <div  className="  ">

                        <div className="  d-flex  align-items-center mb-1">
                            <img
                            src={note?.created_user?.PRF_image ? note.created_user.PRF_image: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBwgHBgkIBwgKCgkLDRYPDQwMDRsUFRAWIB0iIiAdHx8kKDQsJCYxJx8fLT0tMTU3Ojo6Iys/RD84QzQ5OjcBCgoKDQwNGg8PGjclHyU3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3N//AABEIAJQAswMBIgACEQEDEQH/xAAaAAEAAwEBAQAAAAAAAAAAAAAAAQIDBAUH/8QALBABAAICAAUDAgUFAAAAAAAAAAECAxEEEjFBUSEycZGhEyJSYbEUIzNCgf/EABUBAQEAAAAAAAAAAAAAAAAAAAAB/8QAFBEBAAAAAAAAAAAAAAAAAAAAAP/aAAwDAQACEQMRAD8A+4gAAAAAAAAiZ13BIrzx5OevkFhEWiZ9JhIAAAAAAAAAAAAAAAAClrxHyre+/SOigLTaZ+PCoAAAJiZjogBpGTtZeJjswTW01BuIrMTHokAAAAAAAAAABlktv0jovedV/diAAACJmIjczqPIJGFuKpHtibfZEcVH6J+oOgUx5KXj8s7nvC4AAJrPLO20TtgvjtqdA1AAAAAAAABEzqJBled2VAAAETOomZ6Q4cuT8S2+3aHTxVtY4iO8uMABUTE6ncdXbhy/iV9fdHVwtuFtrLEdpRXYAAADes7hLPHPZoAAAAAAArf2yspk9sgyAAABz8X7K/LldvE158Xp2nbiUABBpg/y1+Wbbha82XfgHYAigAL4vdLVjj9zYAAAAAABW3SVgHOExqdAAADjz4ZrO6xM1/h2Im0R1mI+ZB5w7bUw268v/JRGLDHj6g5aUm86rDux0jHXlj6kTSI1E1j4lYAAAAF8XWWqmONVXAAAAAAAABnkjuzbzG40xtHLOgQplyRjruevaPK8zqJmekPPyXnJabSC2TNfJ1nUeIZgqGjQAajwmtppO6zqUAOvDxHPPLedW7T5bvNdvD358fr1j0RWqaxM2iOyGuOuo35BcAAAAAAAAABW1eaFgHHxO64rbcL18uOuWvLbo87Nw98XrPrXzCjEOwIAAAAN+En+5MeYZY6WyW1SJl38NwsYvzWndv4BpSneerUEUAAAAAAAAAAAAABhl4XFkneuW3mGF+Bt/peJ+YdwDzP6TN4ifiSOEzfp+70wHnV4LJPWax92+Pgsce+Zs6gEVrFY1WIiP2SAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP//Z"}

                            width="40" height="40" 
                            className="  rounded-circle me-2"

                            />
                            <div className="d-flex flex-column justify-content-center">

                                {note.note_type === "cloned_from_template" ? t('auto_created_msg') : 
                                
                                    <h4 className="m-0 fs-6 text-muted">{note?.created_user?.full_name}  
                                        {note?.created_user?.is_staff &&  <span className="badge bg-light text-dark ms-2">{t_common('staff')}</span> }
                                        
                                    
                                    </h4>
                                }
                            

                                <p className="m-0 text-muted">{formatDate(note?.created_date)}</p>
                            </div>

                        </div>


                        <div dir="auto" className="ticket-details-text" style={{ whiteSpace: 'pre-line' }}>

                            {/* {note?.note === 'this projectFlow has been Closed and marked as "Canceled"' && locale === 'ar' ? "تم إلغاء هذا المشروع" : note?.note } */}

                                {(() => {
                                if (note?.note === 'this projectFlow has been Closed and marked as "Canceled"' && locale === 'ar') {
                                    return 'تم إلغاء هذا المشروع';
                                }
                                else if (note?.note === 'this projectFlow has been Re-opend' && locale === 'ar') {
                                    return 'هذا المشروع تم إعادة فتحه من جديد';
                                }
                                return note?.note;
                                })()}




                            {/* {note?.note} */}





                            <div className=" pt-1 mt-1 ">
                                {note?.files?.map(file => {

                                return(
                                    <div key={file.id} className=" m-0 p-0 ">
                                        <Link href={file.file} className="  m-0 p-0  text-break" target="_blank">
                                        <i className="fa fa-file me-2"></i> {file.file_name}
                                        </Link>
                                    </div>

                                )
                                })}
                            </div>


                            {hasPermissionToDeleteProjectNote() &&
                            
                            <div className="text-end mt-2 ">
                                    <Link href="#"
                                    onClick={(e) => {
                                        e.preventDefault()
                                        setObjToDelete(note?.id)
                                        setIsModalOpen(true)
                                    }}
                                    className="text-danger mx-2" title={t('Delete')} ><i className="bi bi-trash-fill"></i></Link>
                                </div>                            
                            
                            
                            }





                        
                        </div>
                        <hr />
                        </div>
                        </div>


                    )
                })}
            </div>


            <AddNewComment project_id={project_id} project_status={project_status}  handleReplayAdded={handleReloadComponent} />





            <CustomModal  
                id="delete_projectflow_note_id"
                handleSubmit={handleDelete}
        
                submitting={deleting}
                message={t('delete_msg')}
                showModal={true} 
                isModalOpen={isModalOpen}
                setIsModalOpen={setIsModalOpen}

            /> 



        </div>




    )

} 