


import { useLocale } from "next-intl"

 

import {ProjectFlowStatisticsComponent} from "@/app/(dashboard)/_components/jsx/project_flow/statistics_component/statistics"
import { TicketStatisticsComponent } from "@/app/(dashboard)/_components/jsx/tickets/statistics_component/statistics"


 const HomeStaff = () => {
  const locale = useLocale()

    return ( 



        <div> 
        <div className="app-content-header">

 

        </div>


        <div className="app-content">



          <div className="container-fluid  min-vh-150 bg-white p-3 border rounded " >

            


              <div className="container mt-2">
                  <div>  
                    {locale === "ar" ? "إدارة تطبيق الويب - شركة كلاود تك سكاي" : " CloudTech Sky - Web Application Managment System"}
                    
                  </div>

                  <hr />
 
 
              </div>

            <div className="container">

              <ProjectFlowStatisticsComponent />  
                  <hr />
              <TicketStatisticsComponent />  

            </div>


              
              
          </div>
          

        </div>
      </div>




   
     )
}

export default HomeStaff