import { fetchGetchangeServerMessage } from "../store/actionServer"
import { fetchChangeChatMessage } from "../store/acthionChat"
import { IMessage } from "../models/IUserChat"
import { addMessage } from "../store/ChatsSlice"






export const changeMessage=(messageArray:any[],setMessageArray:React.Dispatch<React.SetStateAction<any[]>>,messageUser:any,dispatch:any,id:any,newContent:string)=>{
   
   console.log(messageUser)
   
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

export const changeMessageN=(messageArray:{ [key: string]: IMessage[]},setMessageArray:React.Dispatch<React.SetStateAction<{ [key: string]: IMessage[]}>>,messageUser:any,dispatch:any,id:any,newContent:string)=>{
   
   console.log(messageUser)
   
    if(id.chatid){
        dispatch(fetchChangeChatMessage({message_uuid: messageUser.uuid,new_content:newContent}))
            .then((res:any)=>{        
              if(res.payload.result){
               const str = messageArray[messageUser.from_user_id].map((item)=>{
                 if(item.uuid == messageUser.uuid){
                  console.log("findm")
                   return {...item,content :newContent}
                 }
                 return item
                 } )          
                 console.log(str)
                 messageArray[messageUser.from_user_id] = str
                 setMessageArray(messageArray)
                 dispatch(addMessage(""))
                }
                })
    }
    // if(id.chatserverid){
    //     dispatch(fetchGetchangeServerMessage({message_uuid: messageUser.uuid,new_content:newContent}))
    //                                       .then((res:any)=>{        
    //                                        if(res.payload.result){
    //                                         const str = messageArray.map((item)=>{
    //                                           if(item.uuid == messageUser.uuid){
    //                                             // item.content = "iuwhduwhdu"
    //                                             return {...item,content : newContent}
    //                                           }
    //                                           return item
    //                                           } )          
    //                                           setMessageArray(str)
    //                                        }
    //                                     })
    // }
}


