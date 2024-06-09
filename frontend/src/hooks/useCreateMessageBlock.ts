import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { IMessage } from '../models/IUserChat';


type TmessageBlocks={
    idBlock:string,
    userBlock:string
}

type TmessagesInBlock = {
    idBlock:string,
    messages: IMessage[]
}


export const usecreateMeassageBlock=(message:any[])=>{
    const [messageBlocks,setMmessageBlock] = useState<TmessageBlocks[]>([])
    const [messagesInBlock,setMessagesInBlock] = useState<any[]>([])

    const UpdateBlocks=()=>{
        if(message.length !==0 ){
            let newMessageBlock:TmessageBlocks[] = []
            let newMessageInBlock:TmessagesInBlock[] = []
            for(let i=0;i<message.length;i++){
              if(newMessageBlock[newMessageBlock.length-1] == undefined){
                let idBlock = uuidv4()
                newMessageBlock.push({idBlock:idBlock,userBlock:message[i].from_user_id})
                newMessageInBlock.push({idBlock:idBlock,messages:[message[i]]})
              }else if(newMessageBlock[newMessageBlock.length-1].userBlock == message[i].from_user_id){
                let idBlock = newMessageBlock[newMessageBlock.length-1].idBlock
               console.log( newMessageInBlock[0].idBlock == idBlock)
              let index = newMessageInBlock.findLastIndex((i:any)=>i.idBlock == newMessageBlock[newMessageBlock.length-1].idBlock)
              newMessageInBlock[index].messages.push(message[i])
              }else{
                let idBlock = uuidv4()
                newMessageBlock.push({idBlock:idBlock,userBlock:message[i].from_user_id})
                newMessageInBlock.push({idBlock:idBlock,messages:[message[i]]})
              }
            }
            // setNewMessageArray([...newMessage])
            console.log(newMessageBlock,"newMessageBlock")
            console.log(newMessageInBlock,"newMessageInBlock")
          }   
    }
 


      return {
        UpdateBlocks,

      }
}


