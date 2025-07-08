'use client';

import Link from "next/link"
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import LogoutLink from './nav_component/logoutComponent';


import { useLocale, useTranslations } from "next-intl";


const Nav = () => {
  const { isAuthenticated,loginFirstName, profileImage } = useSelector(state => state.staff_auth);
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const locale = useLocale()
  const t = useTranslations("dashboard.nav")
  
  const defaultImage = `data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBwgHBgkIBwgKCgkLDRYPDQwMDRsUFRAWIB0iIiAdHx8kKDQsJCYxJx8fLT0tMTU3Ojo6Iys/RD84QzQ5OjcBCgoKDQwNGg8PGjclHyU3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3N//AABEIAJQAswMBIgACEQEDEQH/xAAaAAEAAwEBAQAAAAAAAAAAAAAAAQIDBAUH/8QALBABAAICAAUDAgUFAAAAAAAAAAECAxEEEjFBUSEycZGhEyJSYbEUIzNCgf/EABUBAQEAAAAAAAAAAAAAAAAAAAAB/8QAFBEBAAAAAAAAAAAAAAAAAAAAAP/aAAwDAQACEQMRAD8A+4gAAAAAAAAiZ13BIrzx5OevkFhEWiZ9JhIAAAAAAAAAAAAAAAAClrxHyre+/SOigLTaZ+PCoAAAJiZjogBpGTtZeJjswTW01BuIrMTHokAAAAAAAAAABlktv0jovedV/diAAACJmIjczqPIJGFuKpHtibfZEcVH6J+oOgUx5KXj8s7nvC4AAJrPLO20TtgvjtqdA1AAAAAAAABEzqJBled2VAAAETOomZ6Q4cuT8S2+3aHTxVtY4iO8uMABUTE6ncdXbhy/iV9fdHVwtuFtrLEdpRXYAAADes7hLPHPZoAAAAAAArf2yspk9sgyAAABz8X7K/LldvE158Xp2nbiUABBpg/y1+Wbbha82XfgHYAigAL4vdLVjj9zYAAAAAABW3SVgHOExqdAAADjz4ZrO6xM1/h2Im0R1mI+ZB5w7bUw268v/JRGLDHj6g5aUm86rDux0jHXlj6kTSI1E1j4lYAAAAF8XWWqmONVXAAAAAAAABnkjuzbzG40xtHLOgQplyRjruevaPK8zqJmekPPyXnJabSC2TNfJ1nUeIZgqGjQAajwmtppO6zqUAOvDxHPPLedW7T5bvNdvD358fr1j0RWqaxM2iOyGuOuo35BcAAAAAAAAABW1eaFgHHxO64rbcL18uOuWvLbo87Nw98XrPrXzCjEOwIAAAAN+En+5MeYZY6WyW1SJl38NwsYvzWndv4BpSneerUEUAAAAAAAAAAAAABhl4XFkneuW3mGF+Bt/peJ+YdwDzP6TN4ifiSOEzfp+70wHnV4LJPWax92+Pgsce+Zs6gEVrFY1WIiP2SAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP//Z`

  useEffect(() => {
    // Function to check if the screen is small (sm or below)
    const checkScreenSize = () => {
       setIsSmallScreen(window.innerWidth < 992);

    };

    // Set the initial screen size check
    checkScreenSize();

    // Listen for window resize
    window.addEventListener('resize', checkScreenSize);

    return () => {
      window.removeEventListener('resize', checkScreenSize);
    };
  }, []);

 

  useEffect(() => {
    // Only add the outside click handler if the screen is small
    if (isSmallScreen) {
      const handleClickOutside = (event) => {
        const sidebar = document.getElementById('sidebar');
        const toggleButton = document.querySelector('[aria-controls="sidebar"]');

        // Close sidebar if click is outside
        if (!sidebar.contains(event.target) && !toggleButton.contains(event.target)) {
          if (sidebar.classList.contains('show')) {
            sidebar.classList.remove('show');
          }
        }
      };

      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [isSmallScreen]);





  useEffect(() => {

  }, [isAuthenticated]);  



  return (

      <nav className={ `app-header navbar navbar-expand bg-body  sticky-top bg-primary-subtle   ${!isAuthenticated && 'not_showing' }`}  data-bs-theme="dark" >


      <div className="container-fluid">
 

        <ul className="navbar-nav">
          <li className="nav-item">
        <a
              className="nav-link"
              role="button"
              data-bs-toggle="collapse"
              data-bs-target="#sidebar"
              aria-controls="sidebar"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <i className="bi bi-list"> </i>
            </a>

          </li>



          <li className="nav-item d-none d-md-block">
 
            <Link href="/staff" className="nav-link">
              {/* Home */}
              {t('home')}
            </Link>
          </li>


        </ul>

        <ul className={`navbar-nav   ${locale === "ar" ? 'me-auto' : 'ms-auto'} `}>


 
          <li className="nav-item dropdown user-menu">
            <a
              href="#"
              className="nav-link dropdown-toggle"
              data-bs-toggle="dropdown"
            >

            <span className="d-none d-md-inline">{t('hello')}, {loginFirstName}</span>{" "}

              {/* <img
                // src="/Images/user2-160x160.jpg"
                src={profileImage ? profileImage : "/Images/def_prof_image.jpg"}

                className="user-image rounded-circle shadow"
                alt="User Image"
              />  */}

              <img
                src={profileImage || defaultImage}
                onError={(e) => {
                  e.target.onerror = null; // Prevent infinite loop in case default image also fails
                  e.target.src = defaultImage;
                }}
                alt="User Image"
                className="user-image rounded-circle shadow"
              />






            </a>

            <ul className={`dropdown-menu dropdown-menu-lg   ${locale === "ar" ? 'dropdown-menu-start' : 'dropdown-menu-end'}`}>
 

              <li className="user-header text-bg-primary">


                <img
                  src={profileImage || defaultImage}
                  onError={(e) => {
                    e.target.onerror = null; // Prevent infinite loop in case default image also fails
                    e.target.src = defaultImage;
                  }}
                  alt="User Image"
                  className="rounded-circle shadow"
                />






                <p>
                  {loginFirstName}
                  <small>{t('staff')}</small>
                </p>
              </li>{" "}

              <li className="user-body">

                <div className="row">
                  <div className=" text-center">
                    <Link href="/staff/account/change_password">{t('Change_Password')}</Link>
                  </div>


                </div>
 
              </li>
   
              <li className="user-footer">
                <Link href="/staff/account/edit_profile" className="btn btn-default  w-100">
                {t('Edit_Profile')}
                </Link>
 
                <LogoutLink link_name={t('logout')} />


              </li>{" "}

            </ul>
          </li>{" "}

        </ul>{" "}

      </div>{" "}

    </nav>


  )

}


export default Nav