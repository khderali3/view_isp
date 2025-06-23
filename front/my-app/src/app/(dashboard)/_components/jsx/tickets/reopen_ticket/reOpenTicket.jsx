import CustomModal from "@/app/(dashboard)/_components/jsx/myModal";

import { useState } from "react";
import { useCustomFetchMutation } from "@/app/(dashboard)/_components/redux_staff/features/authApiSlice";
import { toast } from "react-toastify";
import { useTranslations, useLocale } from "next-intl";


const ReOpenTicketButton = ({ticket_id, reloadComponentMethod, customFlag="customFlag"}) => {
    const [loadingReOpenTicket, setloadingReOpenTicket] = useState(false); // Loading state
    const [isSubmitedSuccess, setIsSubmitedSuccess] = useState(false)


    const [isModalOpen, setIsModalOpen] = useState(false); // State to control modal visibility

    const [customFetch] = useCustomFetchMutation();

    const t = useTranslations('common.ticket_card.reopen_ticket')
    const locale = useLocale()

	const handleReOpenTicket = async () => {
        setloadingReOpenTicket(true);
        try {
          const response = await customFetch({
            url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/staff/ticket/tickets/${ticket_id}/reopen/`,
            method: 'POST', // Only use 'GET' for fetching data
            headers: {
              'Content-Type': 'application/json',
            }, 
          });
     
          if(response && response.data) {
            setIsSubmitedSuccess(true)
            // toast.success("the ticket has been re-opend successfully ");
            if(locale === "ar"){
              toast.success("تم إعادة فتح التذكرة بنجاح"); 
            } else {
              toast.success("the ticket has been re-opend successfully ");
            }
            reloadComponentMethod()

          } else { console.log(response) 

            // toast.error(" error1 with re-open the ticket ");
            if(locale === "ar"){
              toast.error("هناك خطأ 1 في إعادة فتح التذكرة");
            } else {
              toast.error(" error1 with re-open the ticket ");
      
            }

          }

        } catch (error) {
          console.error("Error fetching data:", error);
          // toast.error(" error2 with re-open the ticket ");
          if(locale === "ar"){
            toast.error("هناك خطأ 2 في إعادة فتح التذكرة");
          } else {
            toast.error(" error2 with  re-open the ticket ");
          }
        }
        setloadingReOpenTicket(false);
      };
    







	return ( <>
	
	
	<button className={`btn btn-outline-primary w-100 ${loadingReOpenTicket  || isSubmitedSuccess && 'disabled'} `}
		onClick= { () => setIsModalOpen(true)} 
    disabled={loadingReOpenTicket || isSubmitedSuccess}                     
                     
    >

			{/* {loadingReOpenTicket ? 'loading..' : 're-Open the Ticket' } */}
      {loadingReOpenTicket || isSubmitedSuccess ? t('btn_open_ticket_loading')  : t('btn_open_ticket') }

                        
	</button>

	
	
	
	
	<CustomModal  
	id={`re_open_ticket_modal_id_${customFlag}`}
	handleSubmit={handleReOpenTicket}
	submitting={loadingReOpenTicket}
	// message={"Are you sure you want to re-open the ticket?"}
  message={t('modal_msg')}

	showModal={true} 
	isModalOpen={isModalOpen}
	setIsModalOpen={setIsModalOpen}

	/>  
	
	
	</>

	)
}

export default ReOpenTicketButton