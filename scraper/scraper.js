import { chromium } from 'playwright';
import { writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUTPUT_DIR = join(__dirname, 'output');

const CHROMIUM_PATH = (() => {
  const candidates = [
    '/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
    '/opt/pw-browsers/chromium/chrome-linux/chrome',
    process.env.PLAYWRIGHT_CHROMIUM_PATH,
  ].filter(Boolean);
  return candidates[0];
})();

const SAUDI_UA = 'Mozilla/5.0 (Linux; Android 13; SM-G998B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.6045.163 Mobile Safari/537.36';
const TARGET = 'https://narjis14.com';

async function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

async function retryFetch(page, url, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      const resp = await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
      if (resp && resp.status() < 400) return true;
      console.log(`Attempt ${i + 1}: status ${resp?.status()} for ${url}`);
    } catch (e) {
      console.log(`Attempt ${i + 1} failed: ${e.message}`);
    }
    await sleep(2000 * (i + 1));
  }
  return false;
}

async function scrapeCategories(page) {
  console.log('📂 Scraping categories...');
  const cats = await page.evaluate(() => {
    const links = Array.from(document.querySelectorAll('a[href*="/categories/"], a[href*="/category/"], nav a, .categories a, .category-item a'));
    return links.map(a => ({
      nameAr: a.textContent?.trim(),
      url: a.href,
    })).filter(c => c.nameAr && c.url && c.nameAr.length > 1 && c.nameAr.length < 50);
  });
  return [...new Map(cats.map(c => [c.url, c])).values()];
}

async function scrapeProductsFromPage(page) {
  return page.evaluate(() => {
    const cards = Array.from(document.querySelectorAll('.product-card, .product-item, [class*="product"], [data-product], article'));
    return cards.map(card => {
      const name = card.querySelector('[class*="name"], [class*="title"], h2, h3')?.textContent?.trim();
      const priceEl = card.querySelector('[class*="price"], .price');
      const price = parseFloat(priceEl?.textContent?.replace(/[^\d.]/g, '')) || null;
      const img = card.querySelector('img')?.src || card.querySelector('img')?.dataset?.src;
      const link = card.querySelector('a')?.href;
      return { nameAr: name, price, image: img, url: link };
    }).filter(p => p.nameAr && p.nameAr.length > 1);
  });
}

async function interceptSallaAPI(page) {
  const interceptedProducts = [];
  const interceptedCategories = [];

  page.on('response', async (response) => {
    const url = response.url();
    if (url.includes('/api/') && (url.includes('product') || url.includes('categor'))) {
      try {
        const json = await response.json();
        console.log(`📡 Intercepted API: ${url}`);
        if (json?.data?.products) interceptedProducts.push(...json.data.products);
        if (json?.data?.categories) interceptedCategories.push(...json.data.categories);
        if (Array.isArray(json?.data)) {
          if (url.includes('product')) interceptedProducts.push(...json.data);
          if (url.includes('categor')) interceptedCategories.push(...json.data);
        }
      } catch (_) {}
    }
  });

  return { interceptedProducts, interceptedCategories };
}

async function main() {
  mkdirSync(OUTPUT_DIR, { recursive: true });

  const browser = await chromium.launch({
    executablePath: CHROMIUM_PATH,
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-blink-features=AutomationControlled',
      '--lang=ar-SA',
    ],
  });

  const context = await browser.newContext({
    userAgent: SAUDI_UA,
    locale: 'ar-SA',
    extraHTTPHeaders: {
      'Accept-Language': 'ar-SA,ar;q=0.9,en;q=0.8',
    },
  });

  const page = await context.newPage();
  const { interceptedProducts, interceptedCategories } = await interceptSallaAPI(page);

  console.log(`🌐 Visiting ${TARGET}...`);
  const ok = await retryFetch(page, TARGET);

  if (!ok) {
    console.warn('⚠️ Site returned 403. Trying direct API endpoints...');
    for (const endpoint of [
      `${TARGET}/api/products?per_page=50&page=1`,
      `${TARGET}/api/v1/products`,
      `${TARGET}/products.json`,
    ]) {
      await retryFetch(page, endpoint, 1);
      await sleep(1500);
    }
  } else {
    await sleep(3000);
    const categories = await scrapeCategories(page);
    const products = await scrapeProductsFromPage(page);

    console.log(`Found ${categories.length} categories, ${products.length} products on homepage`);

    // Try to visit categories
    for (const cat of categories.slice(0, 5)) {
      await sleep(2000);
      await retryFetch(page, cat.url, 2);
      await sleep(2000);
      const catProducts = await scrapeProductsFromPage(page);
      products.push(...catProducts.map(p => ({ ...p, category: cat.nameAr })));
    }

    // Combine DOM + API intercepted data
    const allProducts = [...products, ...interceptedProducts];
    const allCategories = [...categories, ...interceptedCategories];

    const uniqueProducts = [...new Map(allProducts.filter(p => p.nameAr).map(p => [p.url || p.nameAr, p])).values()];
    const uniqueCategories = [...new Map(allCategories.filter(c => c.nameAr || c.name).map(c => [c.url || c.nameAr, c])).values()];

    writeFileSync(join(OUTPUT_DIR, 'products.json'), JSON.stringify(uniqueProducts, null, 2), 'utf-8');
    writeFileSync(join(OUTPUT_DIR, 'categories.json'), JSON.stringify(uniqueCategories, null, 2), 'utf-8');

    console.log(`\n✅ Done!`);
    console.log(`   📦 Products: ${uniqueProducts.length} → scraper/output/products.json`);
    console.log(`   📂 Categories: ${uniqueCategories.length} → scraper/output/categories.json`);
  }

  await browser.close();
}

main().catch(err => {
  console.error('❌ Scraper failed:', err.message);
  process.exit(1);
});
