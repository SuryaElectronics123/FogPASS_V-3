const fs = require('fs');
const express = require('express');
const router = express.Router();

router.get('/audios/:audioId', (req, response) => {
    streamAudio(req.params.audioId, response).then((res) => {
        console.log(res, req.params.audioId)
    }, (err) => {
        console.log('No Audio', req.params.audioId)
        streamAudio('no_audio',response)
    });
})

function streamAudio(audioId, response) {
    return new Promise((res, rej) => {
        try {
            response.header('Content-Disposition', `attachment; filename="${audioId}"`);
            response.header('Content-Type', 'audio/mpeg');
            const audioStream = fs.createReadStream(`./assets/audios/${audioId}.mp3`);

            audioStream.pipe(response);
            audioStream.on('error', (error) => {
                rej(error)
            });

            audioStream.on('end', () => {
                res(`Downloaded Audio File ${audioId}`);
            });
        }
        catch (err) {
            rej(err)

        }

    })
}


module.exports = router;