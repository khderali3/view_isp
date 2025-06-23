'use client';

import { store } from "./store";
import { Provider } from "react-redux";
import { Suspense } from 'react';
import Loading from "../../Loading"; 


export default function CustomProvider({ children }) {
	return <Provider store={store}>

		<Suspense fallback={<Loading />}>
				{children}
		</Suspense>

		</Provider>;
}