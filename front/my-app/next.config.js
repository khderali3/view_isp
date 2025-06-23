const createNextIntlPlugin = require('next-intl/plugin');
 
const withNextIntl = createNextIntlPlugin();
 

 
/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: false, 
	productionBrowserSourceMaps: false,  

};
 
// module.exports = withNextIntl(nextConfig);

module.exports = withNextIntl(nextConfig);






 