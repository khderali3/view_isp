
import { useState, useRef } from "react"
import { toast } from "react-toastify";
 
import { getErrorMessage } from "@/app/public_utils/utils";
import { useCustomFetchMutation } from "@/app/(site)/_components/redux/features/siteApiSlice"

import { useTranslations } from "next-intl";
 
 
import { FormSearchInput } from "./search_input_installed_product_type";

export const AddNewObject = ({handleReloadFlag=null, projectflow_id}) => {
	const t = useTranslations('site.ticket.ticket_details_msgs.ticket_reply_form')

  const [instaledProductID, setInstaledProductID] = useState('');  

  const handleInstaledProductID = (selectedValue) => {
    if(selectedValue){
		setInstaledProductID(selectedValue);
    }else{
		setInstaledProductID('');
    } 
 
  };




	const [customFetch] = useCustomFetchMutation();
 
    const [data, setData] = useState({
        serial_number:'',
        note: "",
        private_note: '',
     })

  


	// const isButtonDisabled = Object.values(data).some((value) => value.trim() === "");
 
	const isButtonDisabled = Object.values(
		(({ private_note, ...rest }) => rest)(data)
	  ).some((value) => value.trim() === "");

	const [isSubmitting, setIsSubmitting] = useState(false)

	const handleChange = (e) => {
		const { name, value  } = e.target;
		setData((prevState) => ({
			...prevState,
			[name]: value,
		  }));
 
		}



	const handleSubmit = async (e) => {
		e.preventDefault()

		// const emptyFields = Object.entries(data)
		// .filter(([key, value]) => !value.trim())  
		// .map(([key]) => key);  
	
		const emptyFields = Object.entries(data)
		.filter(([key, value]) => key !== "private_note" && !value.trim())
		.map(([key]) => key);


	  if (emptyFields.length > 0) {
		toast.error(`Please fill in all fields: ${emptyFields.join(", ")}`)
		return;
	  }


	  if(!instaledProductID){
		toast.error(`Please select Product`)
		return;
	  }





		try{
			setIsSubmitting(true)

			const formData = new FormData()

            Object.entries(data).forEach(([key, value]) => {
                formData.append(key, value);
              });

  

 			const response = await customFetch({
			   url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/staff/projectflow/projectflow/${projectflow_id}/${instaledProductID}/installed_product/`,
			   method: "POST",
			   body: formData, 
			 });

			if(response && response.data){
  

				setData({
					serial_number:'',
					note: "",
					private_note: '',
				 })
 
				 setInstaledProductID('')	

				if(handleReloadFlag){handleReloadFlag()}
 
				toast.success('your data has been submited')
			} else{
				setIsSubmitting(false)
				console.log('response', response)
				if (response?.error?.data) {
					toast.error(getErrorMessage(response.error.data));
				}
			}


		} catch(error){
			console.log(error)			
			toast.error(getErrorMessage(error.data || error.message) || "Something went wrong");
		} finally{ setIsSubmitting(false) }

	}








    return ( 

		<div className="mb-3 col-md-10 col-12">

		<form   className="    "     >

 

			<div className="mb-3">

				<FormSearchInput 
				handleobjectIdChange={handleInstaledProductID}
				objectId={instaledProductID}
				ph={'Select Product '}
				lable={'Product name'}
				url={`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/staff/projectflow/projectflow/installed_product_type/`}
				/>

 
			</div>

  
			
			<div className="mb-3">
				<label htmlFor="serial_number" className="form-label small">
				Serial Number
				</label>
				<input
					type="text"
					className="form-control   form-control-sm  "
					dir="ltr"
					id="serial_number"
					name="serial_number"
					value={data.serial_number  || ""}
					onChange={handleChange}
 				/>
			</div>

 
 
 			
			<div className="mb-3">
				<label htmlFor="note" className="form-label small">
 				 Note
				</label>
				<input
					type="text"
					className="form-control form-control-sm "
					id="note"
					name="note"
					value={data.note  || ""}
					onChange={handleChange}
					dir='ltr'


				/>
			</div>
 
 


			<div className="mb-3">
				<label htmlFor="private_note" className="form-label small">
					Private Note
				</label>
				<input
					type="text"
					className="form-control form-control-sm "
					id="private_note"
					name="private_note"
					value={data.private_note  || ""}
					onChange={handleChange}
					dir='ltr'


				/>
			</div>

 



		<button
			className="btn btn-success mt-2"
			onClick={handleSubmit}
			disabled={isButtonDisabled || isSubmitting }
 		>

			{/* {addingItem ? t('form_add.adding_item') : t('form_add.add_item')} */}
			Add Item
		</button>



		</form>


		</div>  


 









    )
}