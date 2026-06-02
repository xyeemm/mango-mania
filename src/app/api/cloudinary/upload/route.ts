import { createHash } from "node:crypto";

type CloudinaryUploadResponse = {
  secure_url?: string;
  url?: string;
};

const cloudName =
  process.env.CLOUDINARY_CLOUD_NAME ??
  process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;
const uploadFolder =
  process.env.CLOUDINARY_FOLDER ??
  process.env.NEXT_PUBLIC_CLOUDINARY_FOLDER ??
  "mango-mania/products";

function signUploadParams(params: Record<string, string>) {
  const sortedParams = Object.entries(params)
    .filter(([, value]) => value !== "")
    .sort(([leftKey], [rightKey]) => leftKey.localeCompare(rightKey))
    .map(([key, value]) => `${key}=${value}`)
    .join("&");

  return createHash("sha1")
    .update(`${sortedParams}${apiSecret}`)
    .digest("hex");
}

export async function POST(request: Request) {
  if (!cloudName || !apiKey || !apiSecret) {
    return Response.json(
      {
        error:
          "Signed Cloudinary upload is not configured. Add CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET.",
      },
      { status: 500 }
    );
  }

  const requestData = await request.formData();
  const file = requestData.get("file");

  if (!(file instanceof File) || !file.type.startsWith("image/")) {
    return Response.json(
      { error: "Upload requires an image file." },
      { status: 400 }
    );
  }

  const timestamp = Math.round(Date.now() / 1000).toString();
  const paramsToSign = {
    folder: uploadFolder,
    timestamp,
  };

  const uploadData = new FormData();
  uploadData.append("file", file);
  uploadData.append("api_key", apiKey);
  uploadData.append("folder", uploadFolder);
  uploadData.append("timestamp", timestamp);
  uploadData.append("signature", signUploadParams(paramsToSign));

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    {
      method: "POST",
      body: uploadData,
    }
  );

  const result = (await response.json()) as CloudinaryUploadResponse & {
    error?: { message?: string };
  };

  if (!response.ok) {
    return Response.json(
      {
        error:
          result.error?.message ??
          "Cloudinary upload failed. Check your credentials and folder settings.",
      },
      { status: response.status }
    );
  }

  return Response.json({
    url: result.secure_url ?? result.url,
  });
}
