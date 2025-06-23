import CustomModal from "@/app/(dashboard)/_components/jsx/myModal";

import { useState } from "react";
import { useCustomFetchMutation } from "@/app/(dashboard)/_components/redux_staff/features/authApiSlice";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";


const DeleteTicketButton = ({ticket_id, customFlag="customFlag" }) => {
	const [loadingDeleteTicket, setloadingDeleteTicket] = useState(false); // Loading state
    const [isModalOpen, setIsModalOpen] = useState(false); // State to control modal visibility

    const [customFetch] = useCustomFetchMutation();
	const router = useRouter()
    const t = useTranslations('common.ticket_card.delete_ticket')
    const locale = useLocale()

    const [isSubmitedSuccess, setIsSubmitedSuccess] = useState(false)


	const handleDelteTicket = async () => {
        setloadingDeleteTicket(true);
        try {
          const response = await customFetch({
            url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/staff/ticket/tickets/${ticket_id}/`,
            method: 'DELETE', // Only use 'GET' for fetching data
            headers: {
              'Content-Type': 'application/json',
            }, 
          });
     
          if(response && response.data) {
			setIsSubmitedSuccess(true)
			
			// toast.success("the ticket has been deleted successfully ");
            if(locale === "ar"){
				toast.success("تم حذف التذكرة بنجاح"); 
			  } else {
				toast.success("the ticket has been deleted successfully ")
			  }


			router.push('/staff/ticket')

          } else { 
			
			if(locale === "ar") {
				toast.error(" حدث خطأ رقم 1 أثناء حذف التذكرة, يرجى المحاولة مجدداً ");

			} else {
				toast.error(" error1 with delete the ticket ");
			}

			if (response?.error?.data?.detail) {
				if(response.error.data.detail === "Permission denied for this operation."){
					if(locale === "ar") {
						toast.error(" لا يوجد لديك صلاحيات للقيام بهذه العملية!");
		
					} else {
						toast.error(response.error.data.detail);
					}

				}
			}

			console.log(response) 
		
		}

        } catch (error) {
			if(locale === "ar") {
				toast.error(" حدث خطأ رقم2  أثناء حذف التذكرة, يرجى المحاولة مجدداً ");

			} else {
				toast.error(" error1 with delete the ticket ");
			}
          console.error("error2 with delete the ticket:", error);
        }
        setloadingDeleteTicket(false);
      };
    





	return ( <>
	
	
	<button className={`btn btn-outline-danger w-100 ${loadingDeleteTicket || isSubmitedSuccess && 'disabled'} `}
                      
		onClick= { () => setIsModalOpen(true)}  
		disabled={loadingDeleteTicket || isSubmitedSuccess}                     
                    
	>

		{/* {loadingDeleteTicket ? 'loading..' : 'Delete Ticket' } */}
		{loadingDeleteTicket || isSubmitedSuccess ? t('btn_delete_ticket_loading') : t('btn_delete_ticket') }

					  
	</button>
	
	
	
	
	<CustomModal  
	id={`delete_ticket_modal_id_${customFlag}`}
	handleSubmit={handleDelteTicket}
	submitting={loadingDeleteTicket}
	// message={"Are you sure you want to delete this ticket ?"}
	message={t('modal_msg')}

	showModal={true} 
	isModalOpen={isModalOpen}
	setIsModalOpen={setIsModalOpen}
	operationType="Delete"

	/>  
	
	
	</>

	)
}

export default DeleteTicketButton