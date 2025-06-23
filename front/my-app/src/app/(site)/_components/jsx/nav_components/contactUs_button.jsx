
'use client'
import { useRouter } from 'next/navigation';
import { useTranslations } from "next-intl";


const ContactUsButton = ({handleNavLinkClick}) => {
  const t = useTranslations("site.nav"); // this works

	const router = useRouter()
	return (
        <button type="button" className="btn btn-primary ps-4 pe-4"
			onClick={ ()=> {
			if (handleNavLinkClick) handleNavLinkClick(); 
			router.push('/tickets');
			}  
			}
			>
			{/* Contact Us */}
			{ t('nav_links.contact_us')}

        </button>

	)
}

export default ContactUsButton