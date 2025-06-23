 
'use client'
import Link from "next/link";
import { useTranslations } from "next-intl"; 
import { useRouter } from "next/navigation";

export default  function OfflinePage() {
	const t =  useTranslations('common.offline_page')
  const router = useRouter()

  const handleBackToHome = () => {
    if (navigator.onLine) {
      // If online, use router.push for client-side navigation
      router.push("/");
    } else {
      // If offline, use window.location for traditional navigation
      window.location.href = "/";
    }
  };

  return (
    <div className="d-flex flex-column justify-content-center align-items-center text-center min-vh-100 background-color text-light px-3">
		<h1 className="fw-bold">
		{/* You are offline */}
			{t('You_are_offline')}
		</h1>
      <h6 className="mb-4">{t('Check_your_internet')}</h6>
      <h6 className="mb-4 text-secondary">{t('CloudTechSKY')}</h6>

      {/* <Link href="/#home" className="btn  text-light "  style={{ backgroundColor: "#58b3c8", border: "none" }}>
        {t('back_to_home')}
      </Link> */}

      <button
        onClick={handleBackToHome}
        className="btn text-light"
        style={{ backgroundColor: "#58b3c8", border: "none" }}
      >
        {t('back_to_home')}
      </button>


      {/* <button
          onClick={handleBackToHome}
          className="btn text-light"
          style={{ backgroundColor: "#58b3c8", border: "none" }}
        >
          {t("back_to_home")}
      </button> */}

    </div>
  );
}


