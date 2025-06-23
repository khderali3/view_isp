"use client";

import { useEffect, useState } from "react";

import { useTranslations } from "next-intl";
import useServiceWorker from "@/app/(site)/_components/hooks/useServiceWorker";


const InstallPromptPWA = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);

  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const t = useTranslations('common')

  useServiceWorker()
 

  useEffect(() => {
    // Check if PWA is already installed
    if (window.matchMedia("(display-mode: standalone)").matches) {
      return;
    }

    const handleBeforeInstallPrompt = (event) => {
      event.preventDefault();
       
      // Prevent showing the prompt again if already installed
      if (localStorage.getItem("pwa_installed") === "true") {
        return;
      }

      setDeferredPrompt(event);
      setShowInstallPrompt(true);
    };

    const handleAppInstalled = () => {
      console.log("PWA installed");
      localStorage.setItem("pwa_installed", "true");
      setShowInstallPrompt(false);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  const installPWA = () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    deferredPrompt.userChoice.then((choiceResult) => {
      if (choiceResult.outcome === "accepted") {
        console.log("User accepted the install prompt");
        setShowInstallPrompt(false);
      } else {
        console.log("User dismissed the install prompt");
      }
      setDeferredPrompt(null);
    });
  };

  if (!showInstallPrompt) return null;

  return (
 
 

  <div className="container-fluid">
    <div className="row justify-content-center">
  
        <div className="col-10 col-sm-auto pwa-prompt bg-dark text-white p-3 rounded shadow-lg position-fixed start-50 translate-middle-x bottom-0 mb-3">
          <p className="mb-2 text-center">{t('pwa_prompt_msg')}</p>
          <div className="d-flex justify-content-center gap-2">
            <button className="btn btn-primary btn-sm" onClick={installPWA}>
              {t('pwa_prompt_btn_install')}
            </button>
            <button className="btn btn-secondary btn-sm" onClick={() => setShowInstallPrompt(false)}>
              {t('pwa_prompt_btn_Dismiss')}
            </button>
          </div>
        </div>
  
    </div>
  </div>





  );
};

export default InstallPromptPWA;
