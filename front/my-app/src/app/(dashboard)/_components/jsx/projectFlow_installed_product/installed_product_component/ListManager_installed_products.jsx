'use client'
import { useState, useEffect, useRef } from "react";
import { useCustomFetchMutation } from "@/app/(dashboard)/_components/redux_staff/features/authApiSlice"
import { toast } from "react-toastify";

  
 
import { AddNewObject } from "./add_new_object";


 
import { EditModalComponent } from "./edit_object/edit_modal";



import { useTranslations, useLocale } from "next-intl";
 

import { DeleteButton } from "./delete_object";

import { useParams } from "next/navigation";


import Link from "next/link";

export default function ListManagerInstalledProducts() {


    const [selectedItemToEeditId, setSelectedItemToEeditId] = useState(null);
	const {projectflow_id} = useParams()



  const [data, setdata] = useState([]);
 
 

  const t = useTranslations('dashboard.site_managment.our_product.list_manager')
  const locale = useLocale()

  const [reloadFlag, setReloadFlag] = useState(false)

  const handleReloadFlag = () => {
 	setReloadFlag(!reloadFlag)
   }

  const isFirstLoad = useRef(true)

   

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

	fetchData(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/staff/projectflow/projectflow/${projectflow_id}/installed_product/`)
}, [reloadFlag]);


useEffect(() => {

	fetchData(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/staff/projectflow/projectflow/${projectflow_id}/installed_product/`)
}, []);





  return (
    <div className="container mt-5">

		<div className="d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center mb-2 gap-1">
			<h6 className="mb-0">List item Installed Product</h6>
			<Link href={`/staff/projectFlow/projectFlow/projectFlowDetails/${projectflow_id}`}>
				Back to ProjectFlow Details
			</Link>
		</div>


 
		
		<div className="table-responsive">
		<table className="table table-bordered table-sm align-middle text-wrap mt-4 w-100">
			<thead className="table-light">
			<tr>
				<th className="small">#</th>
				<th className="small">Product Name</th>
				<th className="small">Serial Number</th>
				<th className="small">note</th>
				<th className="small">Private Note</th>
				<th className="small">{t('actions')}</th>
			</tr>
			</thead>
			<tbody>
			{data && data.length > 0 ? (
				data.map((item, index) => (
				<tr key={item.id}>
					<td className="small">{index + 1}</td>
					<td  className="small">{item?.product_info?.name}</td>
					<td  className="small">{item?.serial_number}</td>
					<td  className="small">{item?.note}</td>
					<td  className="small">{item?.private_note}</td>
 
					<td className="text-nowrap small">
					<Link
						href="#"
						onClick={(e) => {
						e.preventDefault();
						setSelectedItemToEeditId(item.id);
						}}
						className="text-primary mx-2"
						title="Edit"
					>
						<i className="bi bi-pencil-fill"></i>
					</Link>
					<DeleteButton projectflow_id={projectflow_id} item_id={item.id} handleReloadFlag={handleReloadFlag} />
					</td>
				</tr>
				))
			) : (
				<tr>
				<td colSpan="6" className="text-center text-muted small py-3">
					No product installed type available
				</td>
				</tr>
			)}
			</tbody>
		</table>
		</div>







	  <AddNewObject handleReloadFlag={handleReloadFlag} projectflow_id={projectflow_id} />






 

		{selectedItemToEeditId && 
		<EditModalComponent
			projectflow_id={projectflow_id}
			id={selectedItemToEeditId}
			onClose={() => setSelectedItemToEeditId(null)} 
			handleReloadFlag={ handleReloadFlag }
		 />}



    </div>





  );
}
