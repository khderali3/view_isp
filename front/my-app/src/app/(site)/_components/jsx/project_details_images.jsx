
'use client'

import { useState } from "react"



export const ProjectDetailsImagesPreview = ({main_image, extra_images}) => {

    const [mainImage, setMainImage] = useState(main_image);
    // Combine main image with extra images for the image list
    const allImages = [main_image, ...(extra_images?.map(img => img.file) || [])];



    return(
        <>
        
              {/* Main Image */}
              <div className="product-img">
                <img
                  src={mainImage}
                  alt="Main Project Image"
                  className="image_product_dait"
                  style={{ width: "100%", maxHeight: "500px", objectFit: "contain" }}
                />
              </div>


            {/* Extra Images */}
            <div className="mt-3 row g-2 d-flex flex-wrap justify-content-center">
              {allImages.map((image, index) => (
                <div className="col-auto p-2" key={index}>  {/* col-auto prevents forced stretching */}
                  <img
                    src={image}
                    alt={`Image ${index}`}
                    className={`img-thumbnail ${image === mainImage ? "border border-3 border-success" : ""}`}
                    onClick={() => setMainImage(image)}
                    style={{
                      width: "100px",
                      height: "100px",
                      objectFit: "contain",
                      cursor: "pointer",
                    }}
                  />
                </div>
              ))}
            </div>

        
        
        
        
        
        
        </>





    )
}