const rawSiteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();

export const siteUrl = rawSiteUrl
  ? rawSiteUrl.replace(/\/+$/, '')
  : 'http://localhost:3000';
