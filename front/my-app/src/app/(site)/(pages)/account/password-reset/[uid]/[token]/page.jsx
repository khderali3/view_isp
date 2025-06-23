

import PasswordResetConfirmForm from "@/app/(site)/_components/forms/PasswordResetConfirmForm";


export const metadata = {
	title: 'CloudTECH SKY | Password Reset Confirm',
	description: 'CloudTECH sky password reset confirm page',
};



import { getTranslations } from "next-intl/server";
const  resetPasswordConfirm = async ( { params } ) => {

    const {uid, token} = await params
    const t = await getTranslations('site.account.reset_password_set')


    return (
        <>
        
        <div className="registration-form d-flex align-items-center justify-content-center background-color min-vh-100 ">
        <div className="col-lg-4 col-md-6 col-10 ">
        <h1 className="h3 mb-3 mt-5 fw-normal text-light text-center ">
                {/* Reset Your Password */}
                {t('title')}
         </h1>

        <PasswordResetConfirmForm  uid={uid} token={token} />


        </div>
        </div>



        </>
    )
}

export default resetPasswordConfirm
