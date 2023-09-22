const AWS = require('aws-sdk')
const fs = require('fs')

const s3 = new AWS.S3()

export async function uploadImage(img){
// fs.readFile(img)
  await s3.putObject({
        Body: "hello world",
        Bucket: "webstore-api-images",
        Key: "helloworld.txt"
    }).promise();
}