'use client';

import { useEffect } from "react";
import { useSelector } from "react-redux";
import Link from "next/link";
import { usePathname } from "next/navigation";

import LanguageSwitcherComponent from "./sidebar_components/languge_switcher";

import { useTranslations, useLocale } from "next-intl";






const SideBar = () => {
  const { isLoading, isAuthenticated, permissions, is_superuser, is_staff } = useSelector(state => state.staff_auth);
  const pathname = usePathname();

  const locale = useLocale()
 

 
  const hasPermissionToLogsView = () => {
    if (is_superuser || (permissions?.includes('usersAuthApp.logs_view') && is_staff)) {
        return true
    }
      return false
  }






  const t = useTranslations('dashboard.sidebar')





  const isActive = (route, isExact=false) => {

    if (isExact) {
      return pathname === route
    } else {
      return  pathname.startsWith(route)
    }
    
  
  };


useEffect(() => {
  

}, [isAuthenticated]);  

  // if(isAuthenticated && isLoading === false){
    return (


      <aside
      className={`app-sidebar bg-primary-subtle shadow  ${!isAuthenticated && 'not_showing' }  collapse show  sidebar    ` }  id="sidebar" 
      data-bs-theme="dark"
      

    >

      <div className="sidebar-brand">


        <Link href="/staff" className="brand-link">
          {/*begin::Brand Image*/}
          <img
            src="/Images/AdminLTELogo.png"
            alt="AdminLTE Logo"
            className="brand-image opacity-75 shadow ms-2"
          />{" "}
          {/*end::Brand Image*/} {/*begin::Brand Text*/}
          <span className="brand-text fw-light">CloudTech</span>

        </Link>

      </div>

      <div className="sidebar-wrapper      " >

        <nav className="mt-2     min-vh-150  "   >
 


          { (permissions?.includes('usersAuthApp.user_managment') || is_superuser) &&
              <ul className="nav sidebar-menu flex-column    ">
              <li className="nav-item ">
                    <a
                        className="nav-link"
                        data-bs-toggle="collapse"
                        data-bs-target="#users_managment"
                        aria-expanded="false"
                        role="button"
                      >
                        <i className="nav-icon bi bi-speedometer" />
                        <p>
                          {/* Users Management */}
                            {t("users_managment.title")}

                          <i className="nav-arrow bi bi-chevron-right" />
                        </p>
                    </a>
                </li>


                  <ul className=" collapse nav ps-2 " id="users_managment" >

                    <li className="nav-item text-light w-100">
                      <Link href="/staff/users" className={` rounded text-light nav-link ${isActive('/staff/users') ? ' active_class' : '' }  `}  >
                      <i className={`nav-icon bi bi-circle   `} />
                      <p>{t("users_managment.users")} </p>

                      </Link>
                    </li>


                    <li className="nav-item text-light w-100">
                      <Link href="/staff/departments" className={` rounded text-light nav-link ${isActive('/staff/departments') ? ' active_class' : '' }  `}  >
                      <i className={`nav-icon bi bi-circle   `} />
                      <p>{t("users_managment.departments")} </p>

                      </Link>
                    </li>



                    <li className="nav-item text-light w-100">
                      <Link href="/staff/groups" className={` rounded text-light nav-link ${isActive('/staff/groups') ? ' active_class' : '' }  `}  >
                      <i className={`nav-icon bi bi-circle   `} />
                      <p>{t("users_managment.groups")} </p>

                      </Link>
                    </li>




                  </ul>
            </ul>          
          
          }

 

          <ul className="nav sidebar-menu flex-column   ">
            <li className="nav-item">
                  <a
                      className="nav-link"
                      data-bs-toggle="collapse"
                      data-bs-target="#Ticket_Managment"
                      aria-expanded="false"
                      role="button"
                    >
                      <i className="nav-icon bi bi-speedometer" />
                      <p>
                      {t("ticket_managment.title")}
                        <i className="nav-arrow bi bi-chevron-right  " />
                      </p>
                  </a>
            </li>

                <ul className=" collapse nav ps-2" id="Ticket_Managment" >

                  <li className="nav-item text-light w-100 ">
                    <Link href="/staff/ticket" className={` rounded text-light nav-link    ${isActive('/staff/ticket', true) ? ' active_class' : '' }     `}  >
                    <i className= 'nav-icon bi bi-circle '  />
                    <p> {t("ticket_managment.all_tickets")}</p>

                    </Link>
                  </li>


                  <li className="nav-item text-light w-100 ">
                    <Link href="/staff/ticket/my-tickets" className={` rounded text-light nav-link    ${isActive('/staff/ticket/my-tickets', true) ? ' active_class' : '' }     `}  >
                    <i className= 'nav-icon bi bi-circle '  />
                    <p>{t("ticket_managment.my_tickets")}</p>

                    </Link>
                  </li>


                </ul>

 

          </ul>

 



          <ul className="nav sidebar-menu flex-column   ">
            <li className="nav-item">
                  <a
                      className="nav-link"
                      data-bs-toggle="collapse"
                      data-bs-target="#Project_Managment"
                      aria-expanded="false"
                      role="button"
                    >
                      <i className="nav-icon bi bi-speedometer" />
                      <p>
                        {/* Project Managment */}
                        {t("projects_managment.main_title")}
                        <i className="nav-arrow bi bi-chevron-right  " />
                      </p>
                  </a>
            </li>

                <ul className=" collapse nav ps-2" id="Project_Managment" >

                  <li className="nav-item text-light w-100 ">
                    <Link href="/staff/projectFlow/projectType" className={` rounded text-light nav-link    ${isActive('/staff/projectFlow/projectType', true) ? ' active_class' : '' }     `}  >
                    <i className= 'nav-icon bi bi-circle '  />
                    <p>{t("projects_managment.project_type")}</p>

                    </Link>
                  </li>


                  <li className="nav-item text-light w-100 ">
                    <Link href="/staff/projectFlow/projectFlowTemplate" className={` rounded text-light nav-link    ${isActive('/staff/projectFlow/projectFlowTemplate', true) ? ' active_class' : '' }     `}  >
                    <i className= 'nav-icon bi bi-circle '  />
                    <p>{t("projects_managment.flow_template")}</p>

                    </Link>
                  </li>


                  <li className="nav-item text-light w-100 ">
                    <Link href="/staff/projectFlow/productsType" className={` rounded text-light nav-link    ${isActive('/staff/projectFlow/productsType', true) ? ' active_class' : '' }     `}  >
                    <i className= 'nav-icon bi bi-circle '  />
                    <p>{t("projects_managment.products_type")}</p>
                    </Link>
                  </li>
 





                  <li className="nav-item text-light w-100 ">
                    <Link href="/staff/projectFlow/projectFlow" className={` rounded text-light nav-link    ${isActive('/staff/projectFlow/projectFlow', true) ? ' active_class' : '' }     `}  >
                    <i className= 'nav-icon bi bi-circle '  />
                    <p>{t("projects_managment.project_flow")}</p>
                    </Link>
                  </li>




                </ul>

 







          </ul>

 
          {hasPermissionToLogsView() &&
              
              <ul className="nav sidebar-menu flex-column   ">
                <li className="nav-item">
                      <a
                          className="nav-link"
                          data-bs-toggle="collapse"
                          data-bs-target="#Logs_Managment"
                          aria-expanded="false"
                          role="button"
                        >
                          <i className="nav-icon bi bi-speedometer" />
                          <p>
                            {locale === 'ar' ? 'السجلات' : 'Logs'}
                            <i className="nav-arrow bi bi-chevron-right  " />
                          </p>
                      </a>
                </li>

                    <ul className=" collapse nav ps-2" id="Logs_Managment" >



                      <li className="nav-item text-light w-100 ">
                        <Link href="/staff/logs/audit_logs" className={` rounded text-light nav-link    ${isActive('/staff/logs/audit_logs', true) ? ' active_class' : '' }     `}  >
                        <i className= 'nav-icon bi bi-circle '  />
                        <p>{locale === 'ar' ? 'سجلات التدقيق' : 'Audit Logs'}</p>
                        </Link>
                      </li>


                      <li className="nav-item text-light w-100 ">
                        <Link href="/staff/logs/error_logs" className={` rounded text-light nav-link    ${isActive('/staff/logs/error_logs', true) ? ' active_class' : '' }     `}  >
                        <i className= 'nav-icon bi bi-circle '  />
                        <p>{locale === 'ar' ? 'سجلات الأخطاء' : 'Eroor Logs'}</p>
                        </Link>
                      </li>


                    </ul>

    

              </ul>

          }


          <ul className="nav sidebar-menu flex-column   ">
            <li className="nav-item">
                  <a
                      className="nav-link"
                      data-bs-toggle="collapse"
                      data-bs-target="#licenses_Managment"
                      aria-expanded="false"
                      role="button"
                    >
                      <i className="nav-icon bi bi-speedometer" />
                      <p>
                        {locale === 'ar' ? 'التراخيص' : 'licenses'}
                        <i className="nav-arrow bi bi-chevron-right  " />
                      </p>
                  </a>
            </li>

                <ul className=" collapse nav ps-2" id="licenses_Managment" >



                  <li className="nav-item text-light w-100 ">
                    <Link href="/staff/licenses" className={` rounded text-light nav-link    ${isActive('/staff/licenses', true) ? ' active_class' : '' }     `}  >
                    <i className= 'nav-icon bi bi-circle '  />
                    <p>{locale === 'ar' ? 'كافة التراخيص' : 'All Licenses'}</p>
                    </Link>
                  </li>




                </ul>



          </ul>










 

        <LanguageSwitcherComponent />





        </nav>
      </div>

    </aside>




  )



}

export default SideBar