import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

// Determine static root: prefer 'dist' if it exists, otherwise fall back to project root
const staticDir = fs.existsSync(path.join(__dirname, 'dist'))
  ? path.join(__dirname, 'dist')
  : __dirname;

// 1. Serve static assets with html extension support and proper headers
app.use(express.static(staticDir, {
  extensions: ['html'],
  maxAge: '1h',
  setHeaders: (res, filePath) => {
    if (filePath.endsWith('.css')) {
      res.setHeader('Content-Type', 'text/css; charset=UTF-8');
    } else if (filePath.endsWith('.js')) {
      res.setHeader('Content-Type', 'application/javascript; charset=UTF-8');
    } else if (filePath.endsWith('.svg')) {
      res.setHeader('Content-Type', 'image/svg+xml');
    }
  }
}));

// Also serve from project root as fallback for any asset during development
if (staticDir !== __dirname) {
  app.use(express.static(__dirname, {
    extensions: ['html'],
    maxAge: '1h'
  }));
}

// 2. Explicit clean routes for all standalone pages
app.get('/about', (_req, res) => {
  res.sendFile(path.join(staticDir, 'about-us.html'));
});
app.get('/about-us', (_req, res) => {
  res.sendFile(path.join(staticDir, 'about-us.html'));
});
app.get('/doctors', (_req, res) => {
  res.sendFile(path.join(staticDir, 'doctors.html'));
});
app.get('/faq', (_req, res) => {
  res.sendFile(path.join(staticDir, 'faq.html'));
});
app.get('/contact', (_req, res) => {
  res.sendFile(path.join(staticDir, 'contact.html'));
});

// 3. Asset 404 guard: Do NOT send index.html for missing CSS, JS, image, or font files!
// Sending HTML for CSS/JS causes Chrome to reject stylesheets and fail images.
const ASSET_EXTENSIONS = /\.(css|js|map|png|jpg|jpeg|gif|svg|webp|ico|woff|woff2|ttf|eot|otf)$/i;
app.use((req, res, next) => {
  if (ASSET_EXTENSIONS.test(req.path)) {
    res.status(404).type('text/plain').send('Asset not found');
    return;
  }
  next();
});

// 4. Default fallback to index.html for page navigation
app.get('*', (_req, res) => {
  res.sendFile(path.join(staticDir, 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Innova Dental server running on http://0.0.0.0:${PORT} (serving from ${staticDir})`);
});
