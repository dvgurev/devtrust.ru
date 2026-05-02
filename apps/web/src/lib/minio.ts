import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"
import { randomUUID } from "crypto"

const s3Client = new S3Client({
  endpoint: `http://${process.env.MINIO_ENDPOINT}:${process.env.MINIO_PORT}`,
  region: "us-east-1",
  credentials: {
    accessKeyId: process.env.MINIO_ROOT_USER!,
    secretAccessKey: process.env.MINIO_ROOT_PASSWORD!,
  },
  forcePathStyle: true,
})

const ALLOWED_TYPES = {
  avatar: ["image/jpeg", "image/png", "image/webp"],
  screenshot: ["image/jpeg", "image/png", "image/webp", "application/pdf"],
}

const MAX_SIZES = {
  avatar: 5 * 1024 * 1024, // 5MB
  screenshot: 10 * 1024 * 1024, // 10MB
}

export async function getUploadUrl(
  type: "avatar" | "screenshot",
  contentType: string,
  userId: string
): Promise<{ uploadUrl: string; fileUrl: string; key: string }> {
  const bucket = type === "avatar" 
    ? process.env.MINIO_BUCKET_AVATARS 
    : process.env.MINIO_BUCKET_SCREENSHOTS
  
  if (!ALLOWED_TYPES[type].includes(contentType)) {
    throw new Error("Недопустимый тип файла")
  }
  
  const ext = contentType.split("/")[1]
  const key = `${type}/${userId}/${randomUUID()}.${ext}`
  
  const command = new PutObjectCommand({
    Bucket: bucket,
    Key: key,
    ContentType: contentType,
  })
  
  const uploadUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 })
  const fileUrl = `http://${process.env.MINIO_ENDPOINT}:${process.env.MINIO_PORT}/${bucket}/${key}`
  
  return { uploadUrl, fileUrl, key }
}

export async function getDownloadUrl(key: string, bucket: string): Promise<string> {
  const command = new GetObjectCommand({
    Bucket: bucket,
    Key: key,
  })
  
  return getSignedUrl(s3Client, command, { expiresIn: 3600 })
}