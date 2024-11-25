const { PutObjectCommand, S3Client } = require('@aws-sdk/client-s3')
const {getSignedUrl} = require('@aws-sdk/s3-request-presigner')
const { v4 } = require('uuid')

const createPresignedUrlWithClient = ({ region, bucket, key }) => {
    const client = new S3Client({ region, credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY_ID,
        secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
    }})
    const command = new PutObjectCommand({ Bucket: bucket, Key: key })
    return getSignedUrl(client, command, { expiresIn: 5000 })
}

const uploadFile = async (req, res) => {
    const key = `testuser/${v4()}.jpg`

    const url = await createPresignedUrlWithClient({region: 'us-east-1', bucket: 'upload-test-0d1n', key})

    res.json({key, url})
}

module.exports = {uploadFile}