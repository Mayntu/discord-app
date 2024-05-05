import { ChangeEvent, FC, useEffect, useRef, useState } from "react"
import Add from "./Add"
import InputEmoji from "react-input-emoji";
import micImage from "../assets/microphone.png"
import { socket } from "../socket";
import { useParams } from "react-router-dom";

interface  IInputMessage{
  dropImage : (e:React.DragEvent<HTMLDivElement>)=>void,
  sendMessage: ()=> void,
  setFile:  React.Dispatch<React.SetStateAction<any>>,
  setMessageText : React.Dispatch<React.SetStateAction<string>>,
  messageText :string,
  setAudioBlob:React.Dispatch<React.SetStateAction<Blob| undefined>> 
}



const InputMessage:FC<IInputMessage>=({dropImage,sendMessage,setFile,setMessageText,messageText, setAudioBlob})=> {
  const refImage = useRef<HTMLInputElement>(null) 
  const [stream, setStream] = useState<MediaStream>();
  const [permission, setPermission] = useState<boolean>(false);
  const [recordingStatus, setRecordingStatus] = useState<"inactive" | "recording">("inactive");
  const [audioChunks, setAudioChunks] = useState([]);
  const {chatid,chatserverid,serverid} = useParams()
  // const [timer, setTimer] = useState("00.00.00");
  const mediaRecorder = useRef<MediaRecorder>();
 


  const getMicrophonePermission =async ()=>{
    if(navigator.mediaDevices && navigator.mediaDevices.getUserMedia){
      const streamData = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: false,
    });
    console.log(streamData, "startMedia")
    setPermission(true);
    setStream(streamData)
   
    }
  
  }


  
  const startRecording = async () => {
    setRecordingStatus("recording");
    //create new Media recorder instance using the stream
    console.log("streamStart")
    if(stream){
      const media = new MediaRecorder(stream);
      //set the MediaRecorder instance to the mediaRecorder ref
      mediaRecorder.current = media;
      //invokes the start method to start the recording process
      // let start = 0
      // setInterval(()=>{
      //   start=1 + start
      //   console.log("in",start)
      //   setTimer((prev)=>prev+`00.00.1${+start}`)
      //   console.log("in",start,timer)
      // },1000)
      mediaRecorder.current.start();
      let localAudioChunks:any = [];
      mediaRecorder.current.ondataavailable = (event) => {
         if (typeof event.data === "undefined") return;
         if (event.data.size === 0) return;
         localAudioChunks.push(event.data);
      };
      setAudioChunks(localAudioChunks);
      console.log("streamStart")
    }
  
  };

  const stopRecording = () => {
    setRecordingStatus("inactive");
    //stops the recording instance
    mediaRecorder.current.stop();
    mediaRecorder.current.onstop = () => {
      //creates a blob file from the audiochunks data
       const audioBlob = new Blob(audioChunks, { type:  'audio/mp3' });
       setAudioBlob(audioBlob)
      //creates a playable URL from the blob file.
      //  const audioUrl = URL.createObjectURL(audioBlob);
       setAudioChunks([]);
       console.log("Stop")
      //  const formData = new FormData()
       if(audioBlob){
         console.log("fetchaudio")
        setAudioBlob(audioBlob)
        if(audioBlob){
          console.log("audioBlob",audioBlob)
          if(chatid){
            socket.emit("message", {
              "data" : "что писать?", 
              "chat_id" : chatid,
              "token" : localStorage.getItem("token"), 
              media:{file : audioBlob, name : "audio/mp3"} });
          }
          if(chatserverid){
            socket.emit("server_chat_message", {
              "data" : "что писать?", 
              "chat_id" : chatserverid, 
              "server_id" : serverid,
              "token" : localStorage.getItem("token"), 
              media:  {file : audioBlob, name : "audio/mp3"}});
          }
       
            setAudioBlob(undefined)
        }
       }
    };
 
  };





    useEffect(()=>{
      getMicrophonePermission()
    },[])

  const micClick= async()=>{
    if(!permission){
      await getMicrophonePermission()
    }
    if(permission && recordingStatus === "inactive"){
      startRecording()
    }

    if(recordingStatus === "recording"){
      stopRecording()
    }
  }

  return (
    <div className="message-input-container" 
    onDrop={(e)=>{dropImage(e)}} 
    onDragOver={e=>e.preventDefault()}>
      <Add onClick={()=>refImage.current?.click()}/>
      <InputEmoji shouldConvertEmojiToImage={false} shouldReturn={true} inputClass='emoji' onEnter={sendMessage} cleanOnEnter  onChange={setMessageText} value={messageText}    placeholder="Введите сообщение"/>
      <img src={micImage} className="btn-image" onClick={micClick}/>
      {/* {timer} */}
      <input ref={refImage} type="file" multiple accept='image/*,.png,.web,.jpg,.gif' onChange={(e:ChangeEvent<HTMLInputElement>)=>{
            if( e.currentTarget.files){
              setFile(e.currentTarget.files[0])
            }
          }
        } className='none'/>
    </div>
  )
}


export default InputMessage