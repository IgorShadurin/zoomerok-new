const app = require('./app');
const fs = require('fs');
require('dotenv').config();
const port = process.env.PORT || 8080;

function validateEnv() {
    const staticPath = process.env.APP_STATIC_VIDEO_PATH;
    if (!(staticPath && fs.existsSync(staticPath))) {
        throw new Error('Video path not exists');
    }

    try {
        const testFile = `${staticPath}/test.txt`;
        if (fs.existsSync(testFile)) {
            fs.rmSync(testFile);
        }

        fs.writeFileSync(testFile, 'Some data');
        fs.rmSync(testFile);
    } catch (e) {
        throw new Error(`Static dir is not writable? ${e.message}`);
    }
}

validateEnv();
app.listen(port, () => console.log(`Started server at http://localhost:${port}!`));
