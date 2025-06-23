
// import RequireAuthComponent from '../../_components/utils/requireAuth';

import RequireAuthComponent from '@/app/(site)/_components/utils/requireAuth';


export default function Layout({ children }) {
	return <RequireAuthComponent>{children}</RequireAuthComponent>;

}