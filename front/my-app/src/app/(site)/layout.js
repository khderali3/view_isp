
 
import "@/app/(site)/_components/assets/css/org_bootstrap.min.css"
 

import "@/app/(site)/_components/assets/css/all.min.css"
import "@/app/(site)/_components/assets/css/style.css"

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import "@/app/globals.css";

 

import Head from "next/head";


import Provider from "@/app/(site)/_components/redux/provider";


import { Nav } from "@/app/(site)/_components/jsx/nav";
import Script from "next/script";
import { Footer } from "@/app/(site)/_components/jsx/footer";
import Setup from "@/app/(site)/_components/utils/setup";

import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";
 



 

export default  async function   RootLayout({ children }) {

  const locale = await getLocale();
  const messages = await getMessages();
 

  return (
  
     
    <html 
    // lang="en"
    lang={locale}
    dir={ locale === "ar" ? "rtl" : " ltr"}
    // dir= "auto" 
    >


    <head>

    <meta charSet="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      <link
        href="https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap"
        rel="stylesheet"
      />
         <link rel="manifest" href="/manifest.json" />
         <meta name="theme-color" content="#000000" />



      <link
        href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/font/bootstrap-icons.css"
        rel="stylesheet"
      />



     </head>

      
      <body >

  <NextIntlClientProvider messages={messages}>
    <Provider> 
 
      <Setup />
      <Nav /> 

      <div className="  min-vh-100 "> 


      
        {children} 
      
         


      </div>
      <Footer />
 
    </Provider >
   
  </NextIntlClientProvider>

  
        <Script src={`${process.env.NEXT_PUBLIC_FRONTEND_URL}/js/bootstrap.bundle.min.js`} />


      </body>
    </html>

   
  );
}



