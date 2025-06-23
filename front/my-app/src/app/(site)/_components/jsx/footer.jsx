
import Link from "next/link";

import {getLocale, getTranslations} from 'next-intl/server';


export const Footer = async () => {

	let social_data = ''
	let footer_data = ''
  const local = await getLocale()
  const t = await getTranslations("site.footer"); // this works

	try {

		const res_social = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/site/social/`,
		 { cache: 'no-store',}  // Disable caching
		);
		

		if( res_social  && res_social.ok){
			social_data = await res_social.json();
		} else {
			console.log('err1', res_social)
		}
	  } catch (error) {
		console.log('err2', error)

	  }



	  try {

		const res_footer = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/site/footer/`,
		 { cache: 'no-store',}  // Disable caching
		);
		

		if( res_footer  && res_footer.ok){
			footer_data = await res_footer.json();
		} else {
			console.log('err1', res_footer)
		}
	  } catch (error) {
		console.log('err2', error)

	  }





    return (


        <>
        
        <footer  id="footer_id">

  <div
    className="text-center p-3"
    style={{ backgroundColor: "rgba(0, 0, 0, 0.2)" }}
  >

    {t('copyright')}

    <a className="text-white" href="https://www.cloudtech-it.com/" />
  </div>
</footer>

        
        </>
    )
}

