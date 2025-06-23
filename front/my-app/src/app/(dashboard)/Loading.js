// components/Loading.js



// import { getLocale } from "next-intl/server";

import { useLocale } from "next-intl";

const Loading =  () => { 

  // const locale = await getLocale()
  const locale =  useLocale()

  return(
    <div  className="form account_form d-flex align-items-center justify-content-center   min-vh-100  ">
      
      <h1 className=' '> {locale === "ar" ? "2-يرجى الإنتظار ...." : "2-kindly wait .... " }   </h1>
    </div>
  )

}
export default Loading;
