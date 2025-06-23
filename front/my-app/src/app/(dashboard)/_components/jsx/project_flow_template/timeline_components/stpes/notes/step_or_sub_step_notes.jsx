

 
import { parseISO, format } from "date-fns";

import { useLocale, useTranslations } from "next-intl"; // Get the current locale from next-intl
import { ar, enUS } from "date-fns/locale"; // Import necessary locales

import { StepOrSubStepSingleNote } from "./step_or_sub_step_single_note";
import { AddNewNote } from "./add_note";
import { useRef, useState, useEffect } from "react";

import { useCustomFetchMutation } from "@/app/(dashboard)/_components/redux_staff/features/authApiSlice";



export const  StepOrSubStepNotes = ({notes=[], notes_for="step", step_or_step_id=null, can_add_note=false}) => {
    const [noteList, setNoteList] = useState(notes)
    const t = useTranslations('dashboard.projectFlow.notes')


    const locale = useLocale(); 

    const currentLocale = locale === "ar" ? ar : enUS;
    const  isFirstRender = useRef(true)
    const [reloadComponentFlag, setReloadComponentFlag] = useState(false)
 
    const url = notes_for === "step" 
        ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/staff/project_flow_template/steps_template/${step_or_step_id}/steps_template_note/`
        : `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/staff/project_flow_template/sub_steps/${step_or_step_id}/sub_step_note/` 

 
    const handleReloadFlag = () => {
        setReloadComponentFlag(!reloadComponentFlag)
    }

    const [customFetch] = useCustomFetchMutation();

    const fetchData = async (pageUrl) => {
 
        try {
          const response = await customFetch({
            url: pageUrl,
            method: 'GET', // Only use 'GET' for fetching data
            headers: {
              'Content-Type': 'application/json',
            }, 
          });
     
          setNoteList(response.data)
        } catch (error) {
          console.error("Error fetching data:", error);
        }
        finally{ }

      };

 


useEffect(() => {
    setNoteList(notes)

}, [notes]);


useEffect(() => {
    if (isFirstRender.current) {
        isFirstRender.current = false; // Mark as rendered
        return; // Prevent first execution
    }
 

    fetchData(url);

}, [reloadComponentFlag]);




    return(

 
    <div className=" container-fluid   p-0 ">

 
        <div className="notes-container mt-3 ">
        <h6 className="fw-bold fs-6">{t('notes_title')}</h6>

        {noteList?.length > 0 ?  
            noteList.map((note) => <StepOrSubStepSingleNote note_for={notes_for} handleReloadFlag={handleReloadFlag}   key={`step_note_${note.id}`} note={note} />) :  

            <div className="small text-muted fst-italic">{t('no_notes_available')}</div>
        }
 
        {can_add_note &&
          <AddNewNote
            note_for={notes_for}
            step_or_step_id={step_or_step_id}
            handleReloadFlag={handleReloadFlag}
          />

        }
        
        </div>
    </div> 
 
 
    )
}

