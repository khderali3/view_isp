'use client';

import { useCustomFetchMutation } from "@/app/(dashboard)/_components/redux_staff/features/authApiSlice"

import { useState, useEffect } from "react"
import { toast } from "react-toastify";
import CustomModal from "@/app/(dashboard)/_components/jsx/myModal";
// import ListManagerProduct from "./our_product_section_component/ListManager_product";

import ListManagerProjectType from "./projectType_component/ListManager_projectType";

import { useTranslations, useLocale } from "next-intl";

import { useSelector } from "react-redux";

 
 


const ProjectTypeSection = () => {
	const [canEdit, setCanEdit] = useState(false)
	const [customFetch] = useCustomFetchMutation()
	const [submitting, setSubmitting] = useState(false)
	const [isModalOpen, setIsModalOpen] = useState(false); // State to control modal visibility

  const t = useTranslations('dashboard.projectFlow.projectType.projectTypeSection')
  const locale = useLocale()

  const {  permissions, is_superuser, is_staff  } = useSelector(state => state.staff_auth);

 


	const [data, setData] = useState({
		title: "",
		title_hint: "",
		title_ar: "",
		title_hint_ar: "",
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

      (  data.title &&   data.title.trim() !== '' ) && 
      ( data.title_hint &&  data.title_hint.trim() !== '' ) &&
      ( data.title_ar &&  data.title_ar.trim() !== '' ) &&
      ( data.title_hint_ar && data.title_hint_ar.trim() !== ''  )
	
	  ){ 
		try {
			// Send form data using customFetch mutation
			const response = await customFetch({
			  url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/staff/site/project_type_sec/`,
			  method: "POST",
			  body: form, // Send FormData as the body
			});
	  
			if( response && response.data){
			  setCanEdit(false)
        if(locale === "ar"){
          toast.success("تم تعديل البيانات بنجاح ");

        } else {
          toast.success("your data has been updated ");

        }
			  fetchData(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/staff/site/project_type_sec/`)
			  setIsModalOpen(false)
	  
			} else{
			  console.log(response)
        if(locale === "ar"){
          toast.error("حصل خطأ رقم 1 أثناء تعديل البيانات . يرجى المحاولة لاحقاً");

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
        toast.error("حصل خطأ رقم 2 أثناء تعديل البيانات . يرجى المحاولة لاحقاً");

      } else {
        toast.error("Error submitting form2.");

      }
		  }finally{setSubmitting(false)}

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
		  }))

	  };


    useEffect(() => {
  
      fetchData(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/staff/site/project_type_sec/`)
  
    }, []);



    if (!is_superuser && !(permissions?.includes('usersAuthApp.site_managment') && is_staff)) {
      return;
    } 





    return (

            
        <div className="container mt-2">
        <h6>
          {/* Product Section (Fourth Section)   */}
          {/* Project Type Section */}
          {t('section_title')}
        </h6>
        {/* Row for Search Form */}
        <div className="row my-4 py-4 px-4 border">
          <div className="col-12">

            <form   className="  row "     >


            
           
            <div className="mb-3">
              <label htmlFor="title" className="form-label">
              
              {t('form.title')}
              </label>
              <input
                type="text"
                className="form-control"
                id="title"
                name="title"
                readOnly={!canEdit}
                value={data?.title  || ""}
                onChange={handleChange}
                dir='ltr'


              />
            </div>


            <div className="mb-3">
              <label htmlFor="title_hint" className="form-label">
                
              {t('form.details')}
              </label>
              <input
                type="text"
                className="form-control"
                id="title_hint"
                name="title_hint"
                readOnly={!canEdit}
                value={data?.title_hint  || ""}
                onChange={handleChange}
                dir='ltr'


              />
            </div>


            <div className="mb-3">
              <label htmlFor="title_ar" className="form-label">
                 
              {t('form.title_ar')}
              </label>
              <input
                dir="rtl"
                type="text"
                className="form-control text-end"
                id="title_ar"

                name="title_ar"
                readOnly={!canEdit}
                value={data?.title_ar  || ""}
                onChange={handleChange}

              />
            </div>


            <div className="mb-3">
              <label htmlFor="title_hint_ar" className="form-label">
              {t('form.details_ar')}
              </label>
              <input
                dir="rtl"
                type="text"
                className="form-control text-end"
                id="title_hint_ar"

                name="title_hint_ar"
                readOnly={!canEdit}
                value={data?.title_hint_ar  || ""}
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

                         {!submitting ? t('form.update') :  t('form.updating')}
                      </button>

                          <button type="button"  onClick={ () => setCanEdit(false)}    className="  btn  btn-secondary  mx-2">
                           
                          {t('form.cancel')}
                          </button>
                          </>
                        :   

                        <button  
                        onClick={handleCanEdit }
                        
                        className="  btn mx-2  btn-secondary">
                        {t('form.edit')} 
                        </button>
                    }

              </div>
            </form>

          </div>
        </div>



        <ListManagerProjectType />  
       
        <hr   />





    <CustomModal  
		id="prjectType_id"
		handleSubmit={handleSubmit}

 

		submitting={submitting}
		message={  t('form.modal_msg')} 
		showModal={true} 
		isModalOpen={isModalOpen}
		setIsModalOpen={setIsModalOpen}

		/>  










    </div>



    )
}


export default ProjectTypeSection