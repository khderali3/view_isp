 'use client'



import MainUserEditInfoSection from "@/app/(dashboard)/_components/jsx/user_account/edit_user/main_user_information_section/main_user_info_sec"

import DepartmentAasignOrRemoveSection from "@/app/(dashboard)/_components/jsx/user_account/edit_user/department_assign/page"

import GroupAasignOrRemoveSection from "@/app/(dashboard)/_components/jsx/user_account/edit_user/group_assign/page";
import PermissionAasignOrRemoveSection from "@/app/(dashboard)/_components/jsx/user_account/edit_user/permission_assign/page";
import DeleteUserButton from "@/app/(dashboard)/_components/jsx/user_account/delete_user/deleteUser";
import { useParams } from 'next/navigation';
import SetNewUserPassword from "@/app/(dashboard)/_components/jsx/user_account/set_new_password/set_password";

 
import { useSelector } from "react-redux";
import { useLocale } from "next-intl";


const Page = () =>  {

	const {id} = useParams() 

  const locale = useLocale()
  const {  permissions, is_superuser, is_staff  } = useSelector(state => state.staff_auth);



  if (!is_superuser && !(permissions?.includes('usersAuthApp.user_managment') && is_staff)) {
    return;
  }  
  


    return (
 

      <div> 
      <div className="app-content-header  ">


 

      </div>

      <div className="app-content  ">
 

        <div className="     min-vh-150 bg-white p-3 border rounded  " >


          <div className="d-flex justify-content-between align-items-center">
            <h2>  {locale === "ar" ? "تعديل  حساب المستخدم" : "Edit User Account"}  </h2>
            <DeleteUserButton  user_id={id}/>
          </div>
 

          {/* start edit user sections */}
 

        <MainUserEditInfoSection user_id={id} />

        <DepartmentAasignOrRemoveSection user_id={id}   />
        <GroupAasignOrRemoveSection user_id={id} />
        <PermissionAasignOrRemoveSection  user_id={id}  /> 

        <SetNewUserPassword user_id={id}/>


          {/* end edit user sections */}

          </div>


          </div>

        </div>
    )

}




 export default Page 


 