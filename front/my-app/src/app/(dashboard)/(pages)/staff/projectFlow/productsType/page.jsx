


// import ProjectTypeSection from "@/app/(dashboard)/_components/jsx/projecttype/projectTypeMin"




import ListManagerProjectFlowProductType from "@/app/(dashboard)/_components/jsx/projectFlow_product_type/product_Type_component/ListManager_projectflow_productType"


const Page = () => {



    return (

        <div> 
        <div className="app-content-header">

 

        </div>

        <div className="app-content">



          <div className="container-fluid  min-vh-150 bg-white p-3 border rounded " >



{ /*  start  sections   */}
 
      <ListManagerProjectFlowProductType />
 

{ /*  end  sections   */}

          </div>
          

        </div>
      </div>


    )
}

export default Page