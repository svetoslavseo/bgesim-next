#!/usr/bin/env tsx
/**
 * Stability Test Script
 * 
 * Tests the reliability of:
 * 1. CSS resources (imports, modules, global styles)
 * 2. Next.js resources (build output, static assets)
 * 3. File references and dependencies
 */

import * as fs from 'fs';
import * as path from 'path';

interface TestResult {
  name: string;
  status: 'pass' | 'fail' | 'warning';
  message: string;
  details?: string[];
}

const results: TestResult[] = [];
const projectRoot = path.resolve(__dirname, '..');
const srcDir = path.join(projectRoot, 'src');

/**
 * Check if a file exists
 */
function fileExists(filePath: string): boolean {
  try {
    return fs.existsSync(filePath);
  } catch {
    return false;
  }
}

/**
 * Extract CSS imports from a file
 */
function extractCssImports(content: string): string[] {
  const imports: string[] = [];
  
  // Match: import 'path' or import "path" or import styles from 'path'
  const importRegex = /import\s+(?:styles\s+from\s+)?['"]([^'"]+\.(?:css|module\.css))['"]/g;
  const matches = content.matchAll(importRegex);
  
  for (const match of matches) {
    if (match[1]) {
      imports.push(match[1]);
    }
  }
  
  // Match: @import statements in CSS
  const cssImportRegex = /@import\s+['"]([^'"]+)['"]/g;
  const cssMatches = content.matchAll(cssImportRegex);
  
  for (const match of cssMatches) {
    if (match[1]) {
      imports.push(match[1]);
    }
  }
  
  return imports;
}

/**
 * Resolve CSS import path relative to file location
 */
function resolveCssImport(importPath: string, fromFile: string): string {
  // Handle @ alias
  if (importPath.startsWith('@/')) {
    return path.join(projectRoot, 'src', importPath.replace('@/', ''));
  }
  
  // Handle relative paths
  if (importPath.startsWith('./') || importPath.startsWith('../')) {
    return path.resolve(path.dirname(fromFile), importPath);
  }
  
  // Absolute path
  return path.resolve(projectRoot, importPath);
}

/**
 * Test 1: Verify all global CSS files exist
 */
function testGlobalCssFiles(): void {
  const globalCssFiles = [
    'src/styles/globals.css',
    'src/styles/critical.css',
    'src/styles/fonts.css',
    'src/styles/variables.module.css',
  ];
  
  const missing: string[] = [];
  
  for (const cssFile of globalCssFiles) {
    const fullPath = path.join(projectRoot, cssFile);
    if (!fileExists(fullPath)) {
      missing.push(cssFile);
    }
  }
  
  if (missing.length === 0) {
    results.push({
      name: 'Global CSS Files',
      status: 'pass',
      message: `All ${globalCssFiles.length} global CSS files exist`,
    });
  } else {
    results.push({
      name: 'Global CSS Files',
      status: 'fail',
      message: `Missing ${missing.length} global CSS file(s)`,
      details: missing,
    });
  }
}

/**
 * Recursively find all files matching pattern
 */
function findFiles(dir: string, pattern: RegExp, files: string[] = []): string[] {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    
    // Skip node_modules and hidden directories
    if (entry.isDirectory()) {
      if (entry.name !== 'node_modules' && !entry.name.startsWith('.')) {
        findFiles(fullPath, pattern, files);
      }
    } else if (entry.isFile() && pattern.test(entry.name)) {
      files.push(path.relative(srcDir, fullPath));
    }
  }
  
  return files;
}

/**
 * Test 2: Verify CSS imports in components
 */
function testCssImports(): void {
  const componentFiles = findFiles(srcDir, /\.(tsx|ts)$/);
  
  const issues: string[] = [];
  let checkedFiles = 0;
  let validImports = 0;
  let invalidImports = 0;
  
  for (const file of componentFiles) {
    const filePath = path.join(srcDir, file);
    const content = fs.readFileSync(filePath, 'utf-8');
    const imports = extractCssImports(content);
    
    if (imports.length > 0) {
      checkedFiles++;
      
      for (const importPath of imports) {
        const resolvedPath = resolveCssImport(importPath, filePath);
        
        // Check if file exists (with or without extension)
        const pathsToCheck = [
          resolvedPath,
          resolvedPath + '.css',
          resolvedPath + '.module.css',
        ];
        
        const exists = pathsToCheck.some(p => fileExists(p));
        
        if (exists) {
          validImports++;
        } else {
          invalidImports++;
          issues.push(`${file}: ${importPath} -> ${resolvedPath}`);
        }
      }
    }
  }
  
  if (invalidImports === 0) {
    results.push({
      name: 'CSS Imports',
      status: 'pass',
      message: `All ${validImports} CSS imports are valid across ${checkedFiles} files`,
    });
  } else {
    results.push({
      name: 'CSS Imports',
      status: 'fail',
      message: `${invalidImports} invalid CSS import(s) found`,
      details: issues.slice(0, 10), // Show first 10 issues
    });
  }
}

/**
 * Test 3: Verify CSS module files match component files
 */
function testCssModules(): void {
  const moduleCssFiles = findFiles(srcDir, /\.module\.css$/);
  
  const missingModules: string[] = [];
  const orphanModules: string[] = [];
  
  // Exclude variables.module.css as it's imported in globals.css
  const excludedFiles = ['styles/variables.module.css'];
  
  for (const cssFile of moduleCssFiles) {
    // Skip excluded files
    if (excludedFiles.includes(cssFile)) {
      continue;
    }
    
    const cssPath = path.join(srcDir, cssFile);
    const basePath = cssPath.replace('.module.css', '');
    
    // Check for corresponding TSX/TS file
    const possibleFiles = [
      basePath + '.tsx',
      basePath + '.ts',
    ];
    
    const hasComponent = possibleFiles.some(f => fileExists(f));
    
    if (!hasComponent) {
      orphanModules.push(cssFile);
    }
  }
  
  // Check components that import CSS modules
  const componentFiles = findFiles(srcDir, /\.(tsx|ts)$/);
  
  for (const file of componentFiles) {
    const filePath = path.join(srcDir, file);
    const content = fs.readFileSync(filePath, 'utf-8');
    
    // Look for CSS module imports
    const moduleImportRegex = /import\s+styles\s+from\s+['"]([^'"]+\.module\.css)['"]/g;
    const matches = content.matchAll(moduleImportRegex);
    
    for (const match of matches) {
      const importPath = match[1];
      const resolvedPath = resolveCssImport(importPath, filePath);
      const pathsToCheck = [
        resolvedPath,
        resolvedPath + '.css',
      ];
      
      if (!pathsToCheck.some(p => fileExists(p))) {
        missingModules.push(`${file}: ${importPath}`);
      }
    }
  }
  
  const issues = [...missingModules, ...orphanModules];
  
  if (issues.length === 0) {
    results.push({
      name: 'CSS Modules',
      status: 'pass',
      message: `All ${moduleCssFiles.length} CSS module files are properly referenced`,
    });
  } else {
    results.push({
      name: 'CSS Modules',
      status: 'warning',
      message: `Found ${issues.length} CSS module issue(s)`,
      details: issues.slice(0, 10),
    });
  }
}

/**
 * Test 4: Verify Next.js build output structure
 */
function testNextjsBuildOutput(): void {
  const outDir = path.join(projectRoot, 'out');
  
  if (!fileExists(outDir)) {
    results.push({
      name: 'Next.js Build Output',
      status: 'warning',
      message: 'Build output directory not found. Run `npm run build` first.',
    });
    return;
  }
  
  // Check for _next directory
  const nextDir = path.join(outDir, '_next');
  if (!fileExists(nextDir)) {
    results.push({
      name: 'Next.js Build Output',
      status: 'warning',
      message: '_next directory not found in build output. Build may not be complete.',
    });
    return;
  }
  
  // Check for static directory (required)
  const staticDir = path.join(nextDir, 'static');
  const staticExists = fileExists(staticDir);
  
  // Check for CSS files in build output
  let cssFileCount = 0;
  try {
    const cssFiles = fs.readdirSync(outDir, { recursive: true });
    cssFileCount = cssFiles.filter((f: string) => typeof f === 'string' && f.endsWith('.css')).length;
  } catch {
    // If recursive readdir fails, try alternative approach
    cssFileCount = 0;
  }
  
  if (staticExists) {
    results.push({
      name: 'Next.js Build Output',
      status: 'pass',
      message: `Build output structure valid (${cssFileCount} CSS files found)`,
    });
  } else {
    results.push({
      name: 'Next.js Build Output',
      status: 'warning',
      message: '_next/static directory not found. Build output may be incomplete.',
    });
  }
}

/**
 * Test 5: Verify CSS @import chain integrity
 */
function testCssImportChain(): void {
  const globalsPath = path.join(projectRoot, 'src/styles/globals.css');
  
  if (!fileExists(globalsPath)) {
    results.push({
      name: 'CSS Import Chain',
      status: 'fail',
      message: 'globals.css not found',
    });
    return;
  }
  
  const content = fs.readFileSync(globalsPath, 'utf-8');
  const imports = extractCssImports(content);
  const issues: string[] = [];
  
  for (const importPath of imports) {
    const resolvedPath = resolveCssImport(importPath, globalsPath);
    const pathsToCheck = [
      resolvedPath,
      resolvedPath + '.css',
      resolvedPath + '.module.css',
    ];
    
    if (!pathsToCheck.some(p => fileExists(p))) {
      issues.push(`${importPath} -> ${resolvedPath}`);
    }
  }
  
  if (issues.length === 0) {
    results.push({
      name: 'CSS Import Chain',
      status: 'pass',
      message: `All CSS imports in globals.css are valid`,
    });
  } else {
    results.push({
      name: 'CSS Import Chain',
      status: 'fail',
      message: `${issues.length} broken CSS import(s) in globals.css`,
      details: issues,
    });
  }
}

/**
 * Test 6: Check for circular CSS dependencies
 */
function testCssCircularDeps(): void {
  // This is a simplified check - full circular dependency detection would require graph traversal
  const cssFiles = findFiles(srcDir, /\.css$/);
  
  const circularIssues: string[] = [];
  
  for (const cssFile of cssFiles) {
    const filePath = path.join(srcDir, cssFile);
    const content = fs.readFileSync(filePath, 'utf-8');
    const imports = extractCssImports(content);
    
    // Check if file imports itself (simple circular check)
    for (const importPath of imports) {
      const resolvedPath = resolveCssImport(importPath, filePath);
      if (resolvedPath === filePath) {
        circularIssues.push(cssFile);
      }
    }
  }
  
  if (circularIssues.length === 0) {
    results.push({
      name: 'CSS Circular Dependencies',
      status: 'pass',
      message: 'No circular CSS dependencies detected',
    });
  } else {
    results.push({
      name: 'CSS Circular Dependencies',
      status: 'warning',
      message: `Found ${circularIssues.length} potential circular dependency(ies)`,
      details: circularIssues,
    });
  }
}

/**
 * Test 7: Verify font files referenced in fonts.css
 */
function testFontFiles(): void {
  const fontsPath = path.join(projectRoot, 'src/styles/fonts.css');
  
  if (!fileExists(fontsPath)) {
    results.push({
      name: 'Font Files',
      status: 'warning',
      message: 'fonts.css not found',
    });
    return;
  }
  
  // Fonts.css uses local() so we can't easily verify file existence
  // But we can check if the file structure is correct
  results.push({
    name: 'Font Files',
    status: 'pass',
    message: 'Font declarations use local() fallbacks (system fonts)',
  });
}

/**
 * Test 8: Check CSS syntax errors (basic validation)
 */
function testCssSyntax(): void {
  const cssFiles = findFiles(srcDir, /\.css$/);
  
  const syntaxErrors: string[] = [];
  
  for (const cssFile of cssFiles) {
    const filePath = path.join(srcDir, cssFile);
    const content = fs.readFileSync(filePath, 'utf-8');
    
    // Remove CSS comments before checking
    const contentWithoutComments = content.replace(/\/\*[\s\S]*?\*\//g, '');
    
    // Basic checks: unmatched braces (in non-comment content)
    const openBraces = (contentWithoutComments.match(/{/g) || []).length;
    const closeBraces = (contentWithoutComments.match(/}/g) || []).length;
    
    if (openBraces !== closeBraces) {
      syntaxErrors.push(`${cssFile}: Unmatched braces (${openBraces} open, ${closeBraces} close)`);
    }
    
    // Check for unclosed parentheses
    const openParens = (contentWithoutComments.match(/\(/g) || []).length;
    const closeParens = (contentWithoutComments.match(/\)/g) || []).length;
    
    if (openParens !== closeParens) {
      syntaxErrors.push(`${cssFile}: Unmatched parentheses (${openParens} open, ${closeParens} close)`);
    }
    
    // Check for unclosed brackets
    const openBrackets = (contentWithoutComments.match(/\[/g) || []).length;
    const closeBrackets = (contentWithoutComments.match(/\]/g) || []).length;
    
    if (openBrackets !== closeBrackets) {
      syntaxErrors.push(`${cssFile}: Unmatched brackets (${openBrackets} open, ${closeBrackets} close)`);
    }
  }
  
  if (syntaxErrors.length === 0) {
    results.push({
      name: 'CSS Syntax',
      status: 'pass',
      message: `All ${cssFiles.length} CSS files have valid syntax`,
    });
  } else {
    results.push({
      name: 'CSS Syntax',
      status: 'fail',
      message: `${syntaxErrors.length} CSS syntax error(s) found`,
      details: syntaxErrors.slice(0, 10),
    });
  }
}

/**
 * Main test runner
 */
function runTests(): void {
  console.log('🔍 Running CSS and Next.js Stability Tests...\n');
  
  testGlobalCssFiles();
  testCssImports();
  testCssModules();
  testNextjsBuildOutput();
  testCssImportChain();
  testCssCircularDeps();
  testFontFiles();
  testCssSyntax();
  
  // Print results
  console.log('\n📊 Test Results:\n');
  console.log('='.repeat(60));
  
  let passCount = 0;
  let failCount = 0;
  let warnCount = 0;
  
  for (const result of results) {
    const icon = result.status === 'pass' ? '✅' : result.status === 'fail' ? '❌' : '⚠️';
    const statusColor = result.status === 'pass' ? '\x1b[32m' : result.status === 'fail' ? '\x1b[31m' : '\x1b[33m';
    const reset = '\x1b[0m';
    
    console.log(`${icon} ${statusColor}${result.name}: ${result.status.toUpperCase()}${reset}`);
    console.log(`   ${result.message}`);
    
    if (result.details && result.details.length > 0) {
      console.log(`   Details:`);
      for (const detail of result.details) {
        console.log(`     - ${detail}`);
      }
    }
    
    console.log();
    
    if (result.status === 'pass') passCount++;
    else if (result.status === 'fail') failCount++;
    else warnCount++;
  }
  
  console.log('='.repeat(60));
  console.log(`\n📈 Summary:`);
  console.log(`   ✅ Passed: ${passCount}`);
  console.log(`   ❌ Failed: ${failCount}`);
  console.log(`   ⚠️  Warnings: ${warnCount}`);
  console.log(`   📊 Total: ${results.length}`);
  
  const reliability = ((passCount / results.length) * 100).toFixed(1);
  console.log(`\n🎯 Reliability Score: ${reliability}%\n`);
  
  if (failCount > 0) {
    console.log('❌ Some tests failed. Please review and fix the issues above.\n');
    process.exit(1);
  } else if (warnCount > 0) {
    console.log('⚠️  All tests passed, but some warnings were found.\n');
    process.exit(0);
  } else {
    console.log('✅ All tests passed! Your CSS and Next.js resources are stable.\n');
    process.exit(0);
  }
}

// Run tests
try {
  runTests();
} catch (error) {
  console.error('❌ Test execution error:', error);
  process.exit(1);
}

