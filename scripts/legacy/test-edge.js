const { MsEdgeTTS, OUTPUT_FORMAT } = require('msedge-tts');

(async () => {
    try {
        const tts = new MsEdgeTTS();
        await tts.setMetadata("es-CO-SalomeNeural", OUTPUT_FORMAT.AUDIO_24KHZ_48KBITRATE_MONO_MP3);
        const { audioStream } = tts.toStream("Hola mundo, soy la nueva IA");

        let chunks = [];
        audioStream.on('data', chunk => chunks.push(chunk));
        audioStream.on('close', () => {
            console.log(`Success! Synthesized ${Buffer.concat(chunks).length} bytes of audio.`);
        });
        audioStream.on('error', err => console.error("Stream error:", err));
    } catch (err) {
        console.error("Setup error:", err);
    }
})();
