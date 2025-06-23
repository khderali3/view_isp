// "use client";

// import { useEffect, useState } from "react";
// import { useParams } from "next/navigation";
// import { useLocale } from "next-intl";
 
import { getLocale } from "next-intl/server";
import { Suspense } from "react";


import { ButtonProjectApplyNow } from "@/app/(site)/_components/jsx/button_project_apply_now";
import { ProjectDetailsImagesPreview } from "@/app/(site)/_components/jsx/project_details_images";




const ProjectDetailsComponent = async ({ params }) => {
  // const { slug } =  useParams();

  const {slug} = await params

  // const [data, setData] = useState(null);
  let data = null;
  let loading = true

  // const [loading, setLoading] = useState(true);

  const locale = await getLocale();




  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/site/project/${slug}`, {
      cache: "no-store",
    });
  
    if (!res.ok) {
      const errorText = await res.text(); // Read response body (if any)
      console.error(`Failed to fetch project data. Status: ${res.status}, Response: ${errorText}`);
    } else {
      data = await res.json();
    }
  } catch (error) {
    console.error('Error fetching project data:', error.message || error);
  } finally {
    loading = false
  }

  

  if (!data) {
    return (
      <div className="products-info d-flex justify-content-center align-items-center">
        <p className="fs-6 text-light text-center">Project not found.</p>
      </div>
    );
  }

 
  return (
    <div className="products-info">
      <div className="container">
        <div className="row">
          <div className="col">
            <div className="product-desc w-100 d-flex flex-column justify-content-center align-items-center mt-5">


              
            {/* start   images */}

          <ProjectDetailsImagesPreview main_image={data?.main_image} extra_images={data?.extra_images} />

            {/* end   images */}



              {/* Project Description */}
              <div className="text mt-5 mb-5 col-md-10 col-12">
                <h2 className="text-light text-bolder col-12 fs-1">
                  {locale === "ar" ? data?.project_name_ar : data?.project_name}
                  <p>{locale === "ar" ? data?.project_name_hint_ar : data?.project_name_hint}</p>
                </h2>
                <p className="fs-6 text-light" style={{ whiteSpace: "pre-line" }}>
                  {locale === "ar" ? data?.project_description_ar : data?.project_description}
                </p>

                {/* Attachment Files Section */}
                {data?.files && data?.files.length > 0 && (
                  
                  <div className="attachments ">
                    <hr />  
                    <p className="text-light  fs-8  mb-0 ">{locale === 'ar' ? 'المرفقات' : 'Attachments'} : </p>
                      {data?.files.map((file, index) => (
                          <div key={file.id}>
                            <a href={file.file} target="_blank" rel="noopener noreferrer" className="text-decoration-none">
                              {/* 📎  */}
                              <i className="fas fa-paperclip me-2"></i> {/* FontAwesome Paperclip Icon */}
                              {file.file_name}  {/* File Icon with Name */}
                            </a>
                          </div> 
                      ))}
                  </div>
                )}


              <div className="d-flex justify-content-center align-items-center"> 
                <ButtonProjectApplyNow projecttype_id={data?.id} />
              </div>


              </div>

            </div>
          </div>
        </div>






      </div>






    </div>
  );
};

 






const LoadingComponent = () => {


  return (
    <div className="products-info d-flex justify-content-center align-items-center">
      <p className="fs-6 text-light text-center">Loading project...</p>
    </div>
  );



}





export default function Page({ params }) {
  return (
    <Suspense fallback={<LoadingComponent />}>
      <ProjectDetailsComponent params={params} />
    </Suspense>
  );
}