
 function buildImageUrl(filename) {
  if (!filename) return null;
  const base = (process.env.BASE_URL || 'http://localhost:3000').replace(/\/$/, '');
  return `${base}/uploads/${filename}`;
}

module.exports = {
  buildImageUrl,
};