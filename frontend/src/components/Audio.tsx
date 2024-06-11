import { FC, SyntheticEvent, useEffect, useRef, useState } from "react"
import Play from "../assets/uadioPlay.png"
import Pause from "../assets/audioPause.png"
import "../css/slider.css"
import { useParams } from "react-router-dom"


interface IAudio{
    link : string,
    time : string,
    status? : boolean
    me:boolean
}



function Slider({ percentage = 0, onChange }:any) {
    const [position, setPosition] = useState(0)
    const [marginLeft, setMarginLeft] = useState(0)
    const [progressBarWidth, setProgressBarWidth] = useState(10)
  
    const rangeRef = useRef<HTMLInputElement>(null)
    const thumbRef = useRef<HTMLDivElement>(null)
  
    useEffect(() => {
        if(rangeRef.current && thumbRef.current){
            const rangeWidth = rangeRef.current.getBoundingClientRect().width
            const thumbWidth = thumbRef.current.getBoundingClientRect().width
            const centerThumb = (thumbWidth / 100) * percentage * -1
            const centerProgressBar =
              thumbWidth + (rangeWidth / 70) * percentage - (thumbWidth / 70) * percentage
            setPosition(percentage)
            setMarginLeft(centerThumb)
            setProgressBarWidth(centerProgressBar)
        }
     
    }, [percentage])
  
    return (
      <div className='slider-container'>
        <div
          className='progress-bar-cover'
          style={{
            width: `${progressBarWidth}px`
          }}
        ></div>
        <div
          className='thumb'
          ref={thumbRef}
          style={{
            left: `${position}%`,
            marginLeft: `${marginLeft}px`
          }}
        ></div>
        <input
          type='range'
          value={position}
          ref={rangeRef}
          step='0.01'
          className='range'
          onChange={onChange}
      
        />
      </div>
    )
  }




const  AudioMy:FC<IAudio>=({link,time,status,me})=> {
    const audioRef = useRef<HTMLAudioElement>(null)
    const [percentage, setPercentage] = useState(0)
    const [isPlaying, setIsPlaying] = useState(false)
    const {chatid} = useParams()
    
   
    const onChange = (e:React.ChangeEvent<HTMLInputElement>) => {
        const audio = audioRef.current
        if(audio && e.target.value){
            audio.currentTime = (audio.duration / 100) * +e.target.value
        }
        setPercentage(+e.target.value)
      }
   
      const getCurrDuration = (e: SyntheticEvent<HTMLAudioElement>) => {
        const percent = ((e.currentTarget.currentTime / e.currentTarget.duration) * 100).toFixed(2)
        setPercentage(+percent)
        
      }


  
  return (
    <>
    <div className="row-con">
       
        <audio 
        src={link} 
        ref={audioRef}
        
    
        onTimeUpdate={getCurrDuration}
        className="none"
        onEnded={() => setIsPlaying(false)}
        ></audio>
        <div className="audio">
            {!isPlaying ?  
            <img src={Play} alt="" onClick={()=>{audioRef.current && audioRef.current.play(),setIsPlaying(!isPlaying)}}/> 
            :
            <img src={Pause} alt="" onClick={()=>{audioRef.current && audioRef.current.pause(), setIsPlaying(!isPlaying)}}/>  }
        
        
            <Slider percentage={percentage} onChange={onChange} /> 
            
            <div className="absolute">
            <span className='date'>   {` ${new Date(time).getHours()>10 ? new Date(time).getHours() : "0"+new Date(time).getHours()}
                        : ${new Date(time).getMinutes()>10 ? new Date(time).getMinutes() : "0"+new Date(time).getMinutes()}`} {me &&   chatid &&(<div className={status ? "true-status" : "false-status"}></div>)}  </span>
            </div>
        </div>
        </div>
    </>

  )
}


export default  AudioMy