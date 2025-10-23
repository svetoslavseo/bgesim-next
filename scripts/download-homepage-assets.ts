import fs from 'fs';
import path from 'path';
import https from 'https';
import http from 'http';

const ORIGIN = 'https://travelesim.bg/';
const TARGET_DIR = path.join(process.cwd(), 'public', 'media', 'images', 'travelesim');
const MAPPING_PATH = path.join(process.cwd(), 'data', 'raw', 'homepage-asset-mapping.json');

function ensureDir(dir: string) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function toAbsolute(url: string): string {
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  try {
    const u = new URL(url, ORIGIN);
    return u.toString();
  } catch {
    return '';
  }
}

function filenameFromUrl(url: string): string {
  try {
    const u = new URL(url);
    const base = path.basename(u.pathname) || 'asset';
    return base.split('?')[0] || 'asset';
  } catch {
    return 'asset';
  }
}

function download(url: string, outPath: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const proto = url.startsWith('https') ? https : http;
    const file = fs.createWriteStream(outPath);
    const req = proto.get(url, (res) => {
      if (res.statusCode && [301, 302].includes(res.statusCode)) {
        file.close();
        if (fs.existsSync(outPath)) fs.unlinkSync(outPath);
        const loc = res.headers.location;
        if (!loc) return reject(new Error('Redirect without location'));
        return download(toAbsolute(loc), outPath).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) {
        file.close();
        if (fs.existsSync(outPath)) fs.unlinkSync(outPath);
        return reject(new Error(`HTTP ${res.statusCode}`));
      }
      res.pipe(file);
      file.on('finish', () => {
        file.close();
        resolve();
      });
    });
    req.on('error', (err) => {
      file.close();
      if (fs.existsSync(outPath)) fs.unlinkSync(outPath);
      reject(err);
    });
  });
}

async function fetchHtml(): Promise<string> {
  return new Promise((resolve, reject) => {
    https.get(ORIGIN, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

function extractAssetUrls(html: string): string[] {
  const urls = new Set<string>();
  const patterns = [
    /<img[^>]+src=["']([^"']+)["']/gi,
    /url\(([^)]+)\)/gi,
    /<link[^>]+href=["']([^"']+\.(?:png|jpg|jpeg|gif|webp|svg))["']/gi,
  ];
  for (const re of patterns) {
    let m: RegExpExecArray | null;
    while ((m = re.exec(html)) !== null) {
      const raw = m[1]?.replace(/^["']|["']$/g, '') || '';
      const abs = toAbsolute(raw);
      if (abs && /(\.(png|jpe?g|gif|webp|svg))($|\?)/i.test(abs)) {
        urls.add(abs);
      }
    }
  }
  return Array.from(urls);
}

async function main() {
  console.log('Downloading homepage assets from', ORIGIN);
  ensureDir(TARGET_DIR);
  ensureDir(path.dirname(MAPPING_PATH));

  const html = await fetchHtml();
  const urls = extractAssetUrls(html);
  console.log(`Found ${urls.length} assets`);

  const mapping: Record<string, string> = {};
  let i = 0;
  for (const url of urls) {
    i += 1;
    const name = filenameFromUrl(url);
    const out = path.join(TARGET_DIR, name);
    const rel = `/media/images/travelesim/${name}`;
    if (fs.existsSync(out)) {
      console.log(`[${i}/${urls.length}] skip exists ${name}`);
      mapping[url] = rel;
      continue;
    }
    try {
      console.log(`[${i}/${urls.length}] downloading ${name}`);
      await download(url, out);
      mapping[url] = rel;
    } catch (e: any) {
      console.warn(`[${i}/${urls.length}] failed ${name}: ${e?.message || e}`);
    }
  }

  fs.writeFileSync(MAPPING_PATH, JSON.stringify(mapping, null, 2), 'utf-8');
  console.log('Saved mapping to', MAPPING_PATH);
  console.log('Done');
}

if (require.main === module) {
  main().catch((e) => {
    console.error(e);
    process.exit(1);
  });
}

export {};


