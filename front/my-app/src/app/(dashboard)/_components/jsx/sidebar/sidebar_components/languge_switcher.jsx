 
"use client";
import { useLocale } from 'next-intl';


import setLanguageValue from "@/app/global_utils/set_language"

const LanguageSwitcherComponent = () => {


  const local = useLocale()
 


  const handleChangeLanguage = (e) => {
    
    setLanguageValue(e.target.value)
  }


  return (
<div>
  <div className=" mt-5 language-switcher p-2    d-flex justify-content-center">
    <select
      id="languageSelect"
      className="form-select form-select-sm bg-transparent"
      aria-label="Language Selector"
      value={local}
      onChange={(e) => handleChangeLanguage(e)}
      style={{ 
        width: '130px'     
      
      }}  
    >
      <option className="text-dark    "  value="ar"> AR - العربية </option>
      <option className="text-dark   " value="en"> EN - English </option>
    </select>
  </div>


 




  
</div>
  )
}

export default LanguageSwitcherComponent
