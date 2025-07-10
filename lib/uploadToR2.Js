export async function uploadToR2(filename, buffer) {
    const uploadUrl = `https://api.cloudflare.com/client/v4/accounts/${process.env.CLOUDFLARE_R2_ACCOUNT_ID}/r2/buckets/${process.env.CLOUDFLARE_R2_BUCKET_NAME}/objects/${filename}`;
  
    const res = await fetch(uploadUrl, {
      method: "PUT",
      headers: {
        "Authorization": `Bearer ${process.env.CLOUDFLARE_R2_API_TOKEN}`,
        "Content-Type": "audio/mpeg"
      },
      body: buffer
    });
  
    if (!res.ok) throw new Error("Upload to R2 failed");
  
    return `${process.env.CLOUDFLARE_R2_ENDPOINT}/${filename}`;
  }