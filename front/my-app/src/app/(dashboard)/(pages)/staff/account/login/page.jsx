

import Script from 'next/script';

import LoginPageComponent from "@/app/(dashboard)/_components/jsx/account/loginPage";

const LoginPage = () => {
  return (
    <>

      {/* <Script
        src="https://www.google.com/recaptcha/api.js"
        strategy="beforeInteractive" 
      /> */}

	  <LoginPageComponent />
    </>
  );
};

export default LoginPage;