import { ChangeEvent, FC,  useEffect,  useRef, useState } from "react"
import Add from "./Add"
import InputEmoji from "react-input-emoji";
import micImage from "../assets/microphone.png"
import { socket } from "../socket";
import { useParams } from "react-router-dom";
import GIfBlock from "./GIfBlock";

interface  IInputMessage{
  
  dropImage : (e:React.DragEvent<HTMLDivElement>)=>void,
  sendMessage: ()=> void,
  setFile:  React.Dispatch<React.SetStateAction<File | undefined>>,
  setMessageText : React.Dispatch<React.SetStateAction<string>>,
  messageText :string,
  setArrayURL : React.Dispatch<React.SetStateAction<string[]>>

  // setAudioBlob:React.Dispatch<React.SetStateAction<Blob| undefined>> 
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
      
         const audioBlob = new Blob(audioChunks, { type:  'audio/mp3' });
         setAudioBlob(audioBlob)
      
         setAudioChunks([]);
         if(audioBlob){
        
          setAudioBlob(audioBlob)
            if(chatid){

              socket.emit("message", {
                "data" : "что писать?", 
                "chat_id" : chatid,
                "token" : localStorage.getItem("token"), 
                media:{file : audioBlob, name : "audio/mp3"} });
            }
            if(chatserverid){
              console.log("streamУТ")
              socket.emit("server_chat_message", {
                "data" : "что писать?", 
                "chat_id" : chatserverid, 
                "server_id" : serverid,
                "token" : localStorage.getItem("token"), 
                media:  {file : audioBlob, name : "audio/mp3"}});
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



  ///AIzaSyDKoL3-E3QJKHhso3y3WOOJgmg3wwRU1Mo tenorAPi


  // url Async requesting function
function httpGetAsync(theUrl:string, callback:(str:string)=>void)
{
    // create the request object
    var xmlHttp = new XMLHttpRequest();

    // set the state change callback to capture when the response comes in
    xmlHttp.onreadystatechange = function()
    {
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
        {
            callback(xmlHttp.responseText);
        }
    }

    // open as a GET call, pass in the url and set async = True
    xmlHttp.open("GET", theUrl, true);

    // call send with no params as they were passed in on the url string
    xmlHttp.send(null);

    return;
}


// callback for the top 8 GIFs of search
function tenorCallback_search(responsetext:string)
{
    // Parse the JSON response
    var response_objects = JSON.parse(responsetext);

    const top_10_gifs = response_objects["results"];
    console.log(top_10_gifs)

    // load the GIFs -- for our example we will load the first GIFs preview size (nanogif) and share size (gif)

    // document.getElementById("preview_gif").src = top_10_gifs[0]["media_formats"]["nanogif"]["url"];

    // document.getElementById("share_gif").src = top_10_gifs[0]["media_formats"]["gif"]["url"];

    return;

}


function grab_data()
{
    // set the apikey and limit
    var apikey = "AIzaSyDKoL3-E3QJKHhso3y3WOOJgmg3wwRU1Mo";
    var clientkey = "my_test_app";
    var lmt = 8;

    // test search term
    var search_term = "excited";

    // using default locale of en_US
    var search_url = "https://tenor.googleapis.com/v2/search?q=" + search_term + "&key=" +
            apikey +"&client_key=" + clientkey +  "&limit=" + lmt;

    httpGetAsync(search_url,tenorCallback_search);

    // data will be loaded by each call's callback
    return;
}


useEffect(()=>{
  grab_data();
},[])
  return (
    <>
    <div className="message-input-container" 
    onDrop={(e)=>{dropImage(e)}} 
    onDragOver={e=>e.preventDefault()}>
      <Add onClick={()=>refImage.current?.click()}/>
      <InputEmoji shouldConvertEmojiToImage={false} shouldReturn={true} inputClass='emoji' onEnter={sendMessage} cleanOnEnter  onChange={setMessageText} value={messageText}    placeholder="Введите сообщение"/>
      <img src={micImage} className="btn-image" onClick={micClick}/>
      {/* {timer} */}
      <input ref={refImage} type="file" multiple accept='image/*,.png,.web,.jpg,.gif' onChange={(e:ChangeEvent<HTMLInputElement>)=>{
            if(e.currentTarget.files){
              setArrayURL([])
              console.log(e.currentTarget.files,"conFiles")
              const files = [...e.currentTarget.files]
              for(let i=0;i<files.length;i++){
                 setArrayURL(prev=>[...prev,window.URL.createObjectURL(files[i])])
              }
              setFile(e.currentTarget.files[0])
            }
          }
        } className='none'/>
      <button onClick={()=>setISGifBlock(!isGifBlock)}>gif</button>
     
    </div>
       {isGifBlock && <GIfBlock setGif={setGif} setisGifBlock={setISGifBlock}/>}
    </>
  )
}


export default InputMessage