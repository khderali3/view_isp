
'use client';

import { redirect } from 'next/navigation';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';


import { useLocale } from 'next-intl';

export default function RequireAuthComponent({ children }) {
  const { isLoading, isAuthenticated, is_superuser, is_staff  } = useSelector(state => state.auth);
  const [shouldRender, setShouldRender] = useState(false);

  const locale = useLocale()



  useEffect(() => {
    if (!isLoading) {
      // if (!isAuthenticated) {
      //   redirect(`/account/login?redirect=${encodeURIComponent(window.location.pathname)}`);
      // } else {
      //   setShouldRender(true);
      // }

      if (!isAuthenticated) {
        redirect(`/account/login?redirect=${encodeURIComponent(window.location.pathname)}`);
      } else if( isAuthenticated && is_superuser || isAuthenticated && is_staff){
        redirect(`/staff`);

      }   
      
      else {
        setShouldRender(true);
      }




    }
  }, [isLoading, isAuthenticated]);

  // Don't render children until auth check is complete
  if (isLoading || !shouldRender) {
    // return null; // You can replace this with a loading spinner if needed
 
    return(
      <div className="form account_form d-flex align-items-center justify-content-center background-color  min-vh-100  ">
        <h1 className='text-light'> 
          {locale === "ar" ? "يرجى الإنتظار..." : "kindly wait ...." }
          {/* kindly wait ....   */}
        </h1>
      </div>
    )
 
 
 
 
  }

  return <>{children}</>;




}
