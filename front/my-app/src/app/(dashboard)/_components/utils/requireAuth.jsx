
'use client';

import { redirect } from 'next/navigation';
import { useSelector } from 'react-redux';
import { usePathname } from 'next/navigation';
 
import { useLocale } from 'next-intl';

export default function RequireAuthStaff({ children }) {
  const { isLoading, isAuthenticated, is_staff, is_superuser  } = useSelector(state => state.staff_auth);
  
  const pathname = usePathname();
  const notProtectedPaths = ['/staff/account/login', ];
  const isNotProtected = notProtectedPaths.includes(pathname);
  const locale = useLocale()

  if (isLoading && !isNotProtected ) {
        return(
          <div  className="form account_form d-flex align-items-center justify-content-center   min-vh-100  ">
            
            <h1 className=' '> {locale === "ar" ? "يرجى الإنتظار ...." : "kindly wait .... " }   </h1>
          </div>
        )
   }
  if (!isAuthenticated && !isNotProtected ) {
		redirect('/staff/account/login');
	}

  // new condation by khder to protect dashboard fron not staff users

  if (isAuthenticated && !is_staff && !is_superuser ) {
 
		redirect('/');
	}


	return <>{children}</>;


}
