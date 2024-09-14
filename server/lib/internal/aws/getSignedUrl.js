module.exports = async function getSignedUrl(client, operation, params) {
    try {
        return await client.getSignedUrlPromise(operation, params)
    } catch (err) {
        throw new Error(err)
    }
}
