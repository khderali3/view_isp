 
'use client'
 
 import ListManagerGroups from "@/app/(dashboard)/_components/jsx/groups/ListManager_groups"
 import { useSelector } from "react-redux";

const Page = () =>  {
	const {  permissions, is_superuser, is_staff  } = useSelector(state => state.staff_auth);

  if (!is_superuser && !(permissions?.includes('usersAuthApp.user_managment') && is_staff)) {
    return;
    } 



    
    return (
 

      <div> 
      <div className="app-content-header  ">


      </div>

      <div className="app-content  ">
 

        <div className=" min-vh-150 bg-white p-3 border rounded  " >



          {/* start section */}
 
          <ListManagerGroups />
 

          {/* end section */}

          </div>


          </div>













        </div>
    )

}




 export default Page 


 