// src/lib/pinataClient.ts
import axios from "axios";

// Use environment variables for security. Create a .env file with these values:
// REACT_APP_PINATA_API_KEY=your_pinata_api_key
// REACT_APP_PINATA_API_SECRET=your_pinata_api_secret
const PINATA_API_KEY = process.env.NEXT_PUBLIC_PINATA_API_KEY;
const PINATA_API_SECRET = process.env.NEXT_PUBLIC_PINATA_SECRET_API_KEY;
const PINATA_BASE_URL = "https://api.pinata.cloud";

export async function uploadToIPFSWithPinata(file: Blob): Promise<string> {
  // Create a file object from your Blob. (Name it as you want.)
  const fileToUpload = new File([file], "audit-report.pdf", { type: file.type });

  const url = `${PINATA_BASE_URL}/pinning/pinFileToIPFS`;
  const formData = new FormData();
  formData.append("file", fileToUpload);

  // Optionally, add metadata
  const metadata = JSON.stringify({
    name: "Audit Report PDF",
  });
  formData.append("pinataMetadata", metadata);

  try {
    const res = await axios.post(url, formData, {
      maxContentLength: Infinity,
      headers: {
        "Content-Type": `multipart/form-data; boundary=${(formData as any)._boundary}`,
        pinata_api_key: PINATA_API_KEY!,
        pinata_secret_api_key: PINATA_API_SECRET!,
      },
    });
    // The response should contain the IpfsHash (e.g., res.data.IpfsHash)
    const ipfsHash = res.data.IpfsHash;
    return `https://gateway.pinata.cloud/ipfs/${ipfsHash}`;
  } catch (error: any) {
    console.error("Pinata upload failed", error);
    throw new Error(error.response?.data?.error || "Pinata upload failed");
  }
}