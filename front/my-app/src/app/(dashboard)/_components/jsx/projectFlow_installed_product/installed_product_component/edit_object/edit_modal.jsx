

import { useTranslations } from "next-intl"
import { useEffect, useState, useRef } from "react"
import { useCustomFetchMutation } from "@/app/(dashboard)/_components/redux_staff/features/authApiSlice"
import { toast } from "react-toastify"
import { getErrorMessage } from "@/app/public_utils/utils"

 
 import { FormSearchInput } from "../search_input_installed_product_type";
 
export const EditModalComponent = ({ projectflow_id, id, onClose , handleReloadFlag=null}) => {

    const t = useTranslations('dashboard.site_managment.our_product.list_manager')
    const [customFetch] = useCustomFetchMutation()

    const [data, setData] = useState({
        serial_number:'',
        note: "",
        private_note: '',
     })

     const [instaledProductID, setInstaledProductID] = useState('');  

     const handleInstaledProductID = (selectedValue) => {
       if(selectedValue){
       setInstaledProductID(selectedValue);
       }else{
       setInstaledProductID('');
       } 
    
     };
  
  

     const [isSubmitting, setIsSubmitting] = useState(false)
     
 



  const handleSubmit = async (e) => {
    e.preventDefault()
 



  

    const fieldsToCheck = [
    
    ];

    const emptyFields = Object.entries(data)
        .filter(([key, value]) => fieldsToCheck.includes(key) && !value.trim()) // Check only specified fields
        .map(([key]) => key); // Extract field names

    if (emptyFields.length > 0) {
        toast.error(`Please fill in all fields: ${emptyFields.join(", ")}`);
        return;
    }


    try{
      setIsSubmitting(true)

      const formData = new FormData()


 

      Object.entries(data).forEach(([key, value]) => {
        if (
          key === "serial_number" ||  
          key === "note" ||  
          key === "private_note"   

        ) {
          formData.append(key, value);
        }
      });

      formData.append('installed_product_type', instaledProductID);
 

      const response = await customFetch({
         url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/staff/projectflow/projectflow/${projectflow_id}/installed_product/${id}/`,
         method: "PUT",
         body: formData, 
       });

      if(response && response.data){
        onClose()
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
      console.log('error', error)			
      toast.error(getErrorMessage(error.data || error.message) || "Something went wrong");
    } finally{ setIsSubmitting(false) }

  }








     const handleChange = (e) => {
        const { name, value, type, files } = e.target;
    
        if (type === "file") {
          // If the input is a file, update the selectedFile state
          setProjectMainImageSelected(files[0]);
        } else {
          // If the input is not a file, update the data state
          setData((prevState) => ({
          ...prevState,
          [name]: value,
          }));
        }   
      }

  const fetchData = async (pageUrl) => {
    try {
      const response = await customFetch({
      url: pageUrl,
      method: 'GET', // Only use 'GET' for fetching data
      headers: {
        'Content-Type': 'application/json',
      }, 
      });
       if( response && response.data) {
        // setData(response.data)

        setData((prev) => ({
          ...prev,
          ...Object.fromEntries(
            Object.entries(response.data).filter(([_, value]) => value != null)
          )
        }));




        setInstaledProductID(response.data?.installed_product_type)

      } else{
        console.log(response)
      }
  
    } catch (error) {
      console.error("Error fetching data:", error);
    }
    };


  useEffect(() => {

    fetchData(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/staff/projectflow/projectflow/${projectflow_id}/installed_product/${id}/`)
  }, [id]);


 
 



  useEffect(() => {
    const modalElement = document.getElementById('editModal_instaledProduct');
  
    if (modalElement) {
     
      const modalInstance = new window.bootstrap.Modal(modalElement, {
        backdrop: true,  
        keyboard: true,  
      });
  
      modalInstance.show();
  
 
      const handleModalClose = () => {
        if(onClose){
          onClose();  
          document.activeElement?.blur(); 
          document.body.style.overflow = ""; // Restore scrolling
 
        }
      };
  
 
      modalElement.addEventListener("hidden.bs.modal", handleModalClose);
  
 
      return () => {
        modalElement.removeEventListener("hidden.bs.modal", handleModalClose);
        modalInstance.dispose();
        document.body.style.overflow = ""; // Ensure scrolling is restored

      };
    }
  }, [id, onClose]);
   
 

    return (

 
        <div
        className="modal fade  modal-lg   "
        id="editModal_instaledProduct"
        tabIndex="1"
        aria-labelledby="editModal_instaledProductLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog        ">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="editModal_instaledProductLabel">Edit installed Product  Type</h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                // aria-label="Close"
 
              ></button>
            </div>



          <div className="modal-body">


            <form   className=" p-2 "     >

            
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
 

                </form>

              </div>



 
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
 

              >
                {/* {t('form_edit.cancel')} */}
                cancel
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleSubmit}
                // data-bs-dismiss="modal"
                disabled={isSubmitting}
              >
				{/* {editingItemId  ? t('form_edit.updating') : t('form_edit.update') } */}
                update
              </button>
            </div>
          </div>
        </div>
      </div>
 


    )
}