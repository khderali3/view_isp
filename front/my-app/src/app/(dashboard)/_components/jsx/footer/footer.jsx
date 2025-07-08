

import { getLocale } from "next-intl/server"



const Footer = async () => {

  const locale = await getLocale()

    return (
        <footer className="app-footer">
        <div className={`${ locale ==="ar" ? "float-start" : "float-end" } d-none d-sm-inline`}>
          {/* For ICT  */}
          {locale === "ar" ? "لتكنولوجيا الإتصالات والمعلومات" : 'For ICT'}
        </div> 
        <strong className="px-2">
        {locale === "ar" ? "© 2020 حقوق الطبع والنشر " : 'Copyright © 2020'}
          {/* Copyright © 2024 &nbsp; */}
          <a href="http://cloudtech-it.com" className="text-decoration-none px-2">
            CloudTech Sky
          </a>
          .
        </strong>
        {locale === "ar" ? 'جميع الحقوق محفوظة' : 'All rights reserved.'}
        
      </footer>
  
    )
}

export default Footer