import { copyFileSync, mkdirSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const workerPath = require.resolve('pdfjs-dist/build/pdf.worker.min.js');
const publicDir = join(__dirname, 'public');

try {
  mkdirSync(publicDir, { recursive: true });
  copyFileSync(workerPath, join(publicDir, 'pdf.worker.min.js'));
  console.log('PDF.js worker file copied successfully');
} catch (error) {
  console.error('Error copying PDF.js worker file:', error);
  process.exit(1);
}