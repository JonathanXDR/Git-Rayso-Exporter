import { spawn } from 'bun';
import { mkdir, writeFile } from 'fs/promises';
import path from 'path';
import * as puppeteer from 'puppeteer';
import type { Options } from 'rayso-api';

async function generateImagesForChangedFiles(
  repoPath: string,
  sourceBranch: string,
  targetBranch: string,
  options: Options,
  outputDir: string
) {
  process.chdir(repoPath);

  try {
    await mkdir(outputDir, { recursive: true });
    console.log(`Created output directory: ${outputDir}`);
  } catch (error) {
    console.error(`Error creating output directory: ${error}`);
    return;
  }

  const changedFilesProc = spawn([
    'git',
    'diff',
    '--name-only',
    `${sourceBranch}...${targetBranch}`,
  ]);
  const changedFilesOutput = await new Response(changedFilesProc.stdout).text();
  const changedFiles = changedFilesOutput.split('\n').filter(Boolean);

  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  for (const file of changedFiles) {
    try {
      const contentProc = spawn(['git', 'show', `${targetBranch}:${file}`]);
      const content = await new Response(contentProc.stdout, {
        headers: { 'Content-Type': 'text/plain;charset=UTF-8' },
      }).text();

      console.log(`Code content for ${file}:\n${content}`);

      const fileExtension = path.extname(file).slice(1);
      const language = mapFileExtensionToLanguage(fileExtension);

      console.log(`Processing file: ${file}`);
      console.log(`Detected language: ${language}`);

      const imageBuffer = await generateImage(page, content, {
        ...options,
        language,
        title: file,
      });

      const outputFileName = path.join(
        outputDir,
        `${file.replace(/[\/\\]/g, '_')}.${
          options.format === 'svg' ? 'svg' : 'png'
        }`
      );
      await writeFile(outputFileName, imageBuffer);

      console.log(
        `Generated ${options.format || 'image'} for ${file}: ${outputFileName}`
      );
    } catch (error) {
      console.error(`Error processing ${file}:`, error);
    }
  }

  await browser.close();
}

async function generateImage(
  page: puppeteer.Page,
  code: string,
  options: Options
): Promise<Uint8Array> {
  const url = `https://ray.so/#code=${encodeURIComponent(
    code
  )}&title=${encodeURIComponent(options.title || '')}&theme=${
    options.theme || 'candy'
  }&padding=${options.padding || 32}&language=${
    options.language || 'auto'
  }&background=${options.background !== false}&darkMode=${
    options.darkMode !== false
  }`;

  await page.goto(url, { waitUntil: 'networkidle0' });

  await page.waitForSelector('#frame', { timeout: 10000 });

  if (options.format === 'png') {
    console.log('Attempting to click PNG export button');
    await page.waitForSelector('button[aria-label="Save PNG"]', {
      visible: true,
    });
    await page.click('button[aria-label="Save PNG"]');
    console.log('Clicked PNG export button');
  } else if (options.format === 'svg') {
    console.log('Attempting to export SVG');
    await page.waitForSelector(
      'button[aria-label="See other export options"]',
      { visible: true }
    );
    await page.click('button[aria-label="See other export options"]');
    await page.waitForSelector('button[aria-label="Save SVG"]', {
      visible: true,
    });
    await page.click('button[aria-label="Save SVG"]');
    console.log('Clicked SVG export button');
  } else if (options.format === 'url') {
    console.log('Attempting to export URL');
    await page.waitForSelector(
      'button[aria-label="See other export options"]',
      { visible: true }
    );
    await page.click('button[aria-label="See other export options"]');
    await page.waitForSelector('button[aria-label="Copy URL"]', {
      visible: true,
    });
    await page.click('button[aria-label="Copy URL"]');
    const url = await page.evaluate(async () => {
      try {
        return await navigator.clipboard.readText();
      } catch (err) {
        return '';
      }
    });
    return new TextEncoder().encode(url);
  }

  if (options.size) {
    console.log('Attempting to set image size');
    await page.waitForSelector(`button[data-size="${options.size}"]`, {
      visible: true,
    });
    await page.click(`button[data-size="${options.size}"]`);
    console.log(`Set image size to ${options.size}`);
  }

  const element = await page.$('#frame');
  if (!element) {
    throw new Error('Could not find #frame element');
  }

  let buffer: Uint8Array;
  if (options.format === 'svg') {
    const svgContent = await page.evaluate(() => {
      const svgElement = document.querySelector('#frame');
      return svgElement ? svgElement.outerHTML : '';
    });
    buffer = new TextEncoder().encode(svgContent);
  } else {
    buffer = await element.screenshot({
      type: options.format as 'png' | 'jpeg' | 'webp',
    });
  }

  return new Uint8Array(buffer);
}

function mapFileExtensionToLanguage(extension: string): string {
  const languageMap: Record<string, string> = {
    js: 'javascript',
    ts: 'typescript',
    py: 'python',
    rb: 'ruby',
    cs: 'csharp',
    cpp: 'cpp',
    h: 'cpp',
    jsx: 'javascript',
    tsx: 'typescript',
    md: 'markdown',
    sh: 'bash',
    yml: 'yaml',
    yaml: 'yaml',
  };

  return languageMap[extension.toLowerCase()] || 'auto';
}

function parseArguments(): {
  repoPath: string;
  sourceBranch: string;
  targetBranch: string;
  options: Options;
  outputDir: string;
} {
  const args = process.argv.slice(2);
  const repoPath = args[0] || process.cwd();
  const sourceBranch = args[1] || 'main';
  const targetBranch = args[2] || 'HEAD';
  const outputDir = args[3] || './rayso_images';

  const options: Options = {
    theme: 'candy',
    padding: 32,
    background: true,
    darkMode: true,
    format: 'png',
    size: '4x',
  };

  for (let i = 4; i < args.length; i += 2) {
    const key = args[i].replace('--', '') as keyof Options;
    const value = args[i + 1];

    if (key in options) {
      if (value === 'true' || value === 'false') {
        (options as any)[key] = value === 'true';
      } else if (key === 'padding') {
        if (value === 'sm') options.padding = 16;
        else if (value === 'md') options.padding = 32;
        else if (value === 'lg') options.padding = 64;
        else if (value === 'xl') options.padding = 128;
        else options.padding = parseInt(value) || 32;
      } else if (key === 'size') {
        if (['2x', '4x', '6x'].includes(value)) {
          options.size = value as '2x' | '4x' | '6x';
        }
      } else {
        (options as any)[key] = value;
      }
    }
  }

  return { repoPath, sourceBranch, targetBranch, options, outputDir };
}

const { repoPath, sourceBranch, targetBranch, options, outputDir } =
  parseArguments();

console.log(
  `Generating images for changes between ${sourceBranch} and ${targetBranch} in ${repoPath}`
);
console.log('Options:', options);
console.log('Output directory:', outputDir);

generateImagesForChangedFiles(
  repoPath,
  sourceBranch,
  targetBranch,
  options,
  outputDir
).catch(console.error);
