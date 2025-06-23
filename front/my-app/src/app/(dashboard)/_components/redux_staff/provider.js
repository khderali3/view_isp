'use client';

import { store_staff } from "./store";
import { Provider } from "react-redux";



export default function CustomProviderStaff({ children }) {
	return <Provider store={store_staff}>{children}</Provider>;
}