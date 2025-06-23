
 
import { useState, useRef    } from "react"
import StaffUsersSearchInput from "./input_search_staff/page"
import { useCustomFetchMutation } from "@/app/(dashboard)/_components/redux_staff/features/authApiSlice"
import { toast } from "react-toastify"
 



import { useTranslations, useLocale } from "next-intl"

const AssignTicketModal = ({assigningTicketId, setAssiningTicketId=null, setReloadComponent , isTicketClosed=false}  ) => {

	const t = useTranslations("dashboard.ticket.Assigne_ticket_modale")
	const locale = useLocale()


	const [isOtherUser, setIsOtherUser] = useState(null)
	const [userId, setUserId] = useState(null);  
	const [customFetch] = useCustomFetchMutation()
	const [submitting, setSubmitting] = useState(false)


	const assignToMeRef = useRef(null);
	const assignToOtherRef = useRef(null);

	const handleUserIdChange = (selectedValue) => {
		if(selectedValue){
			setUserId(selectedValue);
		} else{setUserId(null);}
	  };


 	const handleSubmit = async (e) => {
		setSubmitting(true);
		e.preventDefault();

		const form = new FormData();

		let url = ''

		if(isOtherUser === false) {
			url =  `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/staff/ticket/tickets/${assigningTicketId}/assign_to_me/`
		} else {
			if(userId && isOtherUser === true) {
				url =  `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/staff/ticket/tickets/${assigningTicketId}/assign_or_reassign/`
				form.append('ticket_assigned_to', userId);
			}
		} 

		if(!isTicketClosed) {

			if(isOtherUser === false && assigningTicketId   || userId && assigningTicketId ) { 
				try {
					// Send form data using customFetch mutation
					const response = await customFetch({
					  url: url,
					  method: "POST",
					  body: form, // Send FormData as the body
					});
			  
					if( response && response.data){

						if( locale === "ar"){
							toast.success("تم إسناد التذكرة بنجاح ");

						}else {
							toast.success("the ticket has been assigned successfully ");

						}	
		
					  if(setAssiningTicketId !== null){
						setAssiningTicketId(null)
		
					  }
		 
		
		
		
					  setIsOtherUser(false)
					  setUserId(null)
					  setReloadComponent()
		
		
					  if (assignToMeRef.current) assignToMeRef.current.checked = false; // Uncheck "Assign To Me"
					  if (assignToOtherRef.current) assignToOtherRef.current.checked = false; // Uncheck "Assign To Other"
		
			  
					} else{
					  console.log(response)
					  if( locale === "ar"){
						toast.error(" حدث خطأ 1 اثناء المعالجة ");
					  }else {
						toast.error("Error 1 submitting .");

					  }
					}
			  
				  } catch (error) {
					console.error("Error submitting form:", error);
					if( locale === "ar"){
						toast.error("حدث خطأ 2 أثناء المعالجة");

					}else {
						toast.error("Error 2 submitting form .");

					}
				  }
		
				} else {
					if( locale === "ar"){
						toast.error("يرجى تحديد أحد الخيارات المتاحة");

					} else {
						toast.error("Error, kindly select one option.");

					}
				}





		} else {
			if( locale === "ar"){
				toast.error("التذكرة مغلقة! يرجى إعادة فتح التذكرة قبل محاولة إسنادها");
			} else {
				toast.error("the ticket is closed , you have to reopened to assign");

			}
		}

	  setSubmitting(false);
	};
 
 
	

	const handleClose = () => {
 		if (assignToMeRef.current) assignToMeRef.current.checked = false; // Uncheck "Assign To Me"
		if (assignToOtherRef.current) assignToOtherRef.current.checked = false; // Uncheck "Assign To Other"
		setUserId(null)
		setIsOtherUser(null)
 	  };





	return(




      <div
        className="modal fade modal-lg "
        id="assign_ticket_to_staff"
        tabIndex="-1"
        aria-labelledby="editModal_productLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog   ">
          <div className="modal-content">
            <div className="modal-header">
				<h5 className="modal-title" id="assign_ticket_to_staffLabel">
					{/* Assigne Ticket To Staff */}
					{t("title")}
				</h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>

			<form   className="   modal-body    "     >


				<div className=" ">
					<input
					className="form-check-input    "
					type="radio"
					name="assign_to"
					id="assign_to_me"
					ref={assignToMeRef}

					onChange={() => setIsOtherUser(false)}
					/>
					<label className="form-check-label mx-2 " htmlFor="assign_to_me">
					{t("Assign_To_Me")}
					</label>
				</div>
				<div className=" ">
					<input
					className="form-check-input    "
					type="radio"
					name="assign_to"
					id="assign_to_other"
					defaultChecked=""
					onChange={() => setIsOtherUser(true)}
					ref={assignToOtherRef}

					/>
					<label className="form-check-label mx-2 " htmlFor="assign_to_other">
					{t("other_user")}
					</label>
				</div>

 

				<div className="col-12   ">
					<StaffUsersSearchInput
						handleUserIdChange={handleUserIdChange}
						userId={userId}
						isOtherUser={isOtherUser}
						input_lable ={t("search_staff_lable")}
						input_ph = {t("search_staff_lable_ph")}
					/>  
				</div>





			</form>












            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
				onClick={handleClose}
              >
                {t("close")}
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleSubmit}
                data-bs-dismiss="modal"
              >
				{t("save")}
              </button>
            </div>
          </div>
        </div>
      </div>









	)
}


export default AssignTicketModal