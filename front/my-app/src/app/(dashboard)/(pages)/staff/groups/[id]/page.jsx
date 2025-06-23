 
'use client'


import { useParams } from 'next/navigation';
import GroupPermissionAasignOrRemoveSection from '@/app/(dashboard)/_components/jsx/groups/group_permission_assign/page';


const Page = () => {
	const {id} = useParams() 
 









    return (
 

		<div> 
		<div className="app-content-header  ">
  
  
 
  
		</div>
  
		<div className="app-content  ">
   
  
		  <div className="     min-vh-150 bg-white p-3 border rounded  " >
  
   
  
			{/* start edit user sections */}
   
  
		<GroupPermissionAasignOrRemoveSection group_id={id}/>
  
  
			{/* end edit user sections */}
  
			</div>
  
  
			</div>
  
  
  
  
  
  
  
  
  
  
  
  
  
		  </div>
	  )
  
}

export default Page