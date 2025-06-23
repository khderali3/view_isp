'use client';

import { useCustomFetchMutation } from "@/app/(dashboard)/_components/redux_staff/features/authApiSlice"

import { useState, useEffect } from "react"
import { toast } from "react-toastify";
import CustomModal from "@/app/(dashboard)/_components/jsx/myModal";
import ListManagerServices from "./our_services_component/ListManager_services";

import { useTranslations, useLocale } from "next-intl";
import { useSelector } from "react-redux";


const OurServicesSection = () => {
	const [canEdit, setCanEdit] = useState(false)
	const [customFetch] = useCustomFetchMutation()
	const [submitting, setSubmitting] = useState(false)
	const [isModalOpen, setIsModalOpen] = useState(false); // State to control modal visibility

  const t = useTranslations('dashboard.site_managment.our_services')
  const locale = useLocale()

  const {  permissions, is_superuser, is_staff  } = useSelector(state => state.staff_auth);


	const [data, setData] = useState({
		servic_sec_title: "",
		servic_sec_sub_title: "",
		servic_sec_hint: "",
		servic_sec_title_ar: "",
		servic_sec_sub_title_ar: "",
    servic_sec_hint_ar: ""
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

      (  data.servic_sec_title &&   data.servic_sec_title.trim() !== '' ) && 
      ( data.servic_sec_sub_title &&  data.servic_sec_sub_title.trim() !== '' ) &&
      ( data.servic_sec_hint &&  data.servic_sec_hint.trim() !== '' ) &&
      ( data.servic_sec_title_ar && data.servic_sec_title_ar.trim() !== ''  ) &&
      ( data.servic_sec_sub_title_ar && data.servic_sec_sub_title_ar.trim() !== ''  ) &&
      ( data.servic_sec_hint_ar && data.servic_sec_hint_ar.trim() !== ''  )
	
	  ){ 
		try {
			// Send form data using customFetch mutation
			const response = await customFetch({
			  url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/staff/site/our_services_sec/`,
			  method: "POST",
			  body: form, // Send FormData as the body
			});
	  
			if( response && response.data){
			  setCanEdit(false)

        if(locale === "ar"){
          toast.success("تم تعديل البيانات بنجاح");

        }else {
          toast.success("your data has been updated ");

        }

			  fetchData(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/staff/site/our_services_sec/`)
			  setIsModalOpen(false)
	  
			} else{
			  console.log(response)
        if(locale === "ar"){
          toast.error("حصل خطأ رقم 1 أثناء عملية التعديل . يرجى المحاولة مجدداً");

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
        toast.error("حصل خطأ رقم 2 أثناء عملية التعديل . يرجى المحاولة مجدداً");

      } else {
        toast.error("Error submitting form2.");

      }
		  } finally{ setSubmitting(false);}

	  } else {
      if(locale === "ar"){
        toast.error("جميع الحقول مطلوبة");

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
  
      fetchData(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/staff/site/our_services_sec/`)
  
    }, []);



    if (!is_superuser && !(permissions?.includes('usersAuthApp.site_managment') && is_staff)) {
      return;
    } 







    return (

            
        <div className="container mt-2">
        <h6>
          {/* Our Services (fifth Section)   */}
          {t('title')}
        </h6>
        {/* Row for Search Form */}
        <div className="row my-4 py-4 px-4 border">
          <div className="col-12">

            <form   className="  row "     >


            
           
            <div className="mb-3">
              <label htmlFor="servic_sec_title" className="form-label">
                {t('form.title')}
              </label>
              <input
                type="text"
                className="form-control"
                id="servic_sec_title"
                name="servic_sec_title"
                readOnly={!canEdit}
                value={data?.servic_sec_title  || ""}
                onChange={handleChange}
                dir='ltr'

              />
            </div>


            <div className="mb-3">
              <label htmlFor="servic_sec_sub_title" className="form-label">
                {/* SubTitle */}
                {t('form.SubTitle')}
              </label>
              <input
                type="text"
                className="form-control"
                id="servic_sec_sub_title"
                name="servic_sec_sub_title"
                readOnly={!canEdit}
                value={data?.servic_sec_sub_title  || ""}
                onChange={handleChange}
                dir='ltr'

              />
            </div>


            <div className="mb-3">
              <label htmlFor="servic_sec_hint" className="form-label">
                
                {t('form.Hint')}
              </label>
              <input
                type="text"
                className="form-control"
                id="servic_sec_hint"
                name="servic_sec_hint"
                readOnly={!canEdit}
                value={data?.servic_sec_hint  || ""}
                onChange={handleChange}
                dir='ltr'

              />
            </div>








           
            <div className="mb-3">
              <label htmlFor="servic_sec_title_ar" className="form-label">
                 
                {t('form.title_ar')}
              </label>
              <input
                type="text"
                className="form-control text-end"
                id="servic_sec_title_ar"
                dir="rtl"

                name="servic_sec_title_ar"
                readOnly={!canEdit}
                value={data?.servic_sec_title_ar  || ""}
                onChange={handleChange}
              />
            </div>


            <div className="mb-3">
              <label htmlFor="servic_sec_sub_title_ar" className="form-label">
               
                {t('form.SubTitle_ar')}
              </label>
              <input
                type="text"
                dir="rtl"

                className="form-control text-end"
                id="servic_sec_sub_title_ar"
                name="servic_sec_sub_title_ar"
                readOnly={!canEdit}
                value={data?.servic_sec_sub_title_ar  || ""}
                onChange={handleChange}
              />
            </div>


            <div className="mb-3">
              <label htmlFor="servic_sec_hint_ar" className="form-label">
                 
                {t('form.Hint_ar')}
              </label>
              <input
                type="text"
                dir="rtl"
                className="form-control text-end"
                id="servic_sec_hint_ar"
                name="servic_sec_hint_ar"
                readOnly={!canEdit}
                value={data?.servic_sec_hint_ar  || ""}
                onChange={handleChange}
              />
            </div>














              <div className=" pt-3 mt-3 ">


                    { canEdit === true ?

                          <> 
                        <button type="button" disabled={submitting} 
                            onClick= { () => setIsModalOpen(true)}
                              className="btn btn-primary"
                              >

                         {!submitting ?  t('form.update') : t('form.updating') }
                      </button>

                          <button type="button"  onClick={ () => setCanEdit(false)}    className="  btn  btn-secondary  mx-2">
                           
                          {t('form.cancel')} 
                          </button>
                          </>
                        :   

                        <button  onClick={handleCanEdit }   className="  btn mx-2 btn-secondary">
                          {t('form.edit')} 

                        </button>
                    }

              </div>
            </form>

          </div>
        </div>

       
        <hr   />





    <CustomModal  
		id="our_services_modal"
		handleSubmit={handleSubmit}
		submitting={submitting}
		message={t('form.modal_msg')}  
		showModal={true} 
		isModalOpen={isModalOpen}
		setIsModalOpen={setIsModalOpen}

		/>  






      <ListManagerServices />



    </div>



    )
}


export default OurServicesSection