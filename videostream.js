const startButton = document.getElementById('startButton');
const stopButton = document.getElementById('stopButton');
const video = document.getElementById('video');
let mediaRecorder;
let recordedBlobs = [];
let startTime = 0;
let timerId;

startButton.addEventListener('click', () => {
    startButton.disabled = true;
    stopButton.disabled = false;
    recordedBlobs = [];
    startTime = Date.now();

    navigator.mediaDevices.getUserMedia({ audio: true, video: true })
        .then(stream => {
            handleStream(stream);
        })
        .catch(error => {
            console.error('Error accessing media devices.', error);
        });
});

stopButton.addEventListener('click', () => {
    stopButton.disabled = true;
    startButton.disabled = false;
    clearInterval(timerId);
    mediaRecorder.stop();
});

function handleStream(stream) {
    video.srcObject = stream;

    const options = { mimeType: 'video/webm;codecs=vp9' };
    mediaRecorder = new MediaRecorder(stream, options);
    
    mediaRecorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
            recordedBlobs.push(event.data);
            // Do nothing for now until a backend is in place
            // saveChunkToServer(recordedBlobs);
        }
    };

    mediaRecorder.onstop = () => {
        // Save any remaining data
        if (recordedBlobs.length > 0) {
            // Do nothing for now until a backend is in place
            // saveChunkToServer(recordedBlobs);
        }
    };

    mediaRecorder.start(5000);
}

// Can be used for testing purposes, saves chunks to file system
function saveChunkToFile(chunkData) {
    // Create a Blob from the chunk data
    const blob = new Blob(chunkData, { type: 'video/webm' });

    // Create a URL for the Blob
    const url = window.URL.createObjectURL(blob);

    // Create a temporary anchor element
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = `recording_chunk_${Date.now()}.webm`; // Use timestamp for unique filename
    document.body.appendChild(a);

    // Trigger a click to initiate the download
    a.click();

    // Revoke the object URL to release resources
    window.URL.revokeObjectURL(url);

    // Clear recordedBlobs after saving
    recordedBlobs = [];
}

// TODO: Function below will be used when a backend is attached, saves chunks to some storage
function saveChunkToServer(chunkData) {
    const blob = new Blob(chunkData, { type: 'application/json' });
    const formData = new FormData();
    formData.append('videoChunk', blob, 'video_chunk.webm');

    fetch('https://localhost:44350' + '/savevideo', {
        method: 'POST',
        headers: {
        },
        body: formData,
        mode: 'no-cors'
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            console.log('Chunk saved to server successfully');
            recordedBlobs = []; // Clear recordedBlobs after successful upload
        })
        .catch(error => {
            console.error('Error saving chunk to server:', error);
        });
}