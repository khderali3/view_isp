'use client';

import useResetPassword from '../hooks/use-reset-password';
import Form from './Form';


import { useTranslations } from 'next-intl';

export default function ResetPasswordForm() {
	const {  email, isLoading, onChange, onSubmit,
		ReCAPTCHA,
		onChangeRecaptcha,
		recaptchaRef,
		locale

	 } = useResetPassword();
  const t = useTranslations('site.account.reset_password.form')

	const config = [

		{
			labelText: t('input_email'),
			labelId: 'email',
			type: 'email',
			value: email,
			required: true,
		},



	];

	return (
		<Form
			config={config}
			isLoading={isLoading}
			btnText={t('btnText')}
			onChange={onChange}
			onSubmit={onSubmit}
			
			ReCAPTCHA= {ReCAPTCHA}
			onChangeRecaptcha={onChangeRecaptcha}
			recaptchaRef={recaptchaRef}
			locale={locale}
		/>
	);
}
