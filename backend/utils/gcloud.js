const {Storage} = require('@google-cloud/storage');

const storage = new Storage();
const bucket = 'cs130skullstrip';

if(process.env.CI){
    exports.generateV4UploadSignedUrl = async function generateV4UploadSignedUrl(){
        return "http://test_url";
    };
    exports.deleteFile = async function deleteFile() {};
    return;
}

exports.generateV4UploadSignedUrl = async function generateV4UploadSignedUrl(expireMinutes, file) {
    // These options will allow temporary uploading of the file with outgoing
    // Content-Type: application/octet-stream header.
    const options = {
        version: 'v4',
        action: 'write',
        expires: Date.now() + expireMinutes * 60 * 1000, // 15 minutes
        contentType: 'application/octet-stream',
    };

    // Get a v4 signed URL for uploading file
    const [url] = await storage
        .bucket(bucket)
        .file(file)
        .getSignedUrl(options);
    console.log('Generated PUT signed URL:');
    console.log(url);
    console.log('You can use this URL with any user agent, for example:');
    console.log(
        "curl -X PUT -H 'Content-Type: application/octet-stream' " +
        `--upload-file my-file '${url}'`
    );

    return url;
};

exports.deleteFile = async function deleteFile(file) {
    await storage
        .bucket(bucket)
        .file(file)
        .delete();

    console.log(`gs://${bucket}/${file} deleted.`);
};