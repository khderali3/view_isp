


// import ProjectTypeSection from "@/app/(dashboard)/_components/jsx/projecttype/projectTypeMin"




// import ListManagerProjectFlowProductType from "@/app/(dashboard)/_components/jsx/projectFlow_product_type/product_Type_component/ListManager_projectflow_productType"

import ListManagerInstalledProducts from "@/app/(dashboard)/_components/jsx/projectFlow_installed_product/installed_product_component/ListManager_installed_products"

const Page = () => {



    return (

        <div> 
        <div className="app-content-header">

 

        </div>

        <div className="app-content">



          <div className="container-fluid  min-vh-150 bg-white p-3 border rounded " >



{ /*  start  sections   */}
 
      <ListManagerInstalledProducts />
 

{ /*  end  sections   */}

          </div>
          

        </div>
      </div>


    )
}

export default Page