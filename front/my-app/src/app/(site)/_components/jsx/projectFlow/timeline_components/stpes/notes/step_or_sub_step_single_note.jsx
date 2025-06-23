

 
import { parseISO, format } from "date-fns";

import { useLocale } from "next-intl"; // Get the current locale from next-intl
import { ar, enUS } from "date-fns/locale"; // Import necessary locales

  

export const  StepOrSubStepSingleNote = ({note={}}) => {

    const locale = useLocale(); // Get the current locale



    const currentLocale = locale === "ar" ? ar : enUS;





    const formatDate = (dateString) => {
   
        if (dateString) {
            return format(parseISO(dateString), 'dd MMM yyyy - h:mm a', { locale: currentLocale });
        }
    };
 


    return(

            <div className="note mb-2 p-2 border rounded">
                <div className="note-header d-flex justify-content-between  small text-muted  ">







                    <span>{note?.step_note_user?.full_name}</span> 

                    <span>{formatDate(note?.created_date || '')}</span> 
                </div>

                <p className="  small">{note?.note}</p>
     

                <div className="attachments  ">
                    <ul className="list-unstyled small">
                         {note?.files?.map((file) => 
                            <li key={`note_${file.created_data}_${file.id}`} className="d-flex align-items-center">
                                <i className="bi bi-file-earmark" style={{ marginRight: '5px' }}></i>
                                <a href={file?.file || ''} target="_blank" rel="noopener noreferrer" className="text-muted">
                                    {file.file_name}
                                </a>
                            </li>
                        )}
                    </ul>
                </div>


            </div>
    
 
    )
}

