const MongoClient = require("mongodb").MongoClient;

const MONGODB_URI = process.env.MONGO_URI;
const DB_NAME = 'corporate';

let cachedDb = null;

const connectToDatabase = async (uri) => {
    // we can cache the access to our database to speed things up a bit
    // (this is the only thing that is safe to cache here)
    if (cachedDb) return cachedDb;

    const client = await MongoClient.connect(uri, {
        useUnifiedTopology: true,
    });

    cachedDb = client.db(DB_NAME);

    return cachedDb;
};

const queryDatabase = async (db) => {
    const phrases = await db.collection("phrases").find({}).toArray();

    return {
        statusCode: 200,
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(phrases),
    };
};

module.exports.handler = async (event, context) => {
    // otherwise the connection will never complete, since
    // we keep the DB connection alive
    context.callbackWaitsForEmptyEventLoop = false;

    const db = await connectToDatabase(MONGODB_URI);
    return queryDatabase(db);
};

// exports.handler = async (event, context) => {
//     console.log('function ran')
//
//     const data = { name: 'luigi', age: 35, job: 'electrician' }
//
//     // return response to browser
//     return {
//         statusCode: 200,
//         body: JSON.stringify(data)
//     }
// }
