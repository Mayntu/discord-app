import  { useEffect, useRef, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../hooks/redux-hoock'
import { fetchMedia, fetchTest } from '../store/acthion'
import mk from "../assets/microphone.png"

const Test=()=> {
  // console.log(module)
    const [nValue,setInValue] = useState("")
    const [file,setFile] = useState()
    const dispatch =useAppDispatch()
    let data = useAppSelector(state=>state.chats.test)
    let [chunks,setChunks] = useState<any[]>([])
    let recorder = null
    let audioBlob = null
    let [canRecord,setcanRecord] = useState<boolean>(false)
    let [audio,setaudio] = useState<string>("")
    let [isRecord,setIsReacord] = useState<boolean>(false)
    const playAudio = useRef<HTMLAudioElement>(null)
    let mediaRecorder:any = null

    // async function startRecord() {
    //   if (!navigator.mediaDevices && !navigator.mediaDevices.getUserMedia) {
    //     return console.warn('Not supported')
    //   }
    
    
    //   if (!mediaRecorder) {
    //     try {
    //       const stream = await navigator.mediaDevices.getUserMedia({
    //         audio: true
    //       })
    //       mediaRecorder = new MediaRecorder(stream)
    //       mediaRecorder.start()
    //       mediaRecorder.ondataavailable = (e) => {
    //         chunks.push(e.data)
    //       }
    //       mediaRecorder.onstop = mediaRecorderStop
    //     } catch (e) {
    //       console.error(e)
    //       record_img.src = ' img/microphone.png'
    //     }
    //   } else {
    //     mediaRecorder.stop()
    //   }
    // }



 
    const setupAudio=()=>{
      console.log("setup")
      if(navigator.mediaDevices && navigator.mediaDevices.getUserMedia){
        navigator.mediaDevices.getUserMedia({
          audio:true
        }).then(stream=>{
          recorder = new MediaRecorder(stream)
          recorder.ondataavailable = e =>{
            setChunks([...chunks,e.data])
          }
          recorder.onstop=e=>{
            const blob = new Blob(chunks,{type:"audio/ogg; codecs=opus"})
            setChunks([])
            const audioURL = window.URL.createObjectURL(blob);
            setaudio(audioURL)
          }
          setcanRecord(true)
        })
        .catch(err=>console.log(err))
      }
    }

    const SetupStream=(stream:any)=>{
      recorder = new MediaRecorder(stream)
      recorder.ondataavailable = e =>{
        setChunks([...chunks,e.data])
      }
      recorder.onstop=e=>{
        const blob = new Blob(chunks,{type:"audio/ogg; codecs=opus"})
        setChunks([])
        const audioURL = window.URL.createObjectURL(blob);
        setaudio(audioURL)
      }
      setcanRecord(true)
  }



    const ToggleMic=()=>{
      if(!canRecord) return

      isRecord = !isRecord
      if(isRecord){
        recorder.start()
      }else{
        recorder.stop()
      }
    }
    useEffect(()=>{
      setupAudio()
    },[])
    

  return (
    <div className='test'>
        Test
        
       

           <>
           {/* test video start */}
           


             {/* test video end */}
           </>

           <>
           {/* test audio start*/}
           

           <button className="btn" id="record_btn">
            <img src={mk} alt="record" id="record_img" onClick={()=>ToggleMic()}/>
          </button>

          <audio controls ref={playAudio} src={audio}></audio>
             {/* test audio end */}
           </>



        <input type="text" value={nValue} onChange={(e)=>{setInValue(e.target.value)}} />
                                                    {/* если ничего не надо очисти */}
        <button onClick={()=>{dispatch(fetchTest(nValue))}}>запрос</button>
        <p>ОТВЕТ : {data}</p>
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