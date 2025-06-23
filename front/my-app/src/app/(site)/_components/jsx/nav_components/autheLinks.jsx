
"use client";


import { useSelector } from "react-redux"
import LogoutLink from "./logoutComponent";
import Link from "next/link";
import { useEffect } from "react";
import { useTranslations, useLocale } from "next-intl";

import { useRouter } from "next/navigation";

const AuthLinks = ({handleNavLinkClick}) => {

  const local = useLocale()
  const router = useRouter()

  const handleLoginClick = () => {
    if (handleNavLinkClick) handleNavLinkClick();
    router.push("/account/login");
  };

    const { isAuthenticated, loginFirstName, profileImage, is_staff, is_superuser   } = useSelector(state => state.auth);
    const t = useTranslations("site.nav"); // this works

    useEffect(() => {
      }, []);


    return (

<>


{ isAuthenticated ? 

  <li className="prof nav-item dropdown">
  <a
    className="nav-link dropdown-toggle mb-lg-0 pb-lg-0 mt-lg-0 pt-lg-0  mb-3   "
    href="#"
    id="navbarDropdownMenuLink"
    role="button"
    data-bs-toggle="dropdown"
    aria-expanded="false"
  >


 
 
    { local === "en" ?
        <span className="  text-muted  "> hello, {loginFirstName} </span>
      :

      <span className="  text-muted ">  {loginFirstName}, أهلاً   </span>

    }  


    <img src= {profileImage ? profileImage : `data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBwgHBgkIBwgKCgkLDRYPDQwMDRsUFRAWIB0iIiAdHx8kKDQsJCYxJx8fLT0tMTU3Ojo6Iys/RD84QzQ5OjcBCgoKDQwNGg8PGjclHyU3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3N//AABEIAJQAswMBIgACEQEDEQH/xAAaAAEAAwEBAQAAAAAAAAAAAAAAAQIDBAUH/8QALBABAAICAAUDAgUFAAAAAAAAAAECAxEEEjFBUSEycZGhEyJSYbEUIzNCgf/EABUBAQEAAAAAAAAAAAAAAAAAAAAB/8QAFBEBAAAAAAAAAAAAAAAAAAAAAP/aAAwDAQACEQMRAD8A+4gAAAAAAAAiZ13BIrzx5OevkFhEWiZ9JhIAAAAAAAAAAAAAAAAClrxHyre+/SOigLTaZ+PCoAAAJiZjogBpGTtZeJjswTW01BuIrMTHokAAAAAAAAAABlktv0jovedV/diAAACJmIjczqPIJGFuKpHtibfZEcVH6J+oOgUx5KXj8s7nvC4AAJrPLO20TtgvjtqdA1AAAAAAAABEzqJBled2VAAAETOomZ6Q4cuT8S2+3aHTxVtY4iO8uMABUTE6ncdXbhy/iV9fdHVwtuFtrLEdpRXYAAADes7hLPHPZoAAAAAAArf2yspk9sgyAAABz8X7K/LldvE158Xp2nbiUABBpg/y1+Wbbha82XfgHYAigAL4vdLVjj9zYAAAAAABW3SVgHOExqdAAADjz4ZrO6xM1/h2Im0R1mI+ZB5w7bUw268v/JRGLDHj6g5aUm86rDux0jHXlj6kTSI1E1j4lYAAAAF8XWWqmONVXAAAAAAAABnkjuzbzG40xtHLOgQplyRjruevaPK8zqJmekPPyXnJabSC2TNfJ1nUeIZgqGjQAajwmtppO6zqUAOvDxHPPLedW7T5bvNdvD358fr1j0RWqaxM2iOyGuOuo35BcAAAAAAAAABW1eaFgHHxO64rbcL18uOuWvLbo87Nw98XrPrXzCjEOwIAAAAN+En+5MeYZY6WyW1SJl38NwsYvzWndv4BpSneerUEUAAAAAAAAAAAAABhl4XFkneuW3mGF+Bt/peJ+YdwDzP6TN4ifiSOEzfp+70wHnV4LJPWax92+Pgsce+Zs6gEVrFY1WIiP2SAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP//Z`}
    width="30" height="30" className="rounded-circle" />

  </a>


  <ul
    className={`bg-focus dropdown-menu dropdown-menu-end  background-color  ${local === "ar" ? "text-end" : "text-start"} `}
    aria-labelledby="navbarDropdownMenuLink"
    
  >

    { ( is_staff || is_superuser ) &&
    <> 
      <li>
        <Link className="bg-focus dropdown-item text-light " href="/staff"
      
        >
  
        {t('nav_links.DashBoard')}

        </Link>
      </li>
      <hr className="text-light m-0 mb-1"/>
    </>

    }




    <li>
      <Link className="bg-focus dropdown-item text-light" href="/account/editProfile"
          onClick={() => {
            if (handleNavLinkClick) handleNavLinkClick();
          }}
      
      >
        {/* Edit Profile */}
        { t('nav_links.edit_profile')}

      </Link>
    </li>


    <li>
      <Link className="bg-focus dropdown-item text-light" href="/account/password-change"
          onClick={() => {
            if (handleNavLinkClick) handleNavLinkClick();
          }}
      >
          {/* Change Password */}
          { t('nav_links.change_password')}

        </Link>
    </li>
    <li>

      <LogoutLink   handleNavLinkClick={handleNavLinkClick} />
    </li>
  </ul>
</li>


   :
   <li className="nav-item">
    <Link className="nav-link p-lg-3  " href="/account/login" 
    onClick={() => {
      if (handleNavLinkClick) handleNavLinkClick();
    }}
    
    >
      {/* Login */}
      { t('nav_links.login')}

    </Link>
  </li> 

        



 
}


</>




        
    )

}

export default AuthLinks