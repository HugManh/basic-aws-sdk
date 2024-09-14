const fs = require("fs-extra");
const path = require("path");
const axios = require('axios');
var _ = require('lodash');
const { s3 } = require("../../../config");
const { metadata, createS3Key } = require("../../utils/aws");
const { defaultFilePath } = require("./file");

const CHUNK_SIZE = 5 * 1024 * 1024; // 5MB
const bucketName = process.env.BUCKET_NAME || "yyyyyyyyyyyyyy";

async function multipartUpload(awsKey, metadata, buffer, useUrl = false) {
    try {
        const chunkPromises = [];
        let parts = []

        console.log("createMultipartUpload starting")
        const upload = await startUpload(awsKey, metadata)
        console.log("createMultipartUpload ended")
        const uploadId = upload.UploadId

        // Split the file into chunks and upload each part
        const totalParts = Math.ceil(mimedata.contentLength / CHUNK_SIZE);
        console.log({ uploadId, totalParts, mimedata });

        if (useUrl) {
            const partSignedUrlList = await getMultipartPreSignedUrls(objectKey, uploadId, totalParts)
            for (let idx = 1; idx <= totalParts; idx++) {
                const start = (idx - 1) * CHUNK_SIZE;
                const end = Math.min(start + CHUNK_SIZE, mimedata.contentLength);
                const chunk = buffer.slice(start, end)
                const uploadPart = partSignedUrlList.shift()

                console.log({ uploadId, PartNumber: idx, range: start + "-" + end + "/" + mimedata.contentLength, uploadPart });
                chunkPromises.push(
                    sendChunk(idx, chunk, uploadPart)
                        .then((data) => {
                            return data
                        })
                        .catch((err) => {
                            throw err
                        })
                )
            }
            parts = await Promise.all(chunkPromises);
        } else {
            for (let idx = 1; idx <= totalParts; idx++) {
                const start = (idx - 1) * CHUNK_SIZE;
                const end = Math.min(start + CHUNK_SIZE, mimedata.contentLength);
                const chunk = buffer.slice(start, end)

                const part = await uploadPart(objectKey, idx, uploadId, chunk)
                console.log({ uploadId, PartNumber: idx, range: start + "-" + end + "/" + mimedata.contentLength, part });
                parts.push({
                    // removing the " enclosing carachters from
                    // the raw ETag
                    ETag: part.ETag,
                    PartNumber: idx,
                });
            }
        }

        // Complete the multipart upload
        const complete = await completeUpload(objectKey, uploadId, parts)
        console.log("complete ", complete)

        const params = {
            Bucket: bucketName,
            Key: complete.Key,
        };
        const url = await s3.getSignedUrlPromise("getObject", params)
        console.log("url ", url)

    } catch (error) {
        console.error("[multipartUpload] Exception: " + error.message);
    }
}

async function startUpload(key, mimedata) {
    const params = {
        Bucket: bucketName,
        Key: key,
        ContentType: mimedata.contentType,
    };

    return await s3.createMultipartUpload(params).promise()
}


async function uploadPart(key, partNumber, uploadId, buffer) {
    const params = {
        Bucket: bucketName,
        Key: key,
        PartNumber: partNumber,
        UploadId: uploadId,
        Body: buffer
    };

    return await s3.uploadPart(params).promise()
}

async function getMultipartPreSignedUrls(key, uploadId, parts) {
    const multipartParams = {
        Bucket: bucketName,
        Key: key,
        UploadId: uploadId,
    }

    const promises = []

    for (let idx = 0; idx < parts; idx++) {
        promises.push(
            s3.getSignedUrlPromise("uploadPart", {
                ...multipartParams,
                PartNumber: idx + 1,
            }),
        )
    }
    const signedUrls = await Promise.all(promises)
    return signedUrls.map((signedUrl, index) => {
        return {
            signedUrl: signedUrl,
            PartNumber: index + 1,
        }
    })
}

async function completeUpload(key, uploadId, parts) {
    const params = {
        Bucket: bucketName,
        Key: key,
        UploadId: uploadId,
        MultipartUpload: {
            Parts: parts,
        },
    };

    console.log("[multipartUpload][completeUpload] params ", { uploadId, Parts: params.MultipartUpload.Parts });
    return await s3.completeMultipartUpload(params).promise();
}

function sendChunk(index, chunk, part) {
    return new Promise((resolve, reject) => {
        uploadChunk(chunk, part)
            .then((result) => {
                console.log("[sendChunk] ", index, result)
                if (result.status !== 200) {
                    reject(new Error("Failed chunk upload"))
                    return
                }

                resolve(result.part)
            })
            .catch((error) => {
                reject(error)
            })
    })
}

// uploading a part through its pre-signed URL
function uploadChunk(file, part) {
    // uploading each part with its pre-signed URL
    return new Promise((resolve, reject) => {
        try {
            // Đặt headers chính xác
            const headers = {
                'Content-Type': 'application/octet-stream',
                'Content-Length': file.length,
            };
            axios.put(part.signedUrl, file, { headers })
                .then(response => {
                    // Xử lý phản hồi thành công
                    const ETag = response.headers['etag']

                    if (ETag) {
                        const uploadedPart = {
                            PartNumber: part.PartNumber,
                            // removing the " enclosing carachters from
                            // the raw ETag
                            ETag: ETag.replaceAll('"', ""),
                        }
                        resolve({ status: response.status, part: uploadedPart })
                    }
                })
        } catch (error) {
            // Xử lý lỗi
            console.error('Error uploading file:', error)
            reject(error)
        }
    })
}

// Main function
const main = async () => {
    const fileInfo = processFile(defaultFilePath);
    const { metadata, buffer } = fileInfo;
    const awsKey = createAwsKey(metadata.fileName)
    await multipartUpload(awsKey, metadata, buffer)

    return data;
};

main().catch((err) => {
    console.error('Error:', err.message);
    process.exit(1);
});
