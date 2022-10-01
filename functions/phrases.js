exports.handler = async (event, context) => {
    console.log('function ran')

    const data = { name: 'luigi', age: 35, job: 'electrician' }

    // return response to browser
    return {
        statusCode: 200,
        body: JSON.stringify(data)
    }
}
