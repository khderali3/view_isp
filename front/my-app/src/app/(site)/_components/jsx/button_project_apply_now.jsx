
'use client'
import { useRouter } from 'next/navigation';

import { useLocale } from 'next-intl';

export const ButtonProjectApplyNow = ({projecttype_id}) => {
	const locale = useLocale()
	const router = useRouter()
	return (
        <button type="button" className="btn btn-primary ps-4 pe-4"
			onClick={ ()=> {
				// router.push('/projectflow/new_projectflow');
				router.push(`/projectflow/new_projectflow?projecttype_id=${projecttype_id}`);


				}  
			}
			>
				{locale === "ar" ? "إطلب الأن" : "Apply Now"}
 			
        </button>

	)
}

