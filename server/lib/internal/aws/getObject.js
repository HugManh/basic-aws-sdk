module.exports = async function getObject(client, params) {
    try {
        return await client.getObject(params).promise()
    } catch (err) {
        throw new Error(err)
    }
}
