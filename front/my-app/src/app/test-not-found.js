import Head from 'next/head';

import { getLocale } from 'next-intl/server';

export default   async function  NotFound() {
    const locale = await getLocale()
    return (
        <html lang="en">
            <head>
                <Head>
                    <title>404 - Page Not Found</title>
                    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                    <meta name="description" content="Page not found. The page you are looking for does not exist." />
                </Head>
            </head>
            <body style={{ margin: 0, fontFamily: 'Arial, sans-serif', backgroundColor: '#f8f9fa' }}>
                <div style={{ textAlign: 'center', marginTop: '100px', padding: '20px' }}>
                    <h1 style={{ fontSize: '2.5rem', color: '#333' }}>404 - Page Not Found</h1>
                    <p style={{ fontSize: '1.25rem', color: '#666', margin: '10px 0 20px' }}>
                        {locale === "ar" ? "إن الصفحة التي طلبتها غير موجودة أو تم حذفها" : "  The page you are looking for does not exist."}
                       
                    </p>
                    <a
                        href="/"
                        style={{
                            color: '#58b3c8',
                            textDecoration: 'none',
                            fontWeight: 'bold',
                            padding: '10px 20px',
                            border: '2px solid #58b3c8',
                            borderRadius: '5px',
                            display: 'inline-block',
                        }}
                    >
                          {locale === "ar" ? "عودة إلى الصفحة الرئيسية " : " Go back home "}
                       
                    </a>
                </div>
            </body>
        </html>
    );
}
