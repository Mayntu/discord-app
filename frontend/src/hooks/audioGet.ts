import { useRef, useState } from "react";

let [audioBlob,setAudioBlob] = useState<Blob>()
   
 
let [audio,setAudio] = useState<string>("")

const playAudio = useRef<HTMLAudioElement>(null)

const [permission, setPermission] = useState(false);
const mimeType = "audio/webm"
const [audioChunks, setAudioChunks] = useState([]);
const mediaRecorder = useRef<MediaRecorder>();
const [stream, setStream] = useState<MediaStream>();
const [recordingStatus, setRecordingStatus] = useState("inactive");


const getMicrophonePermission =async ()=>{
    if(navigator.mediaDevices && navigator.mediaDevices.getUserMedia){
      const streamData = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: false,
    });
    console.log(streamData)
    setPermission(true);
    setStream(streamData)
    }
  
  }

  const startRecording = async () => {
    setRecordingStatus("recording");
    //create new Media recorder instance using the stream
    const media = new MediaRecorder(stream);
    //set the MediaRecorder instance to the mediaRecorder ref
    mediaRecorder.current = media;
    //invokes the start method to start the recording process
    mediaRecorder.current.start();
    let localAudioChunks:any = [];
    mediaRecorder.current.ondataavailable = (event) => {
       if (typeof event.data === "undefined") return;
       if (event.data.size === 0) return;
       localAudioChunks.push(event.data);
    };
    setAudioChunks(localAudioChunks);
  };



  const stopRecording = () => {
    setRecordingStatus("inactive");
    //stops the recording instance
    mediaRecorder.current.stop();
    mediaRecorder.current.onstop = () => {
      //creates a blob file from the audiochunks data
       const audioBlob = new Blob(audioChunks, { type: mimeType });
       setAudioBlob(audioBlob)
      //creates a playable URL from the blob file.
       const audioUrl = URL.createObjectURL(audioBlob);
       setAudio(audioUrl);
       setAudioChunks([]);
    };
  };


    const serverSave=()=>{
      const formData = new FormData()
        if(audioBlob){
         
          formData.append('audio', audioBlob)
          dispatch(fetchMedia2(formData))
        }
      
    }