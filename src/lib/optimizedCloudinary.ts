/**
 * Transforms a standard Cloudinary delivery URL into a highly optimized, 
 * modern-format image URL on the fly.
 */
export function getOptimizedImageUrl(url: string, width = 600): string {
  if (!url) return "";

  // If it's not a Cloudinary URL, return it as-is to avoid breaking the app
  if (!url.includes("res.cloudinary.com")) {
    return url;
  }

  // Cloudinary URLs look like: https://res.cloudinary.com/demo/image/upload/v123456/sample.jpg
  // We want to insert transformations right after '/upload/'
  const target = "/upload/";
  const index = url.indexOf(target);

  if (index === -1) return url;

  const insertionPoint = index + target.length;
  
  /**
   * Transformation Parameters Breakdown:
   * f_auto: Automatically converts to the best modern format (AVIF, WebP, etc.) for the browser
   * q_auto: Automatically applies the best compression-to-quality ratio
   * w_: Resizes the image width to prevent serving massive dimensions to small mobile screens
   * c_scale: Scales the image cleanly to the specified width
   */
  const transformations = `f_auto,q_auto,w_${width},c_scale/`;

  return url.slice(0, insertionPoint) + transformations + url.slice(insertionPoint);
}