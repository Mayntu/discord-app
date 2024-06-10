import  { Dispatch, FC, SetStateAction, useCallback, useEffect, useRef, useState } from 'react'
import { useStateWithCallback } from '../hooks/useStateWithCallback'
import { useParams } from 'react-router-dom'
import { socketWebRTC } from '../socket'
import redCall from "../assets/call-red.png"
import mic from "../assets/mic2.png"
import mic2 from "../assets/mic3.png"
import camera from "../assets/nomuted.png"
import cameraMuted from "../assets/muted.png"
import freeice from "freeice"
import "../css/video.css"
interface newPeer{
    peerID : string,
    createOffer? : boolean
    sessionDescription? :any
}

interface IVideoCallBlock{
    user:string
    setIsCallBlock: Dispatch<SetStateAction<boolean>>
}

const VideoCallBlock:FC<IVideoCallBlock>=({user,setIsCallBlock})=> {
    const [clients,setClients] = useStateWithCallback([])
    const {chatid} = useParams()
    let streamData = useRef<MediaStream>()
    const peerMediaElements = useRef<any>({})
    const peerConnecthions = useRef<{[key: string] : RTCPeerConnection}>({})
   
    const [audioMuted,setAudioMuted ] = useState<boolean>(true)
    const [videoMuted,setVideoMuted] = useState<boolean>(true)

    const addNewClients = useCallback((newClient:string,cb:()=>void)=>{
        if(!clients.includes(newClient)){
          setClients((list:any)=>[...list,newClient],cb)
          console.log("client",clients,newClient)
        }
      },[clients,setClients])

      useEffect(()=>{

        const startCamera= async()=>{
          // if(navigator.mediaDevices && navigator.mediaDevices.getUserMedia){
                 streamData.current = await navigator.mediaDevices.getUserMedia({
                  audio: true,
                  video: {
                    height: 360,
                    width: 600
                  }
              }
            )
      
             
              addNewClients("LOCAL_VIDEO",()=>{
                const localVideoElement = peerMediaElements.current["LOCAL_VIDEO"]
                if(localVideoElement){
                  localVideoElement.volume = 0
                  localVideoElement.srcObject = streamData.current
                }
              })
      
      
        // }
      }
      
      
        if(chatid){
          startCamera()
          .then(()=>{socketWebRTC.emit("join-room",{room_id :chatid, name: user})})
          .catch((er)=>console.log(er))
        }
      
          return () => {
            streamData.current?.getTracks().forEach(track=>track.stop())
            console.log("exit-video")
            socketWebRTC.emit("leave-room");
          };
        
      },[chatid])

      const provideMediaRef = useCallback((id:string,node:HTMLVideoElement | null)=>{
        peerMediaElements.current[id] = node
      },[])

      useEffect(()=>{
        async function handleNewPeer({peerID:peerId ,createOffer}:newPeer) {
          if(peerId in peerConnecthions.current){
            return console.log("already connected")
          }
          console.log(peerId ,"peerId",createOffer, "createOffer")
            peerConnecthions.current[peerId]  = new RTCPeerConnection({
              iceServers : freeice()
            })
            console.log(peerId,"peer", peerConnecthions.current[peerId])
    
          peerConnecthions.current[peerId].onicecandidate = ({candidate})=>{
            console.log("candidat")
            if(candidate){
              socketWebRTC.emit("relay-ice",{
                peer_id : peerId,
                ice_candidate: candidate
              })
            }
          }
      
    
    
          let tracksNumber = 0
          peerConnecthions.current[peerId].ontrack = ({streams: [remoteStream]})=>{
              tracksNumber++
            if(tracksNumber === 2){
              addNewClients(peerId,()=>{
                console.log("new peerID")
                peerMediaElements.current[peerId].srcObject = remoteStream
              })
            }
          }
    
          console.log(streamData.current,"stream")
          streamData.current?.getTracks().forEach(track=>{
            console.log("addtrack")
            streamData.current && peerConnecthions.current[peerId].addTrack(track,streamData.current)
          })
    
          if(createOffer){
            const offer = await peerConnecthions.current[peerId].createOffer()
            console.log(offer,createOffer,"offer")
            await peerConnecthions.current[peerId].setLocalDescription(offer)
            console.log(peerConnecthions.current[peerId],"offer2")
            socketWebRTC.emit("relay-sdp",{
              peer_id: peerId,
              session_description: offer
            })
          }
    
        }
    
    
        socketWebRTC.on("add-peer", handleNewPeer);
        socketWebRTC.on("user-disconnect",(data)=>{
          console.log("user-disconnect=",data)
        })

        // socketWebRTC.on("user-connect",data=>{
        //   // handleNewPeer({peerId:data.sid,createOffer:true})
        //   console.log(data,"user-connect")
        // })
        // socketWebRTC.on("user-list",data=>{
        //   console.log(data,"user-list")
        // })
        return () => {
          socketWebRTC.off("add-peer");
          socketWebRTC.emit("leave-room");
        }
    
      },[])
      useEffect(()=>{

        async function setRemoteMedia({peerID, sessionDescription: remoteDescription}: newPeer) {
          // console.log(remoteDescription,"discrepthion")
          // console.log(peerConnecthions.current[peerID],"do",peerID)
          await peerConnecthions.current[peerID]?.setRemoteDescription( new RTCSessionDescription(remoteDescription));
          // console.log(peerConnecthions.current[peerID],"posle",peerID)
    
    
          if (remoteDescription.type === 'offer' && peerConnecthions.current[peerID]) {
            // console.log(peerConnecthions.current[peerID],"do answer")
            const answer = await peerConnecthions.current[peerID].createAnswer()
            // console.log(answer)
            await peerConnecthions.current[peerID].setLocalDescription(answer)
            console.log(peerConnecthions.current[peerID],"answer")
            socketWebRTC.emit("relay-sdp", {
              peer_id: peerID,
              session_description: answer,
            });
          }
        }
    
        socketWebRTC.on("session-descrption", setRemoteMedia)
      },[])

      useEffect(() => {
        socketWebRTC.on("ice-candidate", ({peerID, iceCandidate}) => {
          console.log("ice-candidate")
          peerConnecthions.current[peerID]?.addIceCandidate(
            new RTCIceCandidate(iceCandidate)
          );
        });
    
        return () => {
          socketWebRTC.off("ice-candidate");
          socketWebRTC.emit("leave-room");
        }
      }, []);


      useEffect(() => {
        const handleRemovePeer = ({peerID}: newPeer) => {
          console.log(peerID,"remove-peer")
          if (peerConnecthions.current[peerID]) {
            peerConnecthions.current[peerID].close();
          }
    
          delete peerConnecthions.current[peerID];
          delete peerMediaElements.current[peerID];
    
         setClients((list:any) => list.filter((c:any) => c !== peerID),()=>{});
        };
    
        socketWebRTC.on("remove-peer", handleRemovePeer);
    
        return () => {
        
          socketWebRTC.off("remove-peer");
          socketWebRTC.emit("leave-room");
        }
      }, []);



      const mutedAudio=(flag: boolean)=>{
        streamData.current?.getAudioTracks().forEach(track=>track.enabled = !flag)
      }

      const mutedVideo=(flag: boolean)=>{
        streamData.current?.getVideoTracks().forEach(track=>track.enabled = !flag)
      }
  return (
    <div className='VideoCallBlock'>
        <div className="videoUsers">
            {clients.map((i)=>
                    (<div key={i}>
                        <video
                            className={i == "LOCAL_VIDEO" ? "local-video": "no-local-video"}
                            autoPlay
                            playsInline
                            muted={i === "LOCAL_VIDEO"}
                            ref={instance=>{
                                provideMediaRef(i,instance)
                            }}>
                            
                        </video>
                    </div>
                    )
                )}
        </div>
        <div className="icon-call">
                <img src={redCall} alt="" onClick={()=>{setIsCallBlock(false)}}/>
                <img src={audioMuted ? mic : mic2} alt="" onClick={()=>{
                    setAudioMuted(!audioMuted)
                    mutedAudio(audioMuted)
                    }}/>
                <img src={videoMuted ? camera : cameraMuted} alt="" onClick={()=>{
                    setVideoMuted(!videoMuted)
                    mutedVideo(videoMuted)
                    }}/>
        </div>
    </div>
  )
}

export default   VideoCallBlock