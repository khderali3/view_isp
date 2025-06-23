


 
import { parseISO, format } from "date-fns";

import { ar, enUS } from "date-fns/locale"; // Import necessary locales


import { useLocale } from "next-intl";



export const ChangeStatusLogs = ({log={}}) =>{
    const locale = useLocale(); // Get the current locale
    const currentLocale = locale === "ar" ? ar : enUS;
    const formatDate = (dateString) => {
           if (dateString) {
            return format(parseISO(dateString), 'dd MMM yyyy - h:mm a', { locale: currentLocale });
        }
    };
 
    return (

            <div  className="list-group-item text-muted p-1">
                <span className="fw-bold">{formatDate(log.timestamp) }</span> - {log.user && log.user.full_name} changed status from 
                <span className="text-dark mx-1">"{log.previous_status}"</span> 
                to <span className="text-dark">"{log.new_status}"</span>.
            </div>
      
    )
}

