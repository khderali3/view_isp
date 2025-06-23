'use client';

import { useCustomFetchMutation } from "@/app/(dashboard)/_components/redux_staff/features/authApiSlice"

import { useState, useEffect } from "react"
import { toast } from "react-toastify";
import CustomModal from "@/app/(dashboard)/_components/jsx/myModal";


import { useTranslations, useLocale } from "next-intl";
import { useSelector } from "react-redux";


const OurVisionSection = () => {
	const [canEdit, setCanEdit] = useState(false)
	const [customFetch] = useCustomFetchMutation()
	const [submitting, setSubmitting] = useState(false)
	const [isModalOpen, setIsModalOpen] = useState(false); // State to control modal visibility

  const t = useTranslations('dashboard.site_managment.our_vision')
  const locale = useLocale()

  const {  permissions, is_superuser, is_staff  } = useSelector(state => state.staff_auth);


	const [data, setData] = useState({
		our_vision_title: "",
		our_vision_detail: "",
		our_vision_title_ar: "",
		our_vision_detail_ar: "",
	});



	const handleSubmit = async (e) => {
		setSubmitting(true);
		e.preventDefault();
		const form = new FormData();

		for (const key in data) {
			if (data.hasOwnProperty(key)) {
					form.append(key, data[key]);
			}}


		if (

      (  data.our_vision_title &&   data.our_vision_title.trim() !== '' ) && 
      ( data.our_vision_detail &&  data.our_vision_detail.trim() !== '' ) &&
      ( data.our_vision_title_ar &&  data.our_vision_title_ar.trim() !== '' ) &&
      ( data.our_vision_detail_ar && data.our_vision_detail_ar.trim() !== ''  )
	
	  ){ 
		try {
			// Send form data using customFetch mutation
			const response = await customFetch({
			  url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/staff/site/our_vision_sec/`,
			  method: "POST",
			  body: form, // Send FormData as the body
			});
	  
			if( response && response.data){
			  setCanEdit(false)

        if(locale === "ar"){
          toast.success("تم تعديل البيانات بنجاح");

        } else {
          toast.success("your data has been updated ");

        }


			  fetchData(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/staff/site/our_vision_sec/`)
			  setIsModalOpen(false)
	  
			} else{
			  console.log(response)
        if(locale === "ar"){
          toast.error("حدث خطأ رقم 1 أثناء تعديل البيانات يرجى المحاولة مجدداً");

        } else {
          toast.error("Error submitting form 1.");

        }

        if (response?.error?.data?.detail) {
          if(response.error.data.detail === "Permission denied for this operation."){
            if(locale === "ar") {
              toast.error(" لا يوجد لديك صلاحيات للقيام بهذه العملية!");

            } else {
              toast.error(response.error.data.detail);
            }

          } 
        } else {
          toast.error(JSON.stringify(response?.error?.data));
        }



			}
	  
		  } catch (error) {
			console.error("Error submitting form:", error);
      if(locale === "ar"){
        toast.error("حدث خطأ رقم 2 أثناء تعديل البيانات يرجى المحاولة مجدداً");

      } else {
        toast.error("Error submitting form2.");

      }
		  } finally{ setSubmitting(false);}

	  } else {
      if(locale === "ar"){
        toast.error("جميع الحقول مطلوبة ");

      } else {
        toast.error("Error. all fields are required ");

      }
    setSubmitting(false);
	  }
	
	  
		  
	};






	const fetchData = async (pageUrl) => {
		try {
		  const response = await customFetch({
			url: pageUrl,
			method: 'GET', // Only use 'GET' for fetching data
			headers: {
			  'Content-Type': 'application/json',
			}, 
		  });
	 
      if (response && response.data ) {
        const filteredData = Object.fromEntries(
          Object.entries(response.data).filter(([key, value]) => value !== null)
          ) 
    
        // setData(filteredData);	
        setData((prevData) => ({
          ...prevData,
          ...filteredData,
        }));


      }

	
		} catch (error) {
		  console.error("Error fetching data:", error);
		}
	  };


	const  handleCanEdit = (e) => {
		e.preventDefault();
		setCanEdit(true)
	}


	const handleChange = (e) => {
		const { name, value } = e.target;

		  setData((prevState) => ({
			...prevState,
			[name]: value,
		  }));
	  };


    useEffect(() => {
  
      fetchData(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/staff/site/our_vision_sec/`)
  
    }, []);


    if (!is_superuser && !(permissions?.includes('usersAuthApp.site_managment') && is_staff)) {
      return;
    } 




    return (

            
        <div className="container mt-2">

        <h6>{t('title')} 

        </h6>
        {/* Row for Search Form */}
        <div className="row my-4 py-4 px-4 border">
          <div className="col-12">

            <form   className="  row "     >


            
           
            <div className="mb-3">
              <label htmlFor="our_vision_title" className="form-label">
              {t('form.title')}
              </label>
              <input
                type="text"
                className="form-control"
                id="our_vision_title"
                name="our_vision_title"
                readOnly={!canEdit}
                value={data?.our_vision_title  || ""}
                onChange={handleChange}
                dir='ltr'

              />
            </div>


            <div className="mb-3">
                <label htmlFor="our_vision_detail" className="form-label">
                
                {t('form.Details')} 
                </label>
                <textarea 
                className="form-control  "
                readOnly={!canEdit}

                rows="3"
                id="our_vision_detail"
                name="our_vision_detail"
                value={data?.our_vision_detail  || ""}
                onChange={handleChange}
                dir='ltr'

                >
                </textarea>
            </div>


           
            <div className="mb-3">
              <label htmlFor="our_vision_title_ar" className="form-label">
                
                {t('form.title_ar')}
              </label>
              <input
                type="text"
                className="form-control text-end"
                dir="rtl"

                id="our_vision_title_ar"
                name="our_vision_title_ar"
                readOnly={!canEdit}
                value={data?.our_vision_title_ar  || ""}
                onChange={handleChange}
              />
            </div>


            <div className="mb-3">
                <label htmlFor="our_vision_detail_ar" className="form-label">
                 
                {t('form.Details_ar')}
                </label>
                <textarea 
                className="form-control  text-end"
                dir="rtl"
                rows="3"
                id="our_vision_detail_ar"
                name="our_vision_detail_ar"
                value={data?.our_vision_detail_ar  || ""}
                onChange={handleChange}
                readOnly={!canEdit}

                >
                </textarea>
            </div>









              <div className=" pt-3 mt-3 ">


                    { canEdit === true ?

                          <> 
                        <button type="button" disabled={submitting} 
                            onClick= { () => setIsModalOpen(true)}
                              className="btn btn-primary"
                              >

                         {!submitting ? t('form.update') : t('form.updating')}
                      </button>

                          <button type="button"  onClick={ () => setCanEdit(false)}    className="  btn  btn-secondary  mx-2">
                           
                          { t('form.cancel')}
                          </button>
                          </>
                        :   

                        <button  onClick={handleCanEdit }   className="  btn mx-2 btn-secondary">
                          
                        { t('form.edit')}
                        </button>
                    }

              </div>
            </form>

          </div>
        </div>

       
        <hr   />





    <CustomModal  
		id="our_Vision_modal"
		handleSubmit={handleSubmit}
		submitting={submitting}
		message={t('form.modal_msg')}
		showModal={true} 
		isModalOpen={isModalOpen}
		setIsModalOpen={setIsModalOpen}

		/>  






    </div>



    )
}


export default OurVisionSection