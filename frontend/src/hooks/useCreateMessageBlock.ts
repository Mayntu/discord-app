import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { IMessage } from '../models/IUserChat';


export type TmessageBlocks={
    idBlock:string,
    userBlock:string
}


export const useCreateMeassageBlock=(message:any[])=>{

    const [messageBlocks,setMessageBlock] = useState<TmessageBlocks[]>([])
    const [messagesInBlock,setMessagesInBlock] = useState<{ [key: string]: IMessage[]}>({})

    const UpdateBlocks=(message:any)=>{
      if(message.length !==0 ){
        let newMessageBlock:TmessageBlocks[] = []
        let newMessageInBlock2:  { [key: string]: IMessage[]} = {}
        for(let i=0;i<message.length;i++){
          if(newMessageBlock[newMessageBlock.length-1] == undefined){
            let idBlock = uuidv4()
            newMessageBlock.push({idBlock:idBlock,userBlock:message[i].from_user_id})
            // newMessageInBlock.push({idBlock:idBlock,messages:[message[i]]})
            newMessageInBlock2[idBlock] = [message[i]]
          }else if(newMessageBlock[newMessageBlock.length-1].userBlock == message[i].from_user_id){
           
            let idBlock = newMessageBlock[newMessageBlock.length-1].idBlock
          //   console.log(idBlock)
  
          //  console.log( newMessageInBlock[0].idBlock == idBlock)
          // let index = newMessageInBlock.findLastIndex((i:any)=>i.idBlock == newMessageBlock[newMessageBlock.length-1].idBlock)
          // newMessageInBlock[index].messages.push(message[i])
          newMessageInBlock2[idBlock].push(message[i])
          // console.log(newMessageInBlock2[idBlock])
          }else{
            let idBlock = uuidv4()
            newMessageBlock.push({idBlock:idBlock,userBlock:message[i].from_user_id})
            newMessageInBlock2[idBlock] = [message[i]]
            // newMessageInBlock.push({idBlock:idBlock,messages:[message[i]]})
          }
        }
        // setNewMessageArray([...newMessage])
        console.log(newMessageBlock,"newMessageBlock")
        setMessageBlock(newMessageBlock)
        // console.log(newMessageInBlock,"newMessageInBlock")
       
        setMessagesInBlock((prev)=>[...newMessageBlock])
        console.log(messagesInBlock,"newMessageInBlock2")
      }  
    }
    // UpdateBlocks(message)
    

      return {
        UpdateBlocks,
        messageBlocks,
        messagesInBlock
      }
 // [ {value :  messageBlocks,UpdateBlocks},{value: messagesInBlock,UpdateBlocks}]




}



  // const createMeassageBlock=(message:any)=>{
  //   if(message.length !==0 ){
  //     let newMessageBlock:TmessageBlocks[] = []
  //     // let newMessageInBlock:TmessagesInBlock[] = []
  //     let newMessageInBlock2:  { [key: string]: IMessage[]} = {}
  //     for(let i=0;i<message.length;i++){
  //       if(newMessageBlock[newMessageBlock.length-1] == undefined){
  //         let idBlock = uuidv4()
  //         newMessageBlock.push({idBlock:idBlock,userBlock:message[i].from_user_id})
  //         // newMessageInBlock.push({idBlock:idBlock,messages:[message[i]]})
  //         newMessageInBlock2[idBlock] = [message[i]]
  //       }else if(newMessageBlock[newMessageBlock.length-1].userBlock == message[i].from_user_id){
         
  //         let idBlock = newMessageBlock[newMessageBlock.length-1].idBlock
  //       //   console.log(idBlock)

  //       //  console.log( newMessageInBlock[0].idBlock == idBlock)
  //       // let index = newMessageInBlock.findLastIndex((i:any)=>i.idBlock == newMessageBlock[newMessageBlock.length-1].idBlock)
  //       // newMessageInBlock[index].messages.push(message[i])
  //       newMessageInBlock2[idBlock].push(message[i])
  //       // console.log(newMessageInBlock2[idBlock])
  //       }else{
  //         let idBlock = uuidv4()
  //         newMessageBlock.push({idBlock:idBlock,userBlock:message[i].from_user_id})
  //         newMessageInBlock2[idBlock] = [message[i]]
  //         // newMessageInBlock.push({idBlock:idBlock,messages:[message[i]]})
  //       }
  //     }
  //     // setNewMessageArray([...newMessage])
  //     console.log(newMessageBlock,"newMessageBlock")
  //     // console.log(newMessageInBlock,"newMessageInBlock")
  //     console.log(newMessageInBlock2,"newMessageInBlock2")
  //   }  
  // }
















  ////  var-1
    // if(message.length !==0 ){
    //   let newMessage:any[][] = [[]]
    //   // console.log(newMessage[0].length)
    //   for(let i=0;i<message.length;i++){
    //     let userM = message[i]
        
    //     if(newMessage[newMessage.length-1].length == 0){
    //       newMessage[newMessage.length-1].push(userM) 
    //       // console.log(1)
    //       // console.log(newMessage[newMessage.length-1][0].from_user_id)
    //     }else if(newMessage[newMessage.length-1][0].from_user_id == userM.from_user_id){
    //       newMessage[newMessage.length-1].push(userM)
    //       // console.log(newMessage[newMessage.length-1],"asasas")
    //     }else{
    //       newMessage.push([])
    //       newMessage[newMessage.length-1].push(userM)
    //       // console.log(newMessage[newMessage.length-1])
    //     }
    //   }
    //   setNewMessageArray([...newMessage])
    //   // console.log(newMessage,"newMessage")
    // }  

    /////var2
  // const createMeassageBlock=(message:any)=>{
  //   if(message.length !==0 ){
  //     let newMessageBlock:any[] = []
  //     let newMessageInBlock:any[] = []
  //     for(let i=0;i<message.length;i++){
  //       if(newMessageBlock[newMessageBlock.length-1] == undefined){
  //         let idBlock = uuidv4()
  //         newMessageBlock.push({idBlock:idBlock,userBlock:message[i].from_user_id})
  //         newMessageInBlock.push({idBlock:idBlock,messages:[message[i]]})
  //       }else if(newMessageBlock[newMessageBlock.length-1].userBlock == message[i].from_user_id){
  //         let idBlock = newMessageBlock[newMessageBlock.length-1].idBlock
  //        console.log( newMessageInBlock[0].idBlock == idBlock)
  //       let index = newMessageInBlock.findLastIndex(i=>i.idBlock == newMessageBlock[newMessageBlock.length-1].idBlock)
  //       newMessageInBlock[index].messages.push(message[i])
  //       }else{
  //         let idBlock = uuidv4()
  //         newMessageBlock.push({idBlock:idBlock,userBlock:message[i].from_user_id})
  //         newMessageInBlock.push({idBlock:idBlock,messages:[message[i]]})
  //       }
  //     }
  //     // setNewMessageArray([...newMessage])
  //     console.log(newMessageBlock,"newMessageBlock")
  //     console.log(newMessageInBlock,"newMessageInBlock")
  //   }   
  // }