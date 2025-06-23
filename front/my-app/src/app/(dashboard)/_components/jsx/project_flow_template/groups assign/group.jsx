
'use client'
import { useState } from "react"
import { useEffect } from "react";
import { useCustomFetchMutation } from "@/app/(site)/_components/redux/features/siteApiSlice";
 



import { useLocale } from "next-intl";

 

export const GroupAasignOrRemove = ({allowedProcessGroups, setAllowedProcessGroups}) => {

	const [customFetch] = useCustomFetchMutation();
 
	const [allGroups, setAllGroups] = useState([])

	const locale = useLocale()
 
 

	const handleChange = (groupsId, isChecked) => {
		if (isChecked) {
			setAllowedProcessGroups((prev) => [...prev, groupsId]);
		} else {
			setAllowedProcessGroups((prev) => prev.filter((id) => id !== groupsId));
		}
	  };


	const fetchAllGroups = async () => {
		try {
		  const response = await customFetch({
			url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/staff/usersmanagment/group/`,
			method: "GET",
		  });	  
		  if (response && response.data) {	
			setAllGroups(response.data);
		  } else {
			console.log("Failed to get groups. Please try again.", response);
		
		  }
		} catch (error) {
		  console.error("Error fetching departments:", error);
		}
	  };
	  
 
 

useEffect(() => {
	fetchAllGroups() 
}, []);




	return(

 
 
		<div className="row "> 
		

			{allGroups.map( (group) => (
					<div key={group.id}className={` col-md-3  ms-2 ${locale === "ar" ? 'form-check-reverse' : 'form-check'} `} >
						<input
							className="form-check-input   "
							type="checkbox"
							name={group?.name}
							id={`${group?.id}_group_id`}
							checked={allowedProcessGroups.includes(group.id)} // Check if ID is in the list
							onChange={(e) => handleChange(group.id, e.target.checked)}

						/>
						<label className="form-check-label small" htmlFor={`${group?.id}_group_id`}>
							{group?.name}
						</label>
					</div>
				) )}

		</div>
 
 


	)
}


