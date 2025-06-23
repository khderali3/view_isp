'use client';

import { useCustomFetchMutation } from "@/app/(dashboard)/_components/redux_staff/features/authApiSlice"

import { useState, useEffect } from "react"
import { toast } from "react-toastify";
import CustomModal from "@/app/(dashboard)/_components/jsx/myModal";

import { useTranslations, useLocale } from "next-intl";


import { useSelector } from "react-redux";


const AboutUsSection = () => {
	const [canEdit, setCanEdit] = useState(false)
	const [customFetch] = useCustomFetchMutation()
	const [submitting, setSubmitting] = useState(false)
	const [isModalOpen, setIsModalOpen] = useState(false); // State to control modal visibility
  
  const t = useTranslations('dashboard.site_managment.about_us')
  const {  permissions, is_superuser, is_staff  } = useSelector(state => state.staff_auth);

  const locale = useLocale()


	const [data, setData] = useState({
		about_us_title: "",
		about_us_company_name: "",
		about_us_hint: "",
		about_us_details: "",
		about_us_youtube_url: "", 
    
		about_us_title_ar: "", 
		about_us_company_name_ar: "", 
		about_us_hint_ar: "", 
		about_us_details_ar: "", 


	});



	const handleSubmit = async (e) => {
		setSubmitting(true);
		e.preventDefault();
		const form = new FormData();

		for (const key in data) {
			if (data.hasOwnProperty(key)) {
				form.append(key, data[key]);
			}}



		if (data.about_us_title.trim() !== '' 
		&& data.about_us_company_name.trim() !== ''
		&& data.about_us_hint.trim() !== ''
		&& data.about_us_details.trim() !== ''
		&& data.about_us_title_ar.trim() !== ''
		&& data.about_us_company_name_ar.trim() !== ''
		&& data.about_us_hint_ar.trim() !== ''
		&& data.about_us_details_ar.trim() !== ''

	
	  ){ 
		try {
			// Send form data using customFetch mutation
			const response = await customFetch({
			  url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/staff/site/about_us/`,
			  method: "POST",
			  body: form, // Send FormData as the body
			});
	  
			if( response && response.data){
			  setCanEdit(false)

        if(locale === "ar") {
          toast.success("تم تحديث البيانات بنجاح");

        }else {
          toast.success("your data has been updated ");

        }


			  fetchData(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/staff/site/about_us/`)
			  setIsModalOpen(false)
	  
			} else{
			  console.log(response)
        if(locale === "ar") {
          toast.error("حصل خطأ رقم 1 في تحديث البيانات");

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
        toast.error("حصل خطأ رقم 2 في تحديث البيانات");

      } else {
        toast.error("Error submitting form2.");

      }

		  } finally{setSubmitting(false);}

	  } else {
    if(locale === "ar"){
      toast.error("خطأ . جميع الحقول مطلوبة");

    }else {
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
	 
		  setData(response.data)
	
	
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
  
      fetchData(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/staff/site/about_us/`)
  
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
              <label htmlFor="about_us_title" className="form-label">
                {/* Title */}
                {t('form.title')}
              </label>
              <input
                type="text"
                className="form-control"
                id="about_us_title"
                name="about_us_title"
                readOnly={!canEdit}
                value={data?.about_us_title  || ""}
                onChange={handleChange}
                dir='ltr'


              />
            </div>


            <div className="mb-3">
              <label htmlFor="about_us_company_name" className="form-label">
                {/* Company Name */}
                {t('form.Company_Name')}
              </label>
              <input
                type="text"
                className="form-control"
                id="about_us_company_name"
                name="about_us_company_name"
                readOnly={!canEdit}
                value={data?.about_us_company_name  || ""}
                onChange={handleChange}
                dir='ltr'

              />
            </div>


            <div className="mb-3">
              <label htmlFor="about_us_hint" className="form-label">
                {/* Hint */}
                {t('form.Hint')}
              </label>
              <input
                type="text"
                className="form-control"
                id="about_us_hint"

                name="about_us_hint"
                readOnly={!canEdit}
                value={data?.about_us_hint  || ""}
                onChange={handleChange}
                dir='ltr'
              />
            </div>


            <div className="mb-3">
              <label htmlFor="about_us_details" className="form-label">
                {/* Details */}
                {t('form.Details')}

              </label>
              <input
                type="text"
                className="form-control"
                id="about_us_details"

                name="about_us_details"
                readOnly={!canEdit}
                value={data?.about_us_details  || ""}
                onChange={handleChange}
                dir='ltr'

              />
            </div>


            <div className="mb-3">
              <label htmlFor="about_us_youtube_url" className="form-label">
                {/* Youtube Video URL  */}
                {t('form.youtube_url')} 
              </label>
              <input
                type="text"
                className="form-control"
                id="about_us_youtube_url"

                name="about_us_youtube_url"
                readOnly={!canEdit}
                value={data?.about_us_youtube_url  || ""}
                onChange={handleChange}
                dir='ltr'


              />
            </div>










            <div className="mb-3">
              <label htmlFor="about_us_title_ar" className="form-label">
                {/* Title (Ar) */}
                {t('form.title_ar')} 
              </label>
              <input
                type="text"
                 dir="rtl"
                className="form-control text-end"
                id="about_us_title_ar"
                name="about_us_title_ar"
                readOnly={!canEdit}
                value={data?.about_us_title_ar  || ""}
                onChange={handleChange}

              />
            </div>



            <div className="mb-3">
              <label htmlFor="about_us_company_name_ar" className="form-label">
              {/* Company Name (Ar) */}
              {t('form.Company_Name_ar')}
              </label>
              <input
                type="text"
                className="form-control text-end "
                dir="rtl"

                id="about_us_company_name_ar"
                name="about_us_company_name_ar"
                readOnly={!canEdit}
                value={data?.about_us_company_name_ar  || ""}
                onChange={handleChange}

              />
            </div>




            <div className="mb-3">
              <label htmlFor="about_us_hint_ar" className="form-label">
              {/* Hint (Ar) */}
              {t('form.Hint_ar')}
              </label>
              <input
                type="text"
                className="form-control text-end "
                dir="rtl"

                id="about_us_hint_ar"
                name="about_us_hint_ar"
                readOnly={!canEdit}
                value={data?.about_us_hint_ar  || ""}
                onChange={handleChange}

              />
            </div>


            <div className="mb-3">
              <label htmlFor="about_us_details_ar" className="form-label">
              {/* Detials (Ar) */}
              {t('form.Details_ar')}
              </label>
              <input
                type="text"
                className="form-control text-end "
                dir="rtl"

                id="about_us_details_ar"
                name="about_us_details_ar"
                readOnly={!canEdit}
                value={data?.about_us_details_ar  || ""}
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

                         {!submitting ? t('form.update') : t('form.updating')}
                      </button>

                      <button type="button"  onClick={ () => setCanEdit(false)}    className="  btn  btn-secondary  mx-2">
                        {t('form.cancel')}
                      </button>
                      </>
                        :   

                        <button  onClick={handleCanEdit }   className="  btn mx-2  btn-secondary">
                          {t('form.edit')} 
                        </button>
                    }

              </div>
            </form>

          </div>
        </div>
       
        <hr   />





    <CustomModal  
		id="about_us_modal"
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


export default AboutUsSection