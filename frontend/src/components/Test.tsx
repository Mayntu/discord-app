import { useCallback, useEffect, useRef, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { socket, socketWebRTC } from "../socket";
import freeice from "freeice"
const useStateWithCallback = (initialState:string[]) => {
  const [state, setState] = useState<string[]>(initialState);
  const cbRef = useRef(null);

  const updateState = useCallback((newState, cb) => {
    cbRef.current = cb;

    setState(prev => typeof newState === 'function' ? newState(prev) : newState);
  }, []);

  useEffect(() => {
    if (cbRef.current) {
      cbRef.current(state);
      cbRef.current = null;
    }
  }, [state]);

  return [state, updateState];
}



const Test =()=> {
  const [clients,setClients] = useStateWithCallback([])
  const navigate = useNavigate()
  const [room,setRoom] = useState<string>("")
  const {roomID} = useParams()
  let streamData = useRef<MediaStream>()
  const videoPlayer = useRef<HTMLVideoElement>(null) 
  const peerMediaElements = useRef<any>({})
  const peerConnecthions = useRef<any>({})
  const addNewClients = useCallback((newClient:string,cb:()=>void)=>{
    if(!clients.includes(newClient)){
      setClients(list=>[...list,newClient],cb)
      console.log("client")
    }
  },[clients,setClients])


  const startCamera= async()=>{
    if(navigator.mediaDevices && navigator.mediaDevices.getUserMedia){
           streamData.current = await navigator.mediaDevices.getUserMedia({
            audio: true,
            video: {
              height: 360
            }
        })

       
        addNewClients("LOCAL_VIDEO",()=>{
          const localVideoElement = peerMediaElements.current["LOCAL_VIDEO"]
          if(localVideoElement){
            localVideoElement.volume = 0
            localVideoElement.srcObject = streamData.current
          }
        })


  }
}

useEffect(()=>{
  startCamera()

  return ()=>{
    streamData.current?.getTracks().forEach(track=>track.stop())
  }
},[])

  const provideMediaRef = useCallback((id:string,node:any)=>{
    peerMediaElements.current[id] = node
  },[])


  useEffect(()=>{
    async function handleNewPeer({peerId,createOffer}) {
      if(peerId in peerConnecthions.current){
        return console.log("already connected")
      }else{
        peerConnecthions.current[peerId]  = new RTCPeerConnection({
          iceServers : freeice()
        })
      }

      peerConnecthions.current[peerId].onicecandidate = (event:any)=>{
        if(event.candidate){
          socketWebRTC.emit("relay-ice",{
            peerId,
            iceCandidate: event.candidate
          })
        }
      }

      let tracksNumber = 0
      peerConnecthions.current[peerId].ontrack = ({streams: [remoteStream]})=>{
          tracksNumber++
        if(tracksNumber ===2){
          addNewClients(peerId,()=>{
            peerMediaElements.current[peerId].srcObject = remoteStream
          })
        }
      }


      streamData.current?.getTracks().forEach(track=>{
        peerConnecthions.current[peerId].addTrack(track,streamData.current)
      })

      if(createOffer){
        const offer = await peerConnecthions.current[peerId].createOffer()

        await peerConnecthions.current[peerId].setLocalDescription(offer)

        socketWebRTC.emit("relay-sdp",{
          peerId,
          sessionDescripthion: offer
        })
      }

    }

    socketWebRTC.on("user-connect",data=>{
      handleNewPeer({peerId:data.sid,createOffer:true})
      console.log(data,"user-connect")
    })
    socketWebRTC.on("user-list",data=>{
      console.log(data,"user-list")
    })
  },[socketWebRTC])


  useEffect(()=>{

    async function setRemoteMedia({peerID, sessionDescription: remoteDescription}) {
      await peerConnecthions.current[peerID]?.setRemoteDescription(
        new RTCSessionDescription(remoteDescription)
      );

      if (remoteDescription.type === 'offer') {
        const answer = await peerConnecthions.current[peerID].createAnswer();

        await peerConnecthions.current[peerID].setLocalDescription(answer);

        socket.emit("RELAY_SDP", {
          peerID,
          sessionDescription: answer,
        });
      }
    }

    socketWebRTC.on("session-description", setRemoteMedia)
  },[])

  useEffect(() => {
    socket.on("ICE_CANDIDATE", ({peerID, iceCandidate}) => {
      peerConnecthions.current[peerID]?.addIceCandidate(
        new RTCIceCandidate(iceCandidate)
      );
    });

    return () => {
      socket.off(ACTIONS.ICE_CANDIDATE);
    }
  }, []);

  useEffect(() => {
    const handleRemovePeer = ({peerID}) => {
      if (peerConnecthions.current[peerID]) {
        peerConnecthions.current[peerID].close();
      }

      delete peerConnecthions.current[peerID];
      delete peerMediaElements.current[peerID];

     setClients(list => list.filter(c => c !== peerID));
    };

    socket.on("REMOVE_PEER", handleRemovePeer);

    return () => {
      socket.off("REMOVE_PEER");
    }
  }, []);




  
 return (
   <div className="test">
    {roomID ? 
      clients.map((i)=>
      (<div key={i}>
          <video  autoPlay muted ref={instance=>{
            provideMediaRef(i,instance)
          }}></video>
          <p>{i}</p>
      </div>
    )
  )
      
      :
    
    
    
    
    
    
    <>
      <input type="text" placeholder="roomid" value={room} onChange={(e)=>{setRoom(e.target.value)}}/>
      <button onClick={()=>{

        room && 
        socketWebRTC.emit("join-room",{room_id :room, name: "wdwdwdwdwd"})
        navigate(`/test/:${room}`)
      }}>Войти</button>
    </>
    }
        
   </div>
 )
}




export default Test


 {/* <img src="media/images/758b3624-b9c9-4e34-8ffe-08baeadfeba4.png" alt="" /> */}
        {/* <input type="file" accept='image/*,.png,.web,.jpg,.gif' onChange={(e)=>{setFile(e.target.files)}}/>
           <button onClick={()=>{newFile()}}>запрос</button> */}


//    НЕ ТРОГАТЬ
    //  const streem= async()=>{
    //   const config = {
    //     audio: true,
    //     video: true
    //    }
    //   const localStream = await navigator.mediaDevices.getUserMedia(config)
    //   const localTracks = localStream.getTracks()
    //  }
     
    //  const rtcconfiguration=()=>{
    //   const config = { iceServers: [{ urls: ['stun:stun.l.google.com:19302'] }] }
    //   const pc = new RTCPeerConnection(config)
    //  }
    // const newFile=()=>{
    //   console.log(file)
    //   if(!file){
    //     alert("please")
    //     return
    //   }
    //   const formData = new FormData()
    //   formData.append("file",file[0])
    //   dispatch(fetchMedia(formData))
    // }

           {/* test video end */}

``///////////////////////////////////////result audio

          //  </>

          //  <>
          //  {/* test audio start*/}
           
          //  {!permission ? (
          //       <button onClick={getMicrophonePermission} type="button">
          //           Get Microphone
          //       </button>
          //       ) : null}
          //       {permission && recordingStatus === "inactive" ? (
          //       <button onClick={startRecording} type="button">
          //           Start Recording
          //       </button>
          //       ) : null}
          //       {recordingStatus === "recording" ? (
          //       <button onClick={stopRecording} type="button">
          //           Stop Recording
          //       </button>
          //       ) : null}
          //  {/* <button className="btn" id="record_btn">
          //   <img src={mk} alt="record" id="record_img" onClick={()=>getMicrophonePermission()}/>
          // </button> */}

          // <audio controls ref={playAudio} src={audio}></audio>

          // <button onClick={()=>{serverSave()}} type="button">
          //          server save
          //       {/* </button> */}



          // const [nValue,setInValue] = useState("")
          // const [file,setFile] = useState()
          // const dispatch =useAppDispatch()
          // let data = useAppSelector(state=>state.chats.test)
      
          // let [audioBlob,setAudioBlob] = useState<Blob>()
         
       
          // let [audio,setAudio] = useState<string>("")
      
          // const playAudio = useRef<HTMLAudioElement>(null)
         
          // const [permission, setPermission] = useState(false);
          // const mimeType = "audio/webm"
          // const [audioChunks, setAudioChunks] = useState([]);
          // const mediaRecorder = useRef<MediaRecorder>();
          // const [stream, setStream] = useState<MediaStream>();
          // const [recordingStatus, setRecordingStatus] = useState("inactive");
         
         
          // const getMicrophonePermission =async ()=>{
          //   if(navigator.mediaDevices && navigator.mediaDevices.getUserMedia){
          //     const streamData = await navigator.mediaDevices.getUserMedia({
          //       audio: true,
          //       video: false,
          //   });
          //   console.log(streamData)
          //   setPermission(true);
          //   setStream(streamData)
          //   }
          
          // }
      
      
          // const startRecording = async () => {
          //   setRecordingStatus("recording");
          //   //create new Media recorder instance using the stream
          //   const media = new MediaRecorder(stream);
          //   //set the MediaRecorder instance to the mediaRecorder ref
          //   mediaRecorder.current = media;
          //   //invokes the start method to start the recording process
          //   mediaRecorder.current.start();
          //   let localAudioChunks:any = [];
          //   mediaRecorder.current.ondataavailable = (event) => {
          //      if (typeof event.data === "undefined") return;
          //      if (event.data.size === 0) return;
          //      localAudioChunks.push(event.data);
          //   };
          //   setAudioChunks(localAudioChunks);
          // };
      
      
      
          // const stopRecording = () => {
          //   setRecordingStatus("inactive");
          //   //stops the recording instance
          //   mediaRecorder.current.stop();
          //   mediaRecorder.current.onstop = () => {
          //     //creates a blob file from the audiochunks data
          //      const audioBlob = new Blob(audioChunks, { type: mimeType });
          //      setAudioBlob(audioBlob)
          //     //creates a playable URL from the blob file.
          //      const audioUrl = URL.createObjectURL(audioBlob);
          //      setAudio(audioUrl);
          //      setAudioChunks([]);
          //   };
          // };
      
      
          //   const serverSave=()=>{
          //     const formData = new FormData()
          //       if(audioBlob){
                 
          //         formData.append('audio', audioBlob)
          //         dispatch(fetchMedia2(formData))
          //       }
              
          //   }