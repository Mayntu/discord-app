import { LegacyRef, MutableRefObject, useEffect, useRef, useState } from "react";
import "../css/gif.css"




const Test =()=> {
  const [gif,setGif] = useState<string>()
  const [gifs,setGifs] = useState<any[]>([])
  const [serach, setSearch] = useState<string>("excited")
  const [isClick,setIsclick] = useState<boolean>(true)
  const [limit,setLimit] = useState<number>(10)
  const blockGif = useRef<HTMLDivElement>(null)
 
 
 
  function httpGetAsync(theUrl:string, callback:(str:string)=>void)
  {
      // create the request object
      let xmlHttp = new XMLHttpRequest();
  
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
    setGifs([])
      let response_objects = JSON.parse(responsetext);
  
      const top_10_gifs = response_objects["results"];
      console.log(top_10_gifs)
      top_10_gifs.filter((item:any)=>{
        setGifs((prev)=>[...prev,item])
      })
      setGif(top_10_gifs[0]["media_formats"]["nanogif"]["url"])
    
  
      return;
  
  }
  
  
  function grab_data()
  {
      // set the apikey and limit
      let apikey = "AIzaSyDKoL3-E3QJKHhso3y3WOOJgmg3wwRU1Mo";
      let clientkey = "my_test_app";

  
      // test search term
      let search_term = serach;
  
      // using default locale of en_US
      let search_url = "https://tenor.googleapis.com/v2/search?q=" + search_term + "&key=" +
              apikey +"&client_key=" + clientkey + "&locale=ru_RU"+ "&limit=" + limit;
  
      httpGetAsync(search_url,tenorCallback_search);
  
      // data will be loaded by each call's callback
      return;
  }
  
  
  useEffect(()=>{
  
      grab_data()
      console.log(gifs,"gifs")
  
      
  },[serach,limit])




 return (
  <>
    <div className="test">
      <img src={gif} alt="" />
      <input placeholder="search" onChange={e=>{
        if(isClick){
          setTimeout(()=>{
            
            if(!e.target.value){
              console.log("s")
              setSearch("excited")
            }else{
              setSearch(e.target.value)
            }
        

            setIsclick(true)
          },1000)
        }
        setIsclick(false)
        }  } />
      <div className="block-gif" ref={blockGif} onScroll={e=>{  if(blockGif.current && blockGif.current?.offsetHeight + blockGif.current?.scrollTop == blockGif.current?.scrollHeight){
          console.log("Win")
          setLimit(limit+10)
        }}}>
        {gifs?.length  && gifs?.map(((i)=><img src={i["media_formats"]["gif"]["url"]} alt="" key={i.id} onClick={()=>{setGif(i["media_formats"]["gif"]["url"])}}/>))}
      </div>
      
    </div>
  </>
   
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





          //                   VIDEO





//           const [clients,setClients] = useStateWithCallback([])
//   const navigate = useNavigate()
//   const [room,setRoom] = useState<string>("")
//   const {roomID} = useParams()
//   let streamData = useRef<MediaStream>()
//   const videoPlayer = useRef<HTMLVideoElement>(null) 
//   const peerMediaElements = useRef<any>({})
//   const peerConnecthions = useRef<any>({})
  
  
  
//   const addNewClients = useCallback((newClient:string,cb:()=>void)=>{
//     if(!clients.includes(newClient)){
//       setClients(list=>[...list,newClient],cb)
//       console.log("client",clients,newClient)
//     }
//   },[clients,setClients])




// useEffect(()=>{

//   const startCamera= async()=>{
//     // if(navigator.mediaDevices && navigator.mediaDevices.getUserMedia){
//            streamData.current = await navigator.mediaDevices.getUserMedia({
//             audio: true,
//             video: {
//               height: 360,
//               width: 600
//             }
//         }
//       )

       
//         addNewClients("LOCAL_VIDEO",()=>{
//           const localVideoElement = peerMediaElements.current["LOCAL_VIDEO"]
//           if(localVideoElement){
//             localVideoElement.volume = 0
//             localVideoElement.srcObject = streamData.current
//           }
//         })


//   // }
// }


//   if(roomID){
//     startCamera()
//     .then(()=>{socketWebRTC.emit("join-room",{room_id :room, name: "wdwdwdwdwd"})})
//     .catch((er)=>console.log(er))
//   }


//     return () => {
//       streamData.current?.getTracks().forEach(track=>track.stop())

//       socketWebRTC.emit("leave");
//     };
  
// },[roomID])

//   const provideMediaRef = useCallback((id:string,node:any)=>{
//     peerMediaElements.current[id] = node
//   },[])


//   useEffect(()=>{
//     async function handleNewPeer({peerID:peerId ,createOffer} ) {
//       if(peerId in peerConnecthions.current){
//         return console.log("already connected")
//       }
//       console.log(peerId ,"peerId",createOffer, "createOffer")
//         peerConnecthions.current[peerId]  = new RTCPeerConnection({
//           iceServers : freeice()
//         })
//         console.log(peerId,"peer", peerConnecthions.current[peerId])

//       peerConnecthions.current[peerId].onicecandidate = ({candidate})=>{
//         console.log("candidat")
//         if(candidate){
//           socketWebRTC.emit("relay-ice",{
//             peer_id : peerId,
//             ice_candidate: candidate
//           })
//         }
//       }
//       peerConnecthions.current[peerId].Icecandidateerror = (event)=>{
//         console.log(event,"ERROR")
//       }


//       let tracksNumber = 0
//       peerConnecthions.current[peerId].ontrack = ({streams: [remoteStream]})=>{
//           tracksNumber++
//         if(tracksNumber === 2){
//           addNewClients(peerId,()=>{
//             console.log("new peerID")
//             peerMediaElements.current[peerId].srcObject = remoteStream
//           })
//         }
//       }

//       console.log(streamData.current,"stream")
//       streamData.current.getTracks().forEach(track=>{
//         console.log("addtrack")
//         peerConnecthions.current[peerId].addTrack(track,streamData.current)
//       })

//       if(createOffer){
//         const offer = await peerConnecthions.current[peerId].createOffer()
//         console.log(offer,createOffer,"offer")
//         await peerConnecthions.current[peerId].setLocalDescription(offer)
//         console.log(peerConnecthions.current[peerId],"offer2")
//         socketWebRTC.emit("relay-sdp",{
//           peer_id: peerId,
//           session_description: offer
//         })
//       }

//     }


//     socketWebRTC.on("add-peer", handleNewPeer);

//     return () => {
//       socketWebRTC.off("add-peer");
//     }

//     // socketWebRTC.on("user-connect",data=>{
//     //   handleNewPeer({peerId:data.sid,createOffer:true})
//     //   console.log(data,"user-connect")
//     // })
//     // socketWebRTC.on("user-list",data=>{
//     //   console.log(data,"user-list")
//     // })
//   },[])


//   useEffect(()=>{

//     async function setRemoteMedia({peerID, sessionDescription: remoteDescription}) {
//       // console.log(remoteDescription,"discrepthion")
//       // console.log(peerConnecthions.current[peerID],"do",peerID)
//       await peerConnecthions.current[peerID]?.setRemoteDescription( new RTCSessionDescription(remoteDescription));
//       // console.log(peerConnecthions.current[peerID],"posle",peerID)


//       if (remoteDescription.type === 'offer' && peerConnecthions.current[peerID]) {
//         // console.log(peerConnecthions.current[peerID],"do answer")
//         const answer = await peerConnecthions.current[peerID].createAnswer()
//         // console.log(answer)
//         await peerConnecthions.current[peerID].setLocalDescription(answer)
//         console.log(peerConnecthions.current[peerID],"answer")
//         socketWebRTC.emit("relay-sdp", {
//           peer_id: peerID,
//           session_description: answer,
//         });
//       }
//     }

//     socketWebRTC.on("session-descrption", setRemoteMedia)
//   },[])

//   useEffect(() => {
//     socketWebRTC.on("ice-candidate", ({peerID, iceCandidate}) => {
//       console.log("ice-candidate")
//       peerConnecthions.current[peerID]?.addIceCandidate(
//         new RTCIceCandidate(iceCandidate)
//       );
//     });

//     return () => {
//       socketWebRTC.off("ice-candidate");
//     }
//   }, []);

//   useEffect(() => {
//     const handleRemovePeer = ({peerID}) => {
//       if (peerConnecthions.current[peerID]) {
//         peerConnecthions.current[peerID].close();
//       }

//       delete peerConnecthions.current[peerID];
//       delete peerMediaElements.current[peerID];

//      setClients(list => list.filter(c => c !== peerID));
//     };

//     socketWebRTC.on("remove-peer", handleRemovePeer);

//     return () => {
//       socketWebRTC.off("remove-peer");
//     }
//   }, []);





//  return (
//    <div className="test">
//     {roomID ? 
//       clients.map((i)=>
//       (<div key={i}>
//           <video  autoPlay muted ref={instance=>{
//             provideMediaRef(i,instance)
//           }}></video>
//           <p>{i}</p>
//       </div>
//     )
//   )
      
//       :
    
    
    
    
    
    
//     <>
//       <input type="text" placeholder="roomid" value={room} onChange={(e)=>{setRoom(e.target.value)}}/>
//       <button onClick={()=>{

//         room && 
//         // socketWebRTC.emit("join-room",{room_id :room, name: "wdwdwdwdwd"})
//         navigate(`/test/:${room}`)
//       }}>Войти</button>
//     </>
//     }
        
//    </div>
//  )