import fs from 'fs';

const articles = JSON.parse(fs.readFileSync('server/storage/articles.json', 'utf8'));
const now = new Date().toISOString().split('T')[0];

let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://janatatv.in/</loc>
    <lastmod>${now}</lastmod>
    <changefreq>hourly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://janatatv.in/?lang=te</loc>
    <lastmod>${now}</lastmod>
    <changefreq>hourly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://janatatv.in/?lang=hi</loc>
    <lastmod>${now}</lastmod>
    <changefreq>hourly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://janatatv.in/?lang=ta</loc>
    <lastmod>${now}</lastmod>
    <changefreq>hourly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://janatatv.in/?lang=en</loc>
    <lastmod>${now}</lastmod>
    <changefreq>hourly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://janatatv.in/?category=Tollywood</loc>
    <lastmod>${now}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://janatatv.in/?category=Bollywood</loc>
    <lastmod>${now}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://janatatv.in/?category=Kollywood</loc>
    <lastmod>${now}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://janatatv.in/?category=OTT</loc>
    <lastmod>${now}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://janatatv.in/?category=Box-Office</loc>
    <lastmod>${now}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>
`;

articles.slice(0, 50).forEach(art => {
  const artDate = art.publishedAt ? art.publishedAt.split('T')[0] : now;
  xml += `  <url>
    <loc>https://janatatv.in/?article=${encodeURIComponent(art.id)}</loc>
    <lastmod>${artDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>
`;
});

xml += '</urlset>\n';

fs.writeFileSync('public/sitemap.xml', xml);
console.log('Successfully generated public/sitemap.xml with ' + (articles.length + 10) + ' URLs');
