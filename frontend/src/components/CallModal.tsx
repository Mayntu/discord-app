


// функция принимает `id` звонящего и методы для принятия звонка и его отклонения
export const CallModal = ({ callFrom, startCall, rejectCall }) => {
// звонок может приниматься с видео и без
const acceptWithVideo = (video) => {
    const config = { audio: true, video }
    // инициализация `PeerConnection`
    startCall(false, callFrom, config)
   }

   eturn (
    <div className='call-modal'>
      <div className='inner'>
        <p>{`${callFrom} is calling`}</p>
        <div className='control'>
          {/* принимаем звонок с видео */}
          <button onClick={() => acceptWithVideo(true)}>
         
          </button>
          {/* принимаем звонок без видео */}
          <button onClick={() => acceptWithVideo(false)}>
          
          </button>
          {/* отклоняем звонок */}
          <button onClick={rejectCall} className='reject'>
          
          </button>
        </div>
      </div>
    </div>
   )
}