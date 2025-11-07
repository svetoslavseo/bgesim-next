/**
 * Verify that sitemap dates match JSON modifiedDate
 */

import { getPagesIndex, getPostsIndex, getPageBySlug, getPostBySlug } from '../src/lib/content';
import { SITE_CONFIG } from '../src/lib/seo';

const baseUrl = SITE_CONFIG.url;

// Get all pages
const pages = getPagesIndex();
const pageUrls = pages.map((page) => {
  const pageData = getPageBySlug(page.slug);
  const lastModified = pageData?.modifiedDate 
    ? new Date(pageData.modifiedDate) 
    : new Date();
  
  const slug = page.slug === 'home' || page.slug === '' || page.slug === 'en' ? '' : page.slug;
  const url = slug ? `${baseUrl}/${slug}/` : `${baseUrl}/`;
  
  return {
    url,
    lastModified: lastModified.toISOString(),
    jsonModifiedDate: pageData?.modifiedDate || 'N/A',
  };
});

// Get all posts
const posts = getPostsIndex();
const postUrls = posts.map((post) => {
  const postData = getPostBySlug(post.slug);
  const lastModified = postData?.modifiedDate 
    ? new Date(postData.modifiedDate) 
    : new Date(post.publishedDate);
  
  return {
    url: `${baseUrl}/blog/${post.slug}/`,
    lastModified: lastModified.toISOString(),
    jsonModifiedDate: postData?.modifiedDate || 'N/A',
  };
});

console.log('='.repeat(80));
console.log('Sitemap Date Verification');
console.log('='.repeat(80));

console.log('\n📄 Pages:');
let pageMismatches = 0;
pageUrls.forEach(({ url, lastModified, jsonModifiedDate }) => {
  const jsonDate = jsonModifiedDate !== 'N/A' ? new Date(jsonModifiedDate).toISOString() : 'N/A';
  const match = jsonDate === 'N/A' || lastModified === jsonDate;
  
  if (!match) {
    pageMismatches++;
    console.log(`  ❌ ${url}`);
    console.log(`     Sitemap: ${lastModified}`);
    console.log(`     JSON:    ${jsonDate}`);
  }
});

console.log('\n📝 Posts:');
let postMismatches = 0;
postUrls.forEach(({ url, lastModified, jsonModifiedDate }) => {
  const jsonDate = jsonModifiedDate !== 'N/A' ? new Date(jsonModifiedDate).toISOString() : 'N/A';
  const match = jsonDate === 'N/A' || lastModified === jsonDate;
  
  if (!match) {
    postMismatches++;
    console.log(`  ❌ ${url}`);
    console.log(`     Sitemap: ${lastModified}`);
    console.log(`     JSON:    ${jsonDate}`);
  }
});

// Check specific post mentioned by user
const kakvoEsim = postUrls.find(p => p.url.includes('kakvo-e-esim'));
if (kakvoEsim) {
  console.log('\n🔍 Specific Check - kakvo-e-esim:');
  console.log(`  URL: ${kakvoEsim.url}`);
  console.log(`  Sitemap lastmod: ${kakvoEsim.lastModified}`);
  console.log(`  JSON modifiedDate: ${kakvoEsim.jsonModifiedDate}`);
  const jsonDate = new Date(kakvoEsim.jsonModifiedDate).toISOString();
  const match = kakvoEsim.lastModified === jsonDate;
  console.log(`  Match: ${match ? '✅' : '❌'}`);
}

console.log('\n' + '='.repeat(80));
console.log('Summary:');
console.log(`  Pages: ${pageUrls.length} total, ${pageMismatches} mismatches`);
console.log(`  Posts: ${postUrls.length} total, ${postMismatches} mismatches`);
console.log('='.repeat(80));

if (pageMismatches === 0 && postMismatches === 0) {
  console.log('\n✅ All dates match!');
  process.exit(0);
} else {
  console.log('\n⚠️  Some dates do not match. Please check the output above.');
  process.exit(1);
}

