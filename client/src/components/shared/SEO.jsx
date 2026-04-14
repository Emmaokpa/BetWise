import { Helmet } from 'react-helmet-async';

const SEO = ({ 
  title, 
  description, 
  canonical, 
  type = 'website',
  keywords = 'betting predictions, nigeria football tips, aviator signals, banker of the day, sportybet codes'
}) => {
  const siteName = 'BetWise NG';
  const fullTitle = title ? `${title} | ${siteName}` : `${siteName} - #1 Free Football Predictions in Nigeria`;
  const defaultDescription = 'Get free daily football predictions, banker of the day, and aviator signals. No subscription required. Verified accuracy and live scores.';

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description || defaultDescription} />
      <meta name="keywords" content={keywords} />
      {canonical && <link rel="canonical" href={canonical} />}

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description || defaultDescription} />
      <meta property="og:site_name" content={siteName} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description || defaultDescription} />

      {/* Mobile Meta */}
      <meta name="theme-color" content="#00FF9C" />
      <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
    </Helmet>
  );
};

export default SEO;
