 
"use client";
import { useLocale } from 'next-intl';


import setLanguageValue from "@/app/global_utils/set_language"

const LanguageSwitcherComponent = ({handleNavLinkClick}) => {


  const local = useLocale()
 


  const handleChangeLanguage = (e) => {
    
    setLanguageValue(e.target.value)
    if (handleNavLinkClick) handleNavLinkClick();
  }


  return (
<div>
  <div className="language-switcher p-2   d-flex align-items-center">
    <select
      id="languageSelect"
      className="form-select form-select-sm"
      aria-label="Language Selector"
      value={local}
      onChange={(e) => handleChangeLanguage(e)}
      style={{ 
        width: '130px'     
      
      }}  
    >
      <option value="ar"> AR - العربية </option>
      <option value="en"> EN - English </option>
    </select>
  </div>

  
</div>
  )
}

export default LanguageSwitcherComponent
