export function getOptimizedCloudinaryUrl(
  url: string | undefined, 
  width = 600
): string {
  if (!url?.trim() || !url.includes("res.cloudinary.com")) {
    return url || "";
  }

  const cleanUrl = url.trim();

  // If it's already optimized by our app, don't touch it
  if (cleanUrl.includes("q_auto") || cleanUrl.includes("f_auto")) {
    return cleanUrl;
  }

  // Find where the asset path starts (right after /upload, /private, /authenticated, etc.)
  const deliveryTypes = ["/upload/", "/private/", "/authenticated/", "/fetch/"];
  let targetType = "";
  let splitIndex = -1;

  for (const type of deliveryTypes) {
    splitIndex = cleanUrl.indexOf(type);
    if (splitIndex !== -1) {
      targetType = type;
      break;
    }
  }

  // If the URL layout doesn't match standard Cloudinary structures, fallback safely
  if (splitIndex === -1) {
    return cleanUrl;
  }

  // Break it down into two clean halves
  const hostPart = cleanUrl.substring(0, splitIndex + targetType.length);
  const pathPart = cleanUrl.substring(splitIndex + targetType.length);

  // Inject our optimized parameters directly into the middle juncture
  return `${hostPart}f_auto,q_auto,w_${width}/${pathPart}`;
}