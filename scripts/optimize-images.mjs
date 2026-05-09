import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const publicDir = path.resolve(__dirname, '../public');

async function optimize() {
  const files = fs.readdirSync(publicDir);
  for (const file of files) {
    if (file.match(/\.(jpg|jpeg|png)$/i)) {
      const filePath = path.join(publicDir, file);
      const stat = fs.statSync(filePath);
      
      // Optimize files larger than 400KB
      if (stat.size > 400 * 1024) {
        console.log(`Optimizing ${file} (Original size: ${(stat.size / 1024 / 1024).toFixed(2)} MB)...`);
        const tempPath = filePath + '.tmp';
        try {
          const image = sharp(filePath);
          const metadata = await image.metadata();
          
          let pipeline = image.resize(1600, 1600, { fit: 'inside', withoutEnlargement: true });
          
          if (metadata.format === 'jpeg' || metadata.format === 'jpg') {
            pipeline = pipeline.jpeg({ quality: 80, progressive: true });
          } else if (metadata.format === 'png') {
            pipeline = pipeline.png({ quality: 80, compressionLevel: 9 });
          }

          await pipeline.toFile(tempPath);
          fs.renameSync(tempPath, filePath);
          
          const newStat = fs.statSync(filePath);
          console.log(`Optimized ${file} -> New size: ${(newStat.size / 1024 / 1024).toFixed(2)} MB`);
        } catch (e) {
          console.error(`Failed to optimize ${file}:`, e);
          if (fs.existsSync(tempPath)) fs.unlinkSync(tempPath);
        }
      }
    }
  }
}

optimize();
