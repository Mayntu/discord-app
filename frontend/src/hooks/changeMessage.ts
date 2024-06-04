import { fetchGetchangeServerMessage } from "../store/actionServer"
import { fetchChangeChatMessage } from "../store/acthionChat"






export const changeMessage=(messageArray:any[],setMessageArray:React.Dispatch<React.SetStateAction<any[]>>,messageUser:any,dispatch:any,id:any,newContent:string)=>{
   
   
   
    if(id.chatid){
        dispatch(fetchChangeChatMessage({message_uuid: messageUser.uuid,new_content:newContent}))
            .then((res:any)=>{        
              if(res.payload.result){
               const str = messageArray.map((item)=>{
                 if(item.uuid == messageUser.uuid){
                   return {...item,content :newContent}
                 }
                 return item
                 } )          
                 setMessageArray(str)
                }
                })
    }
    if(id.chatserverid){
        dispatch(fetchGetchangeServerMessage({message_uuid: messageUser.uuid,new_content:newContent}))
                                          .then((res:any)=>{        
                                           if(res.payload.result){
                                            const str = messageArray.map((item)=>{
                                              if(item.uuid == messageUser.uuid){
                                                // item.content = "iuwhduwhdu"
                                                return {...item,content : newContent}
                                              }
                                              return item
                                              } )          
                                              setMessageArray(str)
                                           }
                                        })
    }
}