'use client'
import React from "react";
import Slider from "react-slick";
 

const ImageSlider = ({clients}) => {



  // Images from the internet

  const images = [
    "/Images/QNB_Logo.png",
    "/Images/DHL.png",
    "/Images/emmatell.png",
    "/Images/pronet.png",
    "/Images/ByblosBank.png",
    "/Images/HARAM.png",
    "/Images/jica.png",
    "/Images/KINGDOM.png",
    "/Images/samanet-logo.png",
    "/Images/Layer 1.png",
    "/Images/الائتمان الأهلي.png",
    "/Images/الشام.png",

  ];

  // Slider settings
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    responsive: [
        {
          breakpoint: 1024,        // Example breakpoint for larger tablets
          settings: {
            slidesToShow: 3,
            slidesToScroll: 1,
          },
        },
        {
          breakpoint: 768,         // Standard tablet size
          settings: {
            slidesToShow: 2,
            slidesToScroll: 1,
          },
        },
        {
          breakpoint: 480,         // Mobile phones
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1,
          },
        },
      ],
  };

  return (
      <div className=" mx-5 ">

      <div className='sliderContainer  pb-5'>
            <Slider {...settings}>
              {/* {images.map((src, index) => (
                <div key={index} className='slide d-flex justify-content-center'>
                  <img src={src} alt={`Slide ${index + 1}`} className='image_slider' />
                </div>
              ))} */}


              {clients?.map((i) => (
                <div key={i.id} className='slide d-flex justify-content-center text-light'>
                  <img src={i.our_client_image}    className='image_slider' />
                </div>
              ))}



            </Slider>
          </div>
          
      </div>
  );
};

export default ImageSlider;
