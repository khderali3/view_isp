
'use client';

import { useState, useEffect } from "react";
import { useCustomFetchMutation } from "@/app/(site)/_components/redux/features/siteApiSlice";
import { toast } from "react-toastify";
import { useDispatch } from 'react-redux';
import { setprofileImage } from "@/app/(site)/_components/redux/features/authSlice";


import { useTranslations, useLocale } from "next-intl";
const Page = () => {

        const t = useTranslations('site.account.edit_profile.form')
        const locale = useLocale()

        const [canEdit, setCanEdit] = useState(false)

        const [customFetch] = useCustomFetchMutation();
        const [loading, setLoading] = useState(false)
        const [selectedFile, setSelectedFile] = useState(null)
        const [PRF_image_delete, setPRF_image_delete] =  useState(false)
        const dispatch = useDispatch();

        const [data, setData] = useState({
            first_name: "",
            last_name: "",
            PRF_company: "",
            PRF_country: "",
            PRF_city: "",
            PRF_address: "",
            PRF_phone_number: "",
            PRF_image: null,            
          });

 // Handle form submission
 const handleSubmit = async (e) => {
    e.preventDefault();
    const form = new FormData();
    // Append text fields to form data
    form.append("first_name", data.first_name);
    form.append("last_name", data.last_name);
    form.append("PRF_company", data.PRF_company || "");
    form.append("PRF_country", data.PRF_country || "");
    form.append("PRF_city", data.PRF_city || "");
    form.append("PRF_address", data.PRF_address || "");
    form.append("PRF_phone_number", data.PRF_phone_number || "");


    if(selectedFile instanceof File  ) {
        form.append("PRF_image", selectedFile);
    }
    if(PRF_image_delete) {
      form.append("PRF_image_delete", true);

    }


    try {
      // Send form data using customFetch mutation
      const response = await customFetch({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/jwt/profile/`,
        method: "POST",
        body: form, // Send FormData as the body
      });

      if( response && response.data){
        setCanEdit(false)

        if(locale === "ar") {
          toast.success("تم تحديث الملف الشخصي بنجاح");

        } else {
          toast.success("your profile has been updated ");

        }

        dispatch(setprofileImage(response?.data?.PRF_image))
        setPRF_image_delete(false)
        fetchData(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/jwt/profile/`)


      } else{
        console.log(response)

        if(locale === "ar"){
          toast.error("خطأ1 في تحديث الملف الشخصي");

        } else {
          toast.error("Error submitting form 1.");

        }
      }

    } catch (error) {
      console.error("Error submitting form:", error);

      if(locale === "ar"){
        toast.error("خطأ 2 في تحديث الملف الشخصي");

      } else {
        toast.error("Error submitting form2.");

      }
    }
      
  };

          const handleChange = (e) => {
            const { name, value, type, files } = e.target;

            if (type === "file") {
              // If the input is a file, update the selectedFile state
              setSelectedFile(files[0]);
            } else {
              // If the input is not a file, update the data state
              setData((prevState) => ({
                ...prevState,
                [name]: value,
              }));
            }
          };




   const  handleCanEdit = (e) => {
    e.preventDefault();
    setCanEdit(true)
   }

   const fetchData = async (pageUrl) => {
    setLoading(true);
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
    setLoading(false);
  };



useEffect(() => {
    fetchData(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/jwt/profile/`)

},[] );



useEffect(() => {
    

}, [canEdit]);


    return(




<div className="  form d-flex align-items-center justify-content-center background-color pb-5  ">
  

    <form className="col-lg-4 col-md-6 col-11  " onSubmit={handleSubmit}>
    <h1 className="h3 mt-5 mb-3 fw-normal text-light text-center">
      {/* Update Profile */}
      {t('form_title')}
    </h1>

    {/* Current Profile Image Section */}
    <div className="text-center mb-4  ">
      <img
        src={data?.PRF_image ? data.PRF_image : `data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBwgHBgkIBwgKCgkLDRYPDQwMDRsUFRAWIB0iIiAdHx8kKDQsJCYxJx8fLT0tMTU3Ojo6Iys/RD84QzQ5OjcBCgoKDQwNGg8PGjclHyU3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3N//AABEIAJQAswMBIgACEQEDEQH/xAAaAAEAAwEBAQAAAAAAAAAAAAAAAQIDBAUH/8QALBABAAICAAUDAgUFAAAAAAAAAAECAxEEEjFBUSEycZGhEyJSYbEUIzNCgf/EABUBAQEAAAAAAAAAAAAAAAAAAAAB/8QAFBEBAAAAAAAAAAAAAAAAAAAAAP/aAAwDAQACEQMRAD8A+4gAAAAAAAAiZ13BIrzx5OevkFhEWiZ9JhIAAAAAAAAAAAAAAAAClrxHyre+/SOigLTaZ+PCoAAAJiZjogBpGTtZeJjswTW01BuIrMTHokAAAAAAAAAABlktv0jovedV/diAAACJmIjczqPIJGFuKpHtibfZEcVH6J+oOgUx5KXj8s7nvC4AAJrPLO20TtgvjtqdA1AAAAAAAABEzqJBled2VAAAETOomZ6Q4cuT8S2+3aHTxVtY4iO8uMABUTE6ncdXbhy/iV9fdHVwtuFtrLEdpRXYAAADes7hLPHPZoAAAAAAArf2yspk9sgyAAABz8X7K/LldvE158Xp2nbiUABBpg/y1+Wbbha82XfgHYAigAL4vdLVjj9zYAAAAAABW3SVgHOExqdAAADjz4ZrO6xM1/h2Im0R1mI+ZB5w7bUw268v/JRGLDHj6g5aUm86rDux0jHXlj6kTSI1E1j4lYAAAAF8XWWqmONVXAAAAAAAABnkjuzbzG40xtHLOgQplyRjruevaPK8zqJmekPPyXnJabSC2TNfJ1nUeIZgqGjQAajwmtppO6zqUAOvDxHPPLedW7T5bvNdvD358fr1j0RWqaxM2iOyGuOuo35BcAAAAAAAAABW1eaFgHHxO64rbcL18uOuWvLbo87Nw98XrPrXzCjEOwIAAAAN+En+5MeYZY6WyW1SJl38NwsYvzWndv4BpSneerUEUAAAAAAAAAAAAABhl4XFkneuW3mGF+Bt/peJ+YdwDzP6TN4ifiSOEzfp+70wHnV4LJPWax92+Pgsce+Zs6gEVrFY1WIiP2SAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP//Z`}
        alt="Current Profile"
        className="rounded-circle img-thumbnail"
        style={{ width: "150px", height: "150px", objectFit: "contain" }}
      />
    </div>

    <div className="form-floating pb-1">
      <input
        type="text"
        className="form-control "
        id="first_name"
        placeholder="First-Name"
        name="first_name"
        readOnly={!canEdit}
        value={data?.first_name  || ""}
        onChange={handleChange}
      />
      <label  htmlFor="first_name">
        {/* First Name */}
        {t('first_name')}
      </label>
    </div>

    <div className="form-floating pb-1">
      <input
        type="text"
        className="form-control"
        id="last_name"
        placeholder="Last-Name"
        name="last_name"
        readOnly={!canEdit}
        value={data?.last_name  || ""}
        onChange={handleChange}

      />
      <label htmlFor="last_name">
        {/* Last Name */}
        {t('Last_Name')}
      </label>
    </div>

    <div className="form-floating pb-1">
      <input
        type="text"
        className="form-control"
        id="PRF_country"
        placeholder="Country"
        name="PRF_country"
        readOnly={!canEdit}
        value={data?.PRF_country  || ""}
        onChange={handleChange}

      />
      <label htmlFor="PRF_country">
        {/* Country */}
        {t('Country')}
      </label>
    </div>

    <div className="form-floating pb-1">
      <input
        type="text"
        className="form-control"
        id="PRF_city"
        placeholder="City"
        name="PRF_city"
        readOnly={!canEdit}
        value={data?.PRF_city  || ""}
        onChange={handleChange}

      />
      <label htmlFor="PRF_city">
        {/* City */}
        {t('City')}

      </label>
    </div>



    <div className="form-floating pb-1">
      <input
        type="text"
        className="form-control"
        id="PRF_address"
        placeholder="City"
        name="PRF_address"
        readOnly={!canEdit}
        value={data?.PRF_address  || ""}
        onChange={handleChange}

      />
      <label htmlFor="PRF_city">
        {/* Address  */}
        {t('Address')}
      </label>
    </div>




    <div className="form-floating pb-1">
      <input
        type="text"
        className="form-control"
        id="PRF_company"
        placeholder="Company"
        name="PRF_company"
        readOnly={!canEdit}
        value={data?.PRF_company  || ""}
        onChange={handleChange}

      />
      <label htmlFor="PRF_company">
        {/* Company */}
        {t('Company')}

      </label>
    </div>

    <div className="form-floating pb-1">
      <input
        type="text"
        className="form-control"
        id="PRF_phone_number"
        placeholder="Phone-Number"
        name="PRF_phone_number"
        readOnly={!canEdit}
        value={data?.PRF_phone_number  || ""}
        onChange={handleChange}

      />
      <label htmlFor="PRF_phone_number">
        {/* Phone Number */}
        {t('Phone_Number')}
      </label> 
    </div>

    {/* Upload Image Section */}
    <div className="pb-3 mb-2">
      <label htmlFor="PRF_image" className="form-label text-light">
       {/* Upload New Profile Image */}
       {t('upload_img')}
      </label>
      <input
        type="file"
        className="form-control"
        id="PRF_image"
        name="PRF_image"
        accept="image/*"
        disabled={!canEdit}
        onChange={handleChange}
      />

    </div>


    <div className="pb-3" >
        <div className=" form-check  ">
          <input
            type="checkbox"
            // className="form-check-input"
            id="Delete-Image"
            name="Delete-Image"
            disabled={canEdit === true && data.PRF_image != null ? false : true}
            checked={PRF_image_delete}
            onChange={() => setPRF_image_delete(!PRF_image_delete)}
          />
          <label className="form-check-label ms-2 me-2   text-light  " htmlFor="Delete-Image">
            {/* Delete Currnet Profile Image */}
            {t('delete_current_img')}
          </label>
        </div>
    </div> 


    { canEdit === true ?
        <button  className="w-100 btn btn-lg btn-primary" type="submit">
            {/* Update Profile */}
            {t('update_profile')}

        </button>    
    
    :   

    <button  onClick={handleCanEdit }   className="w-100 btn btn-lg btn-danger">
      {/* Edit Profile */}
      {t('edit_profile')}

    </button>
    
    }




  </form>




   

</div>



    )
}


export default Page