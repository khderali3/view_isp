'use client'
import { useState, useEffect, useRef } from "react";
import { useCustomFetchMutation } from "@/app/(dashboard)/_components/redux_staff/features/authApiSlice"
import { toast } from "react-toastify";

import CustomModal from "@/app/(dashboard)/_components/jsx/myModal";
import { AddNewProjectComponent } from "./add_new_project";

import { EditModalComponent } from "./edit_project/edit_modal";


import { useTranslations, useLocale } from "next-intl";

import { DeleteButton } from "./delete_project";

import Link from "next/link";
import { getErrorMessage } from "@/app/public_utils/utils"; 



export default function ListManagerProjectType() {


    const [selectedItemToEeditId, setSelectedItemToEeditId] = useState(null);




  const [data, setdata] = useState([]);
  const [editingItem, setEditingItem] = useState({
	id:null,
	project_name:'',
	project_name_hint:'',
	project_description:'',
	project_name_ar:'',
	project_name_hint_ar:'',
	project_description_ar:'',
	main_image: '',
	is_published: false,
  });

  const t = useTranslations('dashboard.projectFlow.projectType.list_table')
  const locale = useLocale()

  const [reloadFlag, setReloadFlag] = useState(false)

  const handleReloadFlag = () => {
 	setReloadFlag(!reloadFlag)
  }

  const isFirstLoad = useRef(true)


 

  const [isModalOpen, setIsModalOpen] = useState(false); // State to control modal visibility


  const [deletingItemId, setDeletingItemId] = useState(null); // Track which item is being deleted

  const [itemIdToDelete, setItemIdToDelete] = useState(null)

 






		const [customFetch] = useCustomFetchMutation()


 

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
		setdata(response.data)
	  } else {
		
		if (response?.error?.data?.message) {
			toast.error(getErrorMessage(response.error.data.message));
		} else {
			console.log(response);
		}
	  }

	} catch (error) {
	  console.error("Error fetching data:", error);
	}
  };




useEffect(() => {
	if(isFirstLoad.current){
		isFirstLoad.current = false
		return;
	}

	fetchData(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/staff/projectflow/project_type/`)
}, [reloadFlag]);


useEffect(() => {

	fetchData(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/staff/projectflow/project_type/`)
}, []);





  return (
    <div className="container mt-5">
      <h6>{t('title')}</h6>

      {/* Table Display */}
      <table className="table table-bordered    mt-4">
        <thead className="table-light">
          <tr>
				<th style={{ width: '5%' }}>#</th>
				<th style={{ width: '35%' }}>{t('project_name')}</th>
				<th style={{ width: '35%' }}  >
					{t('project_name_ar')}
				</th>
				<th style={{ width: '25%' }}>{t('actions')}</th>
          </tr>
        </thead>
        <tbody>
          {data?.map((item, index) => (
            <tr key={item.id}>
              <td>{index +1}</td>
              <td dir='ltr' >{item.project_name}</td>
              <td className="text-end" >{item.project_name_ar}</td>
              <td>


				<Link 
					href='#'
					onClick={(e) => {
						e.preventDefault()
						setSelectedItemToEeditId(item.id)
						} 
					}

					className="text-primary mx-2" title={t('edit')}><i className="bi bi-pencil-fill"></i>

				</Link>

 


				<DeleteButton title={t('delete')} item_id={item.id} handleReloadFlag={handleReloadFlag}/>  
 
              </td>
            </tr>
          ))}
        </tbody>
      </table>



	  <AddNewProjectComponent handleReloadFlag={handleReloadFlag} />






	  {/* <CustomModal  
		id="list_manager_project_type"
		handleSubmit={ () =>   deleteItem(itemIdToDelete)}
		submitting={deletingItemId}
		message={ locale === 'ar' ? 'هل فعلا تريد حذف هذا العنصر' : 'are you shure you want to delete this item? '}
		operationType = "Delete"
		showModal={true} 
		isModalOpen={isModalOpen}
		setIsModalOpen={setIsModalOpen}

		/>   */}




		{selectedItemToEeditId && 
		<EditModalComponent
		 id={selectedItemToEeditId}
		 onClose={() => setSelectedItemToEeditId(null)} 
		 handleReloadFlag={ handleReloadFlag }
		 />}



    </div>





  );
}
