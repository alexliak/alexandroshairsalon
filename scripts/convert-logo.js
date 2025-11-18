const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const logoPath = path.join(__dirname, '../public/images/logo.jpg');
const outputDir = path.join(__dirname, '../public');

// Ensure output directory exists
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

async function convertLogo() {
  try {
    // Convert to favicon.ico (32x32)
    await sharp(logoPath)
      .resize(32, 32, { fit: 'contain', background: { r: 18, g: 15, b: 24, alpha: 1 } })
      .png()
      .toFile(path.join(outputDir, 'favicon.png'));

    // Convert to logo192.png
    await sharp(logoPath)
      .resize(192, 192, { fit: 'contain', background: { r: 18, g: 15, b: 24, alpha: 1 } })
      .png()
      .toFile(path.join(outputDir, 'logo192.png'));

    // Convert to logo512.png
    await sharp(logoPath)
      .resize(512, 512, { fit: 'contain', background: { r: 18, g: 15, b: 24, alpha: 1 } })
      .png()
      .toFile(path.join(outputDir, 'logo512.png'));

    console.log('✅ Logo files created successfully!');
    console.log('   - favicon.png');
    console.log('   - logo192.png');
    console.log('   - logo512.png');
  } catch (error) {
    console.error('❌ Error converting logo:', error);
    process.exit(1);
  }
}

convertLogo();

