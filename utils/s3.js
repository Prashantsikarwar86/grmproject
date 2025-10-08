const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3')
const path = require('path')

const bucket = process.env.S3_BUCKET || null
const region = process.env.AWS_REGION || process.env.AWS_DEFAULT_REGION || null

let client = null
if (bucket && region && process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY) {
  client = new S3Client({ region })
}

async function uploadBuffer(key, buffer, contentType) {
  if (!client) return null
  const cmd = new PutObjectCommand({ Bucket: bucket, Key: key, Body: buffer, ContentType: contentType })
  await client.send(cmd)
  return `https://${bucket}.s3.${region}.amazonaws.com/${encodeURIComponent(key)}`
}

module.exports = { uploadBuffer, bucket }
