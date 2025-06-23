'use client';


import { useTranslations } from 'next-intl';
import useLogin from '../hooks/use-login';
import Form from './Form';


export default function LoginForm() {
	const { email, password, isLoading, onChange, onSubmit, ReCAPTCHA, locale, recaptchaRef, onChangeRecaptcha } = useLogin();
	const t = useTranslations('site.account.login')

	const config = [
		{
			labelText: t("form.email_address"),
			labelId: 'email',
			type: 'email',
			value: email,
			required: true,
		},
		{
			labelText: t("form.password"),
			labelId: 'password',
			type: 'password',
			value: password,
			required: true,
			link: {
				linkText: 
				// 'Forgot password?'
				t("form.forgot_password")
				,
				linkUrl: '/account/password-reset',
			},
		},
	];

	return (
		<Form
			form_title='Login Page'
			config={config}
			isLoading={isLoading}
			btnText={t("form.sign_in")}
			onChange={onChange}
			onSubmit={onSubmit}
			ReCAPTCHA={ReCAPTCHA}
			locale={locale}
			recaptchaRef={recaptchaRef}
			onChangeRecaptcha={onChangeRecaptcha}
		/>
	);
}