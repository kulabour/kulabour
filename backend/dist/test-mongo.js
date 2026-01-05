const { MongoMemoryServer } = require('mongodb-memory-server');
async function test() {
    try {
        const mongod = await MongoMemoryServer.create();
        console.log('MongoMemoryServer started:', mongod.getUri());
        await mongod.stop();
        console.log('MongoMemoryServer stopped');
    }
    catch (err) {
        console.error('Error:', err);
    }
}
test();
