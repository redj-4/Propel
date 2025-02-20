import { GlobalWorkerOptions } from 'pdfjs-dist/legacy/build/pdf';

// Use CDN worker for better caching and reliability
GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';