"use client";
import { useLocale } from "next-intl";
import { useEffect, useState } from "react";
import setLanguageValue from "@/app/global_utils/set_language";

const LanguageSwitcherComponent = ({ handleNavLinkClick }) => {
  const locale = useLocale();
  const [isOnline, setIsOnline] = useState(true); // Default to true

  useEffect(() => {
    // Check if navigator exists before accessing it
    if (typeof navigator !== "undefined") {
      const updateOnlineStatus = () => {
        setIsOnline(navigator.onLine);
      };

      // Set initial status
      updateOnlineStatus();

      // Listen for online/offline events
      window.addEventListener("online", updateOnlineStatus);
      window.addEventListener("offline", updateOnlineStatus);

      // Cleanup event listeners on component unmount
      return () => {
        window.removeEventListener("online", updateOnlineStatus);
        window.removeEventListener("offline", updateOnlineStatus);
      };
    }
  }, []); // Empty array means this effect runs once after the initial render

  const handleChangeLanguage = (e) => {
    setLanguageValue(e.target.value);
    if (handleNavLinkClick) handleNavLinkClick();
  };

  return (
    <div className="language-switcher p-2 d-flex align-items-center">
      <select
        id="languageSelect"
        className="form-select form-select-sm"
        aria-label="Language Selector"
        value={locale}
        onChange={handleChangeLanguage}
        disabled={!isOnline} // Disable if offline
        style={{ width: "130px" }}
      >
        <option value="ar"> AR - العربية </option>
        <option value="en"> EN - English </option>
      </select>
    </div>
  );
};

export default LanguageSwitcherComponent;
