import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = parseInt(process.env.PORT || '3000', 10);

// Explicitly serve verification files directly
app.get('/google3d9fd3ea1ac37887.html', (req, res) => {
  res.type('text/plain').send('google-site-verification: google3d9fd3ea1ac37887.html');
});

app.get('/googleNb55pdWZDpLKEWFYwF3MsbTxi8S_0gK16Azea25nLFs.html', (req, res) => {
  res.type('text/plain').send('google-site-verification: googleNb55pdWZDpLKEWFYwF3MsbTxi8S_0gK16Azea25nLFs.html');
});

app.get('/googleGsniwzUiipmqhTbhLSakOA3Wvcd4mBPk0wg6KwJnVfY.html', (req, res) => {
  res.type('text/plain').send('google-site-verification: googleGsniwzUiipmqhTbhLSakOA3Wvcd4mBPk0wg6KwJnVfY.html');
});

// Serve dist directory
app.use(express.static(path.join(__dirname, 'dist')));
// Fallback to public directory
app.use(express.static(path.join(__dirname, 'public')));

// SPA fallback
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server listening on port ${PORT}`);
});

export default app;
