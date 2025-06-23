'use client'

import { useLocale } from 'next-intl'

export function useFormatNumber() {
  const locale = useLocale()

  const formatNumber = (number) => {
    const formatter = new Intl.NumberFormat(locale === 'ar' ? 'ar-EG' : 'en-US');
    return formatter.format(number);
  };

  return formatNumber;
}






export function useTrueFalseLabel() {
  const locale = useLocale()

  const getTrueFalseLabel = (value) => {
    if (value) {
      return locale === 'ar' ? 'نعم' : 'Yes'
    } else {
      return locale === 'ar' ? 'لا' : 'No'
    }
  }

  return getTrueFalseLabel
}




export function useStepsProcessStrategy() {
  const locale = useLocale()

  const getStepsProcessStrategy = (value) => {
    if (value === 'manual') {
      return locale === 'ar' ? 'يدوي' : 'Manual'
    } else {
      return locale === 'ar' ? 'تلقائي' : 'Auto'
    }
  }

  return getStepsProcessStrategy
}





export function useStepOrSubStepProcessStrategy() {
  const locale = useLocale()

  const getStepOrSubStepProcessStrategy = (value) => {
    if (value === 'manual') {
      return locale === 'ar' ? 'يدوي' : 'Manual'
    } else if (value === 'auto') {
      return locale === 'ar' ? 'تلقائي' : 'Auto'
    } else if (value === 'inherit_from_project_flow'){
      return locale === 'ar' ? 'الوراثة من الإعدادات الرئيسية' : 'Inherit From projectFlow'
    }
  }

  return getStepOrSubStepProcessStrategy
}




export function useStepOrSubStepAllowedProcessBy() {
  const locale = useLocale()

  const getStepOrSubStepAllowedProcessBy = (value) => {
    if (value === 'any_staff') {
      return locale === 'ar' ? 'أي موظف في طاقم العمل' : 'Any Staff'
    } else if (value === 'specific_staff_group') {
      return locale === 'ar' ? 'مجموعات محددة من طاقم العمل' : 'Specific Staff Groups'
    } else if (value === 'client'){
      return locale === 'ar' ? 'العميل' : 'Client'
    }
  }

  return getStepOrSubStepAllowedProcessBy
}





export function useManualStartMode() {
  const locale = useLocale()

  const getManualStartMode = (value) => {
    if (value === 'serialized') {
      return locale === 'ar' ? 'تسلسلي' : 'Serialized'
    } else {
      return locale === 'ar' ? 'غير تسلسلي' : 'Non-Serialized'
    }
  }

  return getManualStartMode
}




export function useTicketStatus() {
  const locale = useLocale()

  const getTicketStatus = (value) => {

    if(value){

        if (value === 'open') {
          return locale === 'ar' ? 'مفتوحة' : 'Open'
        } else if (value === 'wait_customer_reply') {
          return locale === 'ar' ? 'بإنتظار رد العميل' : 'Wait Customer Reply'
        } else if (value === 'replied_by_staff'){
          return locale === 'ar' ?  'تم الرد من قبل فريق العمل' : 'Replied By Staff'
        }  else if (value === 'replied_by_customer'){
          return locale === 'ar' ? 'تم الرد من قبل العميل' : 'Replied By Customer'
        }  else if (value === 'solved'){
          return locale === 'ar' ? 'محلولة' : 'Solved'
        } else if(value === 'all'){
            return locale === 'ar' ? 'الكل' : 'All'
        }
        return value
    }

  }

  return getTicketStatus
}



 

 
export function useLogAction() {
  const locale = useLocale()

  const getLogAction = (value) => {

 
 

    if(value){

        if (value === 'Add') {
          return locale === 'ar' ?  ' إضافة ' : 'Add'
        } else if (value === 'Edit') {
          return locale === 'ar' ? 'تعديل' : 'Edit'
        } else if (value === 'Delete'){
          return locale === 'ar' ? 'حذف' : 'Delete'
        }  else if (value === 'Login'){
          return locale === 'ar' ? 'تسجيل الدخول' : 'Login'
        }  else if (value === 'Logout'){
          return locale === 'ar' ? 'تسجيل الخروج' : 'Logout'
        }
        return value
    }

  }

  return getLogAction
}









 
export function useProjectStatus() {
  const locale = useLocale()

  const getProjectStatus = (value) => {

    if(value){

        if (value === 'pending') {
          return locale === 'ar' ? 'قيد الإنتظار' : 'Pending'
        } else if (value === 'wait_customer_action') {
          return locale === 'ar' ? 'بإنتظار إجراء من العميل' : 'Wait Customer Action'
        } else if (value === 'in_progress'){
          return locale === 'ar' ? 'قيد العمل' : 'In Progress'
        }  else if (value === 'completed'){
          return locale === 'ar' ? 'منتهي' : 'Completed'
        }  else if (value === 'canceled'){
          return locale === 'ar' ? 'ملغى' : 'Canceled'
        } else if(value === 'all'){
            return locale === 'ar' ? 'الكل' : 'All'
        }
        return value
    }

  }

  return getProjectStatus
}





export function useStepStatus() {
  const locale = useLocale()

  const getStepStatus = (value) => {
    if(value){
        if (value === 'pending') {
          return locale === 'ar' ? 'قيد الإنتظار' : 'Pending'
        } else if (value === 'wait_customer_action') {
          return locale === 'ar' ? 'بإنتظار إجراء من العميل' : 'Wait Customer Action'
        } else if (value === 'in_progress'){
          return locale === 'ar' ? 'قيد العمل' : 'In Progress'
        }  else if (value === 'completed'){
          return locale === 'ar' ? 'منتهية' : 'Completed'
        }  else if (value === 'canceled'){
          return locale === 'ar' ? 'ملغى' : 'Canceled'
        }
    }
  }

  return getStepStatus
}