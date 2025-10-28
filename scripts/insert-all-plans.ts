/**
 * Insert all remaining plans for all countries into sailyApi.ts
 */

import * as fs from 'fs';
import * as path from 'path';

const filePath = path.join(__dirname, '../src/lib/sailyApi.ts');
let content = fs.readFileSync(filePath, 'utf8');

// Read generated plans
const generatedPlans = fs.readFileSync('/tmp/complete-plans.txt', 'utf8');

// Extract plans for each country
const countrySections = generatedPlans.split('// =====').slice(1);

const additions: { code: string; plans: string }[] = [];

for (const section of countrySections) {
  if (section.includes('Turkey (TR)')) {
    const plans = section.split('// Global Plans')[1]?.trim() || '';
    additions.push({ code: 'TR', plans });
  } else if (section.includes('Dubai (AE)')) {
    const plans = section.split('// Global Plans')[1]?.trim() || '';
    additions.push({ code: 'AE', plans });
  } else if (section.includes('Egypt (EG)')) {
    const plans = section.split('// Global Plans')[1]?.trim() || '';
    additions.push({ code: 'EG', plans });
  } else if (section.includes('USA (US)')) {
    const regionalPlans = section.split('// Regional Plans')[1]?.split('// Global Plans')[0]?.trim() || '';
    const globalPlans = section.split('// Global Plans')[1]?.trim() || '';
    additions.push({ code: 'US', plans: regionalPlans + '\n\n    // Global Plans - Real data from Saily API\n' + globalPlans });
  } else if (section.includes('UK (GB)')) {
    const plans = section.split('// Global Plans')[1]?.trim() || '';
    additions.push({ code: 'GB', plans });
  }
}

// Find and insert after each country section
additions.forEach(({ code, plans }) => {
  const regex = new RegExp(`('${code}':\\s*\\[[^\\]]*)`, 'g');
  const match = content.match(regex);
  
  if (match) {
    // Find the closing bracket of the array
    const sectionStart = content.indexOf(match[0]);
    let bracketCount = 0;
    let pos = sectionStart + match[0].length;
    
    // Find the closing bracket
    while (pos < content.length) {
      if (content[pos] === '[') bracketCount++;
      if (content[pos] === ']') {
        if (bracketCount === 0) {
          // Found the closing bracket
          const before = content.substring(0, pos);
          const after = content.substring(pos);
          
          content = before + ',\n' + plans + '\n  ],';
          break;
        } else {
          bracketCount--;
        }
      }
      pos++;
    }
  }
});

// Clean up the content
content = content.replace(/, +],/g, '],');

fs.writeFileSync(filePath, content, 'utf8');
console.log('✅ Inserted all plans');

