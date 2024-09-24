document.addEventListener("DOMContentLoaded", function () {
    let preview = document.getElementById("preview");
    let recording = document.getElementById("recording");
    let startButton = document.getElementById("startButton");
    let stopButton = document.getElementById("stopButton");
    let logElement = document.getElementById("log");
  
    let mediaStream; // Variable to hold the media stream
    let recorder; // Variable to hold the MediaRecorder instance
    let recordedChunks = []; // Array to store recorded data
  
    function log(msg) {
      logElement.innerHTML += msg + "<br>"; // Use <br> for line breaks
    }
  
    function startRecording(stream) {
      recorder = new MediaRecorder(stream);
      recordedChunks = []; // Reset recorded chunks
  
      recorder.ondataavailable = event => recordedChunks.push(event.data);
      recorder.start();
      log("Recording started...");
  
      recorder.onstop = () => {
        let recordedBlob = new Blob(recordedChunks, { type: "video/webm" });
        if (recording) {
          recording.src = URL.createObjectURL(recordedBlob);
          recording.style.display = 'block'; // Show the recorded video
        }
        log("Recording stopped. Recorded " + recordedBlob.size + " bytes.");
      };
    }
  
    startButton.addEventListener("click", function () {
      navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      }).then(stream => {
        mediaStream = stream; // Store the media stream
        preview.srcObject = mediaStream;
        preview.captureStream = preview.captureStream || preview.mozCaptureStream;
  
        startRecording(preview.captureStream());
        
        // Ensure the recording is hidden at the start
        if (recording) {
          recording.style.display = 'none'; 
        }
      }).catch(log);
    }, false);
  
    stopButton.addEventListener("click", function () {
      if (recorder && recorder.state === "recording") {
        recorder.stop(); // Stop the recording
        mediaStream.getTracks().forEach(track => track.stop()); // Stop the media stream
        preview.srcObject = null; // Clear the preview
  
        // Hide the recording when stopping
        if (recording) {
          recording.style.display = 'none'; // Hide the recording element
        }
      }
    }, false);
  });
  
  
  
   