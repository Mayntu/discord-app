import { ChangeEvent, FC,  useEffect,  useRef, useState } from "react"
import InputEmoji from "react-input-emoji";
import micImage from "../assets/micF.png"
import { socket } from "../socket";
import { useParams } from "react-router-dom";
import GIfBlock from "./GIfBlock";
import gifIcon from "../assets/gif.png"
import imageIcon from "../assets/addIm.png"
import { addMessage } from "../store/ChatsSlice";
import { useAppDispatch } from "../hooks/redux-hoock";
interface  IInputMessage{
  
  dropImage : (e:React.DragEvent<HTMLDivElement>)=>void,
  sendMessage: ()=> void,
  setFile:  React.Dispatch<React.SetStateAction<File | undefined>>,
  setMessageText : React.Dispatch<React.SetStateAction<string>>,
  messageText :string,
  setArrayURL : React.Dispatch<React.SetStateAction<string[]>> 
}



const InputMessage:FC<IInputMessage>=({dropImage,sendMessage,setFile,setMessageText,messageText, setArrayURL})=> {
  let [_,setAudioBlob] = useState<Blob>()
  const refImage = useRef<HTMLInputElement>(null) 
  const [stream, setStream] = useState<MediaStream>();
  const [permission, setPermission] = useState<boolean>(false);
  const [recordingStatus, setRecordingStatus] = useState<"inactive" | "recording">("inactive");
  const [audioChunks, setAudioChunks] = useState([]);
  const {chatid,chatserverid,serverid} = useParams()
  const [isGifBlock, setISGifBlock] = useState<boolean>(false)
  // const [timer, setTimer] = useState("00.00.00");
  const [gif,setGif] = useState<string>("")
  const mediaRecorder = useRef<MediaRecorder>();
 const dispatch = useAppDispatch()

  const getMicrophonePermission =async ()=>{
    if(navigator.mediaDevices && navigator.mediaDevices.getUserMedia){
      const streamData = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: false,
    })
    setPermission(true);
    setStream(streamData)
   
    }
  
  }


  
  const startRecording = async () => {
    setRecordingStatus("recording");
    console.log("streamStart")
    if(stream){
      const media = new MediaRecorder(stream);
      mediaRecorder.current = media;
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
  
    if(mediaRecorder.current){
      mediaRecorder.current.stop();
      mediaRecorder.current.onstop = () => {
      
         const audioBlob = new Blob(audioChunks, { type:  'audio/wav' });
         setAudioBlob(audioBlob)
      
         setAudioChunks([]);
         if(audioBlob){
        
          setAudioBlob(audioBlob)
            if(chatid){
              console.log("chat")
              socket.emit("message", {
                "data" : "", 
                "chat_id" : chatid,
                "token" : localStorage.getItem("token"), 
                media:{file : audioBlob, name : "audio/wav"} });
            }
            if(chatserverid){
              
              console.log("server",audioBlob.type)
              socket.emit("server_chat_message", {
                "data" : "", 
                "chat_id" : chatserverid, 
                "server_id" : serverid,
                "token" : localStorage.getItem("token"), 
                media:  {file : audioBlob, name : "audio/wav"}});
            }
              setAudioBlob(undefined)
         }
      };
    }
  
 
  };



  useEffect(()=>{
    if(gif !== ""){
      setGif("")
      if(chatid){
      
        socket.emit("message", {
          "data" : gif, 
          "chat_id" : chatid,
          "token" : localStorage.getItem("token"), 
          media: ""});
      }
      if(chatserverid){
      
        socket.emit("server_chat_message", {
          "data" : gif, 
          "chat_id" : chatserverid, 
          "server_id" : serverid,
          "token" : localStorage.getItem("token"), 
          media:  ""});
      }
    }
  },[gif])


  useEffect(()=>{
    if(!permission){
    getMicrophonePermission()
  }
  },[])

  const micClick= async()=>{
    
    if(!permission){
       getMicrophonePermission()
    }
  
    if(permission && recordingStatus === "inactive"){
      startRecording()
    }

    if(recordingStatus === "recording"){
      stopRecording()
    }
  }

  return (
    <>
    <div className="message-input-container" 
    onDrop={(e)=>{dropImage(e)}} 
    onDragOver={e=>e.preventDefault()}>
     
      <img src={imageIcon} alt="" style={{cursor:"pointer"}} onClick={()=>refImage.current?.click()}/>
    
    
     <InputEmoji 
      color="#ACACAC"
      borderColor={"#333333"} 
      background={"#333333"}
      shouldConvertEmojiToImage={false} 
      shouldReturn={true} inputClass='emoji' 
      onEnter={sendMessage} 
      cleanOnEnter  
      onChange={setMessageText} 
      value={messageText}    
      placeholder="Введите сообщение"
      borderRadius={10}
      placeholderColor="#ACACAC"
      fontFamily="Inter"
      height={70}
     
     
      />
     
    
     
                
    
    
      {/* {timer} */}
      <div className="com-icon">
              <div className={recordingStatus === "inactive" ? "img-block inactive" : "img-block recording"}>
                 <img src={micImage} onClick={micClick} style={{cursor:"pointer"}}/>
              </div>
              <input ref={refImage} type="file" multiple accept='image/*,.png,.web,.jpg,.gif' onChange={(e:ChangeEvent<HTMLInputElement>)=>{
            if(e.currentTarget.files){
              setArrayURL([])
              console.log(e.currentTarget.files,"conFiles")
              const files = [...e.currentTarget.files]
              for(let i=0;i<files.length;i++){
                 setArrayURL(prev=>[...prev,window.URL.createObjectURL(files[i])])
              }
              setFile(e.currentTarget.files[0])
              dispatch(addMessage(""))
            }
          }
        } className='none'/>
              <img src={gifIcon} onClick={()=>setISGifBlock(!isGifBlock)} alt="" style={{cursor:"pointer"}} />
          </div>
            
      </div>
      {isGifBlock && <GIfBlock setGif={setGif} setisGifBlock={setISGifBlock}/>}
    </>
  )
}


export default InputMessage