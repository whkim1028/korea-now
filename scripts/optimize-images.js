#!/usr/bin/env node

/**
 * Image Optimization Script for Black & White Chef Episode Images
 *
 * This script optimizes JPEG images in the black_white_chef directory:
 * - Converts to WebP format (smaller file size)
 * - Resizes to max 1920px width
 * - Compresses with 85% quality
 * - Backs up original files
 *
 * Usage:
 *   npm install sharp
 *   node scripts/optimize-images.js
 */

const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const BASE_DIR = path.join(__dirname, '../public/black_white_chef');
const BACKUP_DIR = path.join(__dirname, '../public/black_white_chef_backup');
const MAX_WIDTH = 1920;
const QUALITY = 85;

// Ensure backup directory exists
if (!fs.existsSync(BACKUP_DIR)) {
  fs.mkdirSync(BACKUP_DIR, { recursive: true });
}

async function optimizeImage(inputPath, outputPath, backupPath) {
  try {
    // Backup original
    const backupDir = path.dirname(backupPath);
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir, { recursive: true });
    }

    // Only backup if not already backed up
    if (!fs.existsSync(backupPath)) {
      fs.copyFileSync(inputPath, backupPath);
      console.log(`   Backed up: ${path.basename(inputPath)}`);
    }

    // Get original file size
    const originalStats = fs.statSync(inputPath);
    const originalSizeMB = (originalStats.size / 1024 / 1024).toFixed(2);

    // Optimize and convert to WebP
    const outputPathWebP = outputPath.replace(/\.(jpe?g|png)$/i, '.webp');

    await sharp(inputPath)
      .resize(MAX_WIDTH, null, {
        withoutEnlargement: true,
        fit: 'inside'
      })
      .webp({ quality: QUALITY })
      .toFile(outputPathWebP);

    // Get optimized file size
    const optimizedStats = fs.statSync(outputPathWebP);
    const optimizedSizeMB = (optimizedStats.size / 1024 / 1024).toFixed(2);
    const reduction = ((1 - optimizedStats.size / originalStats.size) * 100).toFixed(1);

    console.log(`   Optimized: ${path.basename(inputPath)}`);
    console.log(`    ${originalSizeMB} MB � ${optimizedSizeMB} MB (${reduction}% smaller)`);

    return { original: originalStats.size, optimized: optimizedStats.size };
  } catch (error) {
    console.error(`   Error optimizing ${path.basename(inputPath)}:`, error.message);
    return { original: 0, optimized: 0 };
  }
}

async function processDirectory(dirPath) {
  const items = fs.readdirSync(dirPath);
  const stats = { totalOriginal: 0, totalOptimized: 0, count: 0 };

  for (const item of items) {
    const itemPath = path.join(dirPath, item);
    const stat = fs.statSync(itemPath);

    if (stat.isDirectory()) {
      // Skip backup directory
      if (item === 'black_white_chef_backup') continue;

      console.log(`\n=� Processing folder: ${item}`);
      const subStats = await processDirectory(itemPath);
      stats.totalOriginal += subStats.totalOriginal;
      stats.totalOptimized += subStats.totalOptimized;
      stats.count += subStats.count;
    } else if (/\.(jpe?g|png)$/i.test(item)) {
      // Process JPEG and PNG files
      const relativePath = path.relative(BASE_DIR, itemPath);
      const backupPath = path.join(BACKUP_DIR, relativePath);
      const outputPath = itemPath;

      const result = await optimizeImage(itemPath, outputPath, backupPath);
      stats.totalOriginal += result.original;
      stats.totalOptimized += result.optimized;
      stats.count++;
    }
  }

  return stats;
}

async function main() {
  console.log('=�  Black & White Chef Image Optimization\n');
  console.log('Settings:');
  console.log(`  - Max width: ${MAX_WIDTH}px`);
  console.log(`  - Quality: ${QUALITY}%`);
  console.log(`  - Format: WebP`);
  console.log(`  - Backup location: ${BACKUP_DIR}\n`);

  if (!fs.existsSync(BASE_DIR)) {
    console.error(`L Directory not found: ${BASE_DIR}`);
    process.exit(1);
  }

  const startTime = Date.now();
  const stats = await processDirectory(BASE_DIR);
  const duration = ((Date.now() - startTime) / 1000).toFixed(1);

  console.log('\n Optimization Complete!');
  console.log(`\nSummary:`);
  console.log(`  - Images processed: ${stats.count}`);
  console.log(`  - Total original size: ${(stats.totalOriginal / 1024 / 1024).toFixed(2)} MB`);
  console.log(`  - Total optimized size: ${(stats.totalOptimized / 1024 / 1024).toFixed(2)} MB`);

  if (stats.totalOriginal > 0) {
    const totalReduction = ((1 - stats.totalOptimized / stats.totalOriginal) * 100).toFixed(1);
    console.log(`  - Total reduction: ${totalReduction}%`);
  }

  console.log(`  - Time taken: ${duration}s`);
  console.log(`\n=� Next steps:`);
  console.log(`  1. Update code to use .webp extensions`);
  console.log(`  2. Test the website to ensure images load correctly`);
  console.log(`  3. Original files are backed up in: ${BACKUP_DIR}`);
}

main().catch(console.error);
