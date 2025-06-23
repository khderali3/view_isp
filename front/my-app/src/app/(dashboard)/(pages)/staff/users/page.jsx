"use client"
import { useState, useEffect } from "react"
import { useCustomFetchMutation } from "@/app/(dashboard)/_components/redux_staff/features/authApiSlice"
 import { useRouter } from "next/navigation"
import { toast } from "react-toastify"

import { useRef } from "react"

import { useTranslations } from "next-intl"
import Link from "next/link"

import { useSelector } from "react-redux";

import {useLocale} from "next-intl"

const Page = () => {
    const locale = useLocale()

    const [data, setData] = useState([])
    const [loading, setLoading] = useState(false)
    const [searchQuery, setSearchQuery] = useState('')
    const [customFetch] = useCustomFetchMutation()
    const baseUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/staff/usersmanagment/users/` 
    const isInitialLoad = useRef(true);
    const router = useRouter()

    const t = useTranslations('dashboard.users_managment.users')

    const {  permissions, is_superuser, is_staff  } = useSelector(state => state.staff_auth);



   const  handleSearchChange = (e) => {
    setSearchQuery(e.target.value)
   }




   const handleEditUser = (user_id) => {
    router.push(`/staff/users/edit_user/${user_id}`)
   }

   const fetchData = async ( fetchUrl) => {
    setLoading(true)
		try {
		  const response = await customFetch({
			url: fetchUrl,
			method: 'GET', // Only use 'GET' for fetching data
			headers: {
			  'Content-Type': 'application/json',
			}, 
		  });
	 
      if (response && response.data ) {
          setData(response.data)
           
      } 

	
		} catch (error) {
		  console.error("Error fetching data:", error);
		} finally{setLoading(false)}
	  };



    useEffect(() => {
      if (isInitialLoad.current) {
        isInitialLoad.current = false; // Mark the initial load as complete
        return;
      }

 
      const performSearch = () => {
        const queryParams = new URLSearchParams({
          q: searchQuery.trim(),
        });
  
        // Construct the full URL with query parameters
        const searchUrl = `${baseUrl}?${queryParams.toString()}`;
        fetchData(searchUrl); // Fetch with new search criteria
      };
      const timeoutId = setTimeout(() => {
        performSearch();
      }, 1000); // 3-second delay
  
      return () => clearTimeout(timeoutId);
 
    }, [searchQuery]);




    useEffect(() => {
      
      fetchData(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/staff/usersmanagment/users/`)

    }, []);

    if (!is_superuser && !(permissions?.includes('usersAuthApp.user_managment') && is_staff)) {
      return;
    }    

    return (

        <div> 
        <div className="app-content-header">


 

        </div>

        <div className="app-content">



          <div className="container-fluid  min-vh-150 bg-white p-3 border rounded " >



{ /*  start  sections   */}



<div className="  mt-1 mb-5 pb-5 ms-2  me-2 ">
 
 
<div className="row">
<div className="col-12 col-md-6  ">
  <h1 className="mb-2">{t('title')}</h1>
</div>
<div className="col-12 col-md-6 d-flex justify-content-md-end">
  <button type="button" onClick={ () => router.push('/staff/users/add_user')  }    className="btn btn-outline-secondary"> 
 
    {t( "add_new_user_btn") }
    </button>
</div>
</div>


  <hr />
  <div className=" ">
    <div className="  mb-3">
      <div
        className="container-fluid"
         
      >
        <form className="pb-2">
          <div className="row ">






            <div className="col-md-5 col-12 pt-2">
              <label htmlFor="search_words"> {t('Search_for_users')} </label>
              <input
                type="text"
                className="form-control  "
                id="search_words"
                placeholder={t('search_here')}
                aria-describedby="search"
                value={searchQuery}
                onChange={handleSearchChange}
              />
                  <div id="search_wordsHelp" className="form-text">{searchQuery.trim() && `${ t('results_for') } : ${searchQuery}` }

                  </div>

            </div>

 

            <div className="col-md-5 col-12 pt-2">

              {/* <UsersSearchInput handleUserIdChange={handleUserIdChange} userId={userId}/> */}
             </div>

          </div>

 

        </form>
      </div>
    </div>
  </div>


  <table className="table table-striped d-none d-md-table ">
    <thead>
      <tr>
        <th scope="col">{t('Email')}</th>
        <th scope="col">{t('First_Name')}</th>
        <th scope="col">{t('Last_Name')}</th>
        <th scope="col">{t('Is_Staff')}</th>
        <th scope="col">{t('Is_Super_User')}</th>
        <th scope="col"> {t('Edit')} </th>
      </tr>
    </thead>
    <tbody>
      {data?.map((user_obj) => (
        <tr key={`table_${user_obj.id}`}>
          <td>
 
            {user_obj.email}

          </td>
          <td> {user_obj.first_name}</td>
          <td> {user_obj.last_name} </td>
          <td>{user_obj.is_staff ? t('yes') : t('no') }</td>
          <td>{user_obj.is_superuser ? t('yes') : t('no') }</td>
          <td>    
            <a
                href="#"
                className="text-primary "
                title={t('Edit')}
                onClick={(e) => {
                    e.preventDefault(); 
                    handleEditUser(user_obj.id)
                }}
              
                >
                <i className="bi bi-pencil-fill"></i>
            </a>


          </td>
        </tr>
      ))}
    </tbody>
  </table>

  {/* Loading Indicator */}
  {loading && (
    <div className="text-center mt-4">
      <p>{t('Loading_more')}</p>
    </div>
  )}



 
  {/* Card View for smaller screens */}
  <div className="d-block d-md-none">
    {data.map((user_obj) => (
      <div className="card mb-3" key={`card_${user_obj.id}`}>
        <div className="card-body">

          <p>
            <strong>{t('Email')} : </strong> {user_obj.email}
          </p>
          <p>
            <strong>{t('First_Name')} : </strong> {user_obj.first_name}
          </p>
          <p>
            <strong>{t('Last_Name')} : </strong> {t('Last_Name')}
            
          </p>
          <p>
            <strong>{t('Is_Staff')} : </strong> {user_obj.is_staff ? t('yes') : t('no') }
          </p>
          <p>
            <strong>{t('Is_Super_User')} : </strong> {user_obj.is_superuser ? t('yes') : t('no') }
          </p>
          <p>
            <strong>{t('Edit')} : </strong>
           

            <Link
                href="#"
                className="text-primary "
                title={t('Edit')}
                onClick={(e) => {
                    e.preventDefault(); 
                    handleEditUser(user_obj.id)
                }}
              
                >
                <i className="bi bi-pencil-fill"></i>
            </Link> 


          </p>
 
        </div>
      </div>
    ))}
  </div>


   
</div>
 



 

{ /*  end  sections   */}

          </div>
          

        </div>
      </div>


    )
}

export default Page