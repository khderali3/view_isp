
'use client'
// import RequireAuth from '../../_components/utils/requireAuthTicket';

import RequireAuth from '../../_components/utils/requireAuth';

import { usePathname } from 'next/navigation';


export default function Layout({ children }) {
  const pathname = usePathname();

//   // Define the protected paths
  const protectedPaths = ['/account/editProfile', '/account/password-change'];

//   // Check if the current path is in the list of protected paths
  const isProtected = protectedPaths.includes(pathname);

//   // Conditionally wrap with RequireAuth based on the current path
  if (isProtected) {
    return <RequireAuth>{children}</RequireAuth>;
  }

  // For other paths, return children directly
  return <>{children}</>;
}