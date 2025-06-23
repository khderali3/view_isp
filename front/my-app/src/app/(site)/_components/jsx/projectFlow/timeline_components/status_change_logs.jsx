


 
import { parseISO, format } from "date-fns";

import { ar, enUS } from "date-fns/locale"; // Import necessary locales


import { useLocale, useTranslations } from "next-intl";

import {  useStepStatus } from "@/app/public_utils/hooks";


export const ChangeStatusLogs = ({log={}}) =>{
    const t = useTranslations('dashboard.projectFlow.projectflow.projectflow_step.step_status_logs')
    const getStepStatus = useStepStatus()
    
    const locale = useLocale(); // Get the current locale
    const currentLocale = locale === "ar" ? ar : enUS;
    const formatDate = (dateString) => {
           if (dateString) {
            return format(parseISO(dateString), 'dd MMM yyyy - h:mm a', { locale: currentLocale });
        }
    };
 
    return (

            <div  className="list-group-item text-muted p-1">
                <span className="fw-bold">{formatDate(log.timestamp) }</span> -  { log?.user?.full_name ?  `${log.user.full_name} ${t('user_changed_status_from')}` :  t('status_changed_from')  } 
                <span className="text-dark mx-1">"{getStepStatus(log?.previous_status)}"</span> 
                {t('to')}  <span className="text-dark">"{ getStepStatus(log?.new_status)}"</span>.
            </div>
      
    )
}

