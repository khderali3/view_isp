 

import Link from "next/link";


import LoginForm from "@/app/(site)/_components/forms/LoginForm";
import LogingWithGoogle from "@/app/(site)/_components/jsx/loginpage/loginwithgooglebutton";
 



export const metadata = {
	title: 'Full Auth | Login',
	description: 'Full Auth login page',
};


import { getTranslations } from "next-intl/server";

const loginPage = async () => {

  const t = await getTranslations('site.account.login')

    return <>
  <div className="registration-form d-flex align-items-center justify-content-center background-color min-vh-100 ">
    <div className="col-lg-4 col-md-6 col-10 ">
    <h1 className="h3   fw-normal text-light text-center ">
      {/* Login Page */}
      {t('page_title')}
    </h1>

  <LoginForm />

      <p className="text-center text-light mt-4 mb-2">
          {/* Not a Member? */}
          {t('Not_a_member')}
          <a href="/account/register" className="p-1 text-decoration-none">
            {/* Register */}
            {t('register')}
          </a>
      </p>

      <p className="or text-muted text-center m-1">
        <span className="text-mute">{t('or')}</span>
      </p>


      <LogingWithGoogle btn_text={t('sign_in_with_google_btn_txt')} />

 




  </div>

  </div>

 







    
    </>
}


export default loginPage