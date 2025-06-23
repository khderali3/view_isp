


import ResetPasswordForm from "@/app/(site)/_components/forms/ResetPasswordForm"


export const metadata = {
  title : ' CloudTech Sky |reset password page',
  description : ' CloudTech Sky |reset password page '
}

import { useTranslations } from "next-intl"

const resetPassword = () => {


  const t = useTranslations('site.account.reset_password')


    return <>


<div className="registration-form d-flex align-items-center justify-content-center background-color min-vh-100 ">
    <div className="col-lg-4 col-md-6 col-10 ">
    <h1 className="h3 mb-3 mt-5 fw-normal text-light text-center ">
      {/* Reset Password Page */}
      {t('title')}    
    </h1>

      <ResetPasswordForm />

      </div>
</div>


   
    </>
}


export default resetPassword