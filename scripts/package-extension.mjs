#!/usr/bin/env node

/**
 * Vibes-Plug VS Code & Cursor Extension Packager (2026 Edition)
 * 
 * Part of Pillar 6: High-Performance Native VSIX Packaging for VS Code & Cursor Marketplaces.
 * Audits extension manifest, registers 155-skill companion commands, and packages
 * an Open Packaging Conventions (OPC) compliant .vsix archive with zero external dependencies.
 * 
 * Usage:
 *   node scripts/package-extension.mjs [--dry-run] [--output <path>]
 *   npm run package:vscode
 */

import fs from 'node:fs/promises';
import path from 'node:path';
import { deflateRawSync, crc32 } from 'node:zlib';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PLUGIN_ROOT = path.resolve(__dirname, '..');
const EXTENSION_DIR = path.join(PLUGIN_ROOT, 'extensions', 'vscode');

/**
 * Creates an Open Packaging Conventions (OPC) ZIP / VSIX buffer from an array of file entries
 * @param {Array<{ path: string, content: Buffer | string }>} entries
 * @returns {Buffer}
 */
export function createZipArchive(entries) {
  const localHeaders = [];
  const centralHeaders = [];
  let currentOffset = 0;

  // Fixed DOS datetime: 2026-10-19 00:00:00
  const dosTime = 0x0000;
  const dosDate = ((2026 - 1980) << 9) | (10 << 5) | 19;

  for (const entry of entries) {
    const rawData = Buffer.isBuffer(entry.content) ? entry.content : Buffer.from(entry.content, 'utf8');
    const compressedData = deflateRawSync(rawData);
    const useCompression = compressedData.length < rawData.length;
    const finalData = useCompression ? compressedData : rawData;
    const method = useCompression ? 8 : 0;
    const fileCrc = crc32(rawData);
    const nameBuf = Buffer.from(entry.path, 'utf8');

    // Local file header (30 bytes + nameBuf.length + finalData.length)
    const localHeader = Buffer.alloc(30 + nameBuf.length);
    localHeader.writeUInt32LE(0x04034b50, 0); // signature
    localHeader.writeUInt16LE(20, 4);         // version needed to extract
    localHeader.writeUInt16LE(0, 6);          // general purpose bit flag
    localHeader.writeUInt16LE(method, 8);     // compression method
    localHeader.writeUInt16LE(dosTime, 10);   // last mod file time
    localHeader.writeUInt16LE(dosDate, 12);   // last mod file date
    localHeader.writeUInt32LE(fileCrc, 14);   // crc-32
    localHeader.writeUInt32LE(finalData.length, 18); // compressed size
    localHeader.writeUInt32LE(rawData.length, 22);   // uncompressed size
    localHeader.writeUInt16LE(nameBuf.length, 26);   // file name length
    localHeader.writeUInt16LE(0, 28);         // extra field length
    nameBuf.copy(localHeader, 30);

    localHeaders.push(localHeader, finalData);

    // Central directory header (46 bytes + nameBuf.length)
    const centralHeader = Buffer.alloc(46 + nameBuf.length);
    centralHeader.writeUInt32LE(0x02014b50, 0); // signature
    centralHeader.writeUInt16LE(20, 4);         // version made by
    centralHeader.writeUInt16LE(20, 6);         // version needed to extract
    centralHeader.writeUInt16LE(0, 8);          // bit flag
    centralHeader.writeUInt16LE(method, 10);    // compression method
    centralHeader.writeUInt16LE(dosTime, 12);   // mod time
    centralHeader.writeUInt16LE(dosDate, 14);   // mod date
    centralHeader.writeUInt32LE(fileCrc, 16);   // crc-32
    centralHeader.writeUInt32LE(finalData.length, 20); // compressed size
    centralHeader.writeUInt32LE(rawData.length, 24);   // uncompressed size
    centralHeader.writeUInt16LE(nameBuf.length, 28);   // file name length
    centralHeader.writeUInt16LE(0, 30);         // extra field length
    centralHeader.writeUInt16LE(0, 32);         // file comment length
    centralHeader.writeUInt16LE(0, 34);         // disk number start
    centralHeader.writeUInt16LE(0, 36);         // internal file attributes
    centralHeader.writeUInt32LE(0, 38);         // external file attributes
    centralHeader.writeUInt32LE(currentOffset, 42); // relative offset of local header
    nameBuf.copy(centralHeader, 46);

    centralHeaders.push(centralHeader);

    currentOffset += localHeader.length + finalData.length;
  }

  const centralDirOffset = currentOffset;
  const centralDirSize = centralHeaders.reduce((sum, h) => sum + h.length, 0);

  // End of central directory record (22 bytes)
  const eocd = Buffer.alloc(22);
  eocd.writeUInt32LE(0x06054b50, 0); // signature
  eocd.writeUInt16LE(0, 4);          // disk number
  eocd.writeUInt16LE(0, 6);          // disk with central dir
  eocd.writeUInt16LE(entries.length, 8);  // entries on disk
  eocd.writeUInt16LE(entries.length, 10); // total entries
  eocd.writeUInt32LE(centralDirSize, 12);  // central dir size
  eocd.writeUInt32LE(centralDirOffset, 16); // central dir offset
  eocd.writeUInt16LE(0, 20);         // comment length

  return Buffer.concat([...localHeaders, ...centralHeaders, eocd]);
}

/**
 * Validates extension files and manifest integrity
 * @param {string} [extensionDir]
 * @returns {Promise<Object>}
 */
export async function validateExtensionPackage(extensionDir = EXTENSION_DIR) {
  const pkgFile = path.join(extensionDir, 'package.json');
  const codeFile = path.join(extensionDir, 'extension.js');
  const readmeFile = path.join(extensionDir, 'README.md');

  const pkgRaw = await fs.readFile(pkgFile, 'utf8');
  const pkg = JSON.parse(pkgRaw);

  const errors = [];
  if (!pkg.name) errors.push('Missing package.json name');
  if (!pkg.version) errors.push('Missing package.json version');
  if (!pkg.publisher) errors.push('Missing package.json publisher');
  if (!pkg.engines?.vscode) errors.push('Missing engines.vscode constraint');
  if (!Array.isArray(pkg.contributes?.commands) || pkg.contributes.commands.length === 0) {
    errors.push('No contributed commands defined');
  }

  const code = await fs.readFile(codeFile, 'utf8');
  if (!code.includes('activate') || !code.includes('deactivate')) {
    errors.push('extension.js must export activate and deactivate functions');
  }

  const readme = await fs.readFile(readmeFile, 'utf8');
  if (readme.length < 50) {
    errors.push('README.md is too short');
  }

  return {
    valid: errors.length === 0,
    errors,
    pkg,
    commandsCount: pkg.contributes?.commands?.length || 0
  };
}

/**
 * Builds and packages the VSIX archive
 * @param {Object} [options]
 * @returns {Promise<Object>}
 */
export async function packageVsix(options = {}) {
  const extDir = options.extensionDir || EXTENSION_DIR;
  const validation = await validateExtensionPackage(extDir);

  if (!validation.valid) {
    throw new Error(`Extension validation failed: ${validation.errors.join(', ')}`);
  }

  const pkg = validation.pkg;
  const vsixFileName = `${pkg.name}-${pkg.version}.vsix`;
  const defaultOutputFile = path.join(extDir, vsixFileName);
  const outputFile = options.outputFile || defaultOutputFile;

  const pkgContent = await fs.readFile(path.join(extDir, 'package.json'), 'utf8');
  const codeContent = await fs.readFile(path.join(extDir, 'extension.js'), 'utf8');
  const readmeContent = await fs.readFile(path.join(extDir, 'README.md'), 'utf8');

  const contentTypesXml = `<?xml version="1.0" encoding="utf-8"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="json" ContentType="application/json"/>
  <Default Extension="js" ContentType="application/javascript"/>
  <Default Extension="md" ContentType="text/markdown"/>
  <Default Extension="vsixmanifest" ContentType="text/xml"/>
</Types>`;

  const vsixManifestXml = `<?xml version="1.0" encoding="utf-8"?>
<PackageManifest Version="2.0.0" xmlns="http://schemas.microsoft.com/developer/vsx-schema/2011" xmlns:d="http://schemas.microsoft.com/developer/vsx-schema-design/2011">
  <Metadata>
    <Identity Id="${pkg.name}" Version="${pkg.version}" Publisher="${pkg.publisher}" Language="en-US"/>
    <DisplayName>${pkg.displayName || pkg.name}</DisplayName>
    <Description xml:space="preserve">${pkg.description || 'Vibes-Plug Companion'}</Description>
    <Tags>${(pkg.keywords || []).join(',')}</Tags>
    <Categories>${(pkg.categories || ['Other']).join(',')}</Categories>
    <GalleryFlags>Public</GalleryFlags>
    <Properties>
      <Property Id="Microsoft.VisualStudio.Code.Engine" Value="${pkg.engines?.vscode || '^1.85.0'}"/>
      <Property Id="Microsoft.VisualStudio.Code.ExtensionDependencies" Value=""/>
      <Property Id="Microsoft.VisualStudio.Code.ExtensionPack" Value=""/>
      <Property Id="Microsoft.VisualStudio.Code.LocalizedLanguages" Value=""/>
      <Property Id="Microsoft.VisualStudio.Services.Links.Repository" Value="${pkg.repository?.url || ''}"/>
    </Properties>
  </Metadata>
  <Installation>
    <InstallationTarget Id="Microsoft.VisualStudio.Code"/>
  </Installation>
  <Dependencies/>
  <Assets>
    <Asset Type="Microsoft.VisualStudio.Code.Manifest" Path="extension/package.json" Addressable="true"/>
    <Asset Type="Microsoft.VisualStudio.Services.Content.Details" Path="extension/README.md" Addressable="true"/>
  </Assets>
</PackageManifest>`;

  const entries = [
    { path: '[Content_Types].xml', content: contentTypesXml },
    { path: 'extension.vsixmanifest', content: vsixManifestXml },
    { path: 'extension/package.json', content: pkgContent },
    { path: 'extension/extension.js', content: codeContent },
    { path: 'extension/README.md', content: readmeContent }
  ];

  const archiveBuffer = createZipArchive(entries);

  if (options.dryRun !== true) {
    await fs.mkdir(path.dirname(outputFile), { recursive: true });
    await fs.writeFile(outputFile, archiveBuffer);
  }

  return {
    success: true,
    dryRun: options.dryRun === true,
    vsixFile: outputFile,
    sizeBytes: archiveBuffer.length,
    entriesCount: entries.length,
    extensionName: pkg.name,
    version: pkg.version,
    commandsCount: validation.commandsCount
  };
}

async function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes('--dry-run');
  const outIdx = args.indexOf('--output');
  const outputFile = outIdx !== -1 ? args[outIdx + 1] : undefined;

  console.log(`
╔══════════════════════════════════════════════════════════╗
║    📦 Vibes-Plug VS Code & Cursor Extension Packager     ║
║    Pillar 6: Zero-Dependency Native VSIX Builder         ║
╚══════════════════════════════════════════════════════════╝
`);

  const outcome = await packageVsix({ dryRun, outputFile });

  console.log(`✅ Extension Package Built Successfully!`);
  console.log(`📦 VSIX File    : ${outcome.vsixFile}`);
  console.log(`🏷️  Version      : ${outcome.version}`);
  console.log(`⚡ Commands     : ${outcome.commandsCount} contributed commands`);
  console.log(`📊 Size         : ${outcome.sizeBytes.toLocaleString()} bytes (${outcome.entriesCount} internal assets)`);
  console.log(`🚀 Mode         : ${outcome.dryRun ? 'DRY-RUN (In-memory verification)' : 'PERSISTED (Ready for Marketplace install)'}\n`);
}

if (process.argv[1] && path.resolve(process.argv[1]) === path.resolve(__filename)) {
  main().catch(err => {
    console.error(`\n❌ Packaging Error: ${err.message}`);
    process.exit(1);
  });
}
