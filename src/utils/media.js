// Helper to detect and handle image and video media

export function isVideoMedia(url) {
  if (!url || typeof url !== 'string') return false;
  if (url.startsWith('data:video/')) return true;
  if (/\.(mp4|webm|ogg|mov)(\?.*)?$/i.test(url)) return true;
  if (/youtube\.com|youtu\.be|vimeo\.com/i.test(url)) return true;
  return false;
}

export function getEmbedVideoUrl(url) {
  if (!url || typeof url !== 'string') return null;
  
  // YouTube regular or short link
  const ytMatch = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i);
  if (ytMatch && ytMatch[1]) {
    return `https://www.youtube.com/embed/${ytMatch[1]}`;
  }
  
  // Vimeo
  const vimeoMatch = url.match(/vimeo\.com\/(?:channels\/(?:\w+\/)?|groups\/([^\/]*)\/videos\/|album\/(\d+)\/video\/|)(\d+)/i);
  if (vimeoMatch && vimeoMatch[3]) {
    return `https://player.vimeo.com/video/${vimeoMatch[3]}`;
  }
  
  return null;
}
