"use client"


import { useLocale } from "next-intl"
import TicketLisenseComponent from "@/app/(dashboard)/_components/jsx/tickets/license/license_component"
import ProjectFlowLisenseComponent from "@/app/(dashboard)/_components/jsx/project_flow/license/license_component"
 
 const LicensesPage = () => {

    const locale = useLocale()


    return ( 



        <div> 
        <div className="app-content-header">

 

        </div>


        <div className="app-content">



          <div className="container-fluid  min-vh-150 bg-white p-3 border rounded " >

            


              <div className="container mt-2">
                  <div>  
                    {/* Company Name */}
                      <h5 className="text-secondary mb-2">
                        {locale === "ar" 
                          ? " إدارة التراخيص" 
                          : "License Management "}
                      </h5>

                  </div>

                  <hr />
 
 
              </div>

            <div className="container mt-4">

                <TicketLisenseComponent />
 
                <ProjectFlowLisenseComponent />

            </div>


              
              
          </div>
          

        </div>
      </div>




   
     )
}

export default LicensesPage