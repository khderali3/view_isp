

import 'bootstrap-icons/font/bootstrap-icons.css';
 
import '@/app/(dashboard)/_components/assets/css/adminlte.css';  

 

import "@/app/globals.css";

import Script from 'next/script';

import Footer from "./_components/jsx/footer/footer";
import Nav from "./_components/jsx/nav/nav";
import SideBar from "./_components/jsx/sidebar/sidebar";
import CustomProviderStaff from"@/app/(dashboard)/_components/redux_staff/provider"
import StaffSetup from "@/app/(dashboard)/_components/utils/setup";



import RequireAuthStaff from "./_components/utils/requireAuth";


import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";


export const metadata = {
  title: 'CloudTech Sky',
  description: 'AdminLTE v4 Dashboard Template',
};

export default async function Layout({ children }) {

  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html 
    
 
    lang={locale}
    dir={ locale === "ar" ? "rtl" : "ltr"}
    >
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
 
  
      </head>


      <body className="layout-fixed   sidebar-expand-lg bg-body-tertiary">
  <NextIntlClientProvider messages={messages}>
    <CustomProviderStaff> 
      <StaffSetup />

      <div className="app-wrapper">
            <Nav />
            <SideBar />
          <main className="app-main ">
          <RequireAuthStaff > 
            {children}
          </RequireAuthStaff>
          </main>
            <Footer />
      </div>

    </CustomProviderStaff>
  </NextIntlClientProvider>
 
      <Script src="/js/bootstrap.bundle.min.js"  strategy="afterInteractive"/>

      <Script src="/js/adminlte.js" strategy="afterInteractive" />


      </body>
    </html>
  );
}
