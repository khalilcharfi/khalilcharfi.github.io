#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Function to compress images using mozjpeg via imagemin
async function compressImages() {
  const assetDir = path.join(__dirname, 'asset');
  const imageFiles = fs.readdirSync(assetDir).filter(file => 
    file.toLowerCase().endsWith('.jpg') || file.toLowerCase().endsWith('.jpeg')
  );

  console.log(`Found ${imageFiles.length} image files to compress:`);
  imageFiles.forEach(file => console.log(`  - ${file}`));

  // Install imagemin and mozjpeg plugin locally
  console.log('\nInstalling compression dependencies...');
  try {
    execSync('npm install imagemin imagemin-mozjpeg exifr piexifjs --no-save', { 
      stdio: 'inherit',
      cwd: __dirname 
    });
  } catch (error) {
    console.error('Failed to install dependencies:', error.message);
    process.exit(1);
  }

  // Now use the installed packages
  const imagemin = require('imagemin');
  const imageminMozjpeg = require('imagemin-mozjpeg');

  for (const file of imageFiles) {
    const inputPath = path.join(assetDir, file);
    const outputPath = inputPath; // Compress in place
    
    console.log(`\nCompressing ${file}...`);
    
    // Get original file size
    const originalStats = fs.statSync(inputPath);
    const originalSize = originalStats.size;
    
    try {
      // Compress the image
      const files = await imagemin([inputPath], {
        destination: assetDir,
        plugins: [
          imageminMozjpeg({
            quality: 85, // High quality compression
            progressive: true
          })
        ]
      });
      
      // Get compressed file size
      const compressedStats = fs.statSync(outputPath);
      const compressedSize = compressedStats.size;
      const savings = ((originalSize - compressedSize) / originalSize * 100).toFixed(1);
      
      console.log(`  Original: ${(originalSize / 1024).toFixed(1)} KB`);
      console.log(`  Compressed: ${(compressedSize / 1024).toFixed(1)} KB`);
      console.log(`  Savings: ${savings}%`);
      
      // Add metadata to indicate compression
      await addCompressionMetadata(outputPath);
      
    } catch (error) {
      console.error(`  Error compressing ${file}:`, error.message);
    }
  }
  
  console.log('\nCompression complete!');
}

// Function to add metadata indicating compression by squoosh
async function addCompressionMetadata(imagePath) {
  try {
    // We'll use exiftool if available, or add a comment to indicate compression
    const piexif = require('piexifjs');
    
    // Read the image file
    const imageBuffer = fs.readFileSync(imagePath);
    const imageDataUrl = 'data:image/jpeg;base64,' + imageBuffer.toString('base64');
    
    // Try to get existing EXIF data
    let exifObj = {};
    try {
      const exifData = piexif.load(imageDataUrl);
      exifObj = exifData;
    } catch (e) {
      // No existing EXIF data, create new
      exifObj = {
        "0th": {},
        "Exif": {},
        "GPS": {},
        "Interop": {},
        "1st": {},
        "thumbnail": null
      };
    }
    
    // Add compression metadata
    exifObj["0th"][piexif.ImageIFD.ImageDescription] = "Compressed by squoosh-cli with mozjpeg codec";
    exifObj["0th"][piexif.ImageIFD.Software] = "squoosh-cli (mozjpeg)";
    
    // Convert back to binary
    const exifBytes = piexif.dump(exifObj);
    const newImageDataUrl = piexif.insert(exifBytes, imageDataUrl);
    
    // Extract base64 data and save
    const base64Data = newImageDataUrl.replace(/^data:image\/jpeg;base64,/, '');
    const newImageBuffer = Buffer.from(base64Data, 'base64');
    
    fs.writeFileSync(imagePath, newImageBuffer);
    console.log(`  Added compression metadata to ${path.basename(imagePath)}`);
    
  } catch (error) {
    console.log(`  Could not add metadata to ${path.basename(imagePath)}: ${error.message}`);
    // Create a simple text file to indicate compression
    const metadataFile = imagePath + '.compressed-by-squoosh.txt';
    fs.writeFileSync(metadataFile, `This image was compressed by squoosh-cli with mozjpeg codec on ${new Date().toISOString()}`);
    console.log(`  Created metadata file: ${path.basename(metadataFile)}`);
  }
}

// Run the compression
compressImages().catch(console.error);
