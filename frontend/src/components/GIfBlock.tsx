import{ FC, useEffect, useRef, useState } from 'react'
import "../css/gif.css"

interface IGIfBlock{
  setGif : React.Dispatch<React.SetStateAction<string>>
  setisGifBlock: React.Dispatch<React.SetStateAction<boolean>>
}

 const GIfBlock:FC<IGIfBlock>=({setGif,setisGifBlock})=> {
  
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
    
      <div className="block-gif-search">
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
        <div className="block-gif" ref={blockGif} onScroll={()=>{  if(blockGif.current && blockGif.current?.offsetHeight + blockGif.current?.scrollTop == blockGif.current?.scrollHeight){
            console.log("Win")
            setLimit(limit+10)
          }}}>
          {gifs?.length  && gifs?.map(((i)=><img src={i["media_formats"]["gif"]["url"]} alt="" key={i.id} onClick={()=>{
            setisGifBlock(false)
            setGif(i["media_formats"]["gif"]["url"])}}/>))}
        </div>
        </div>
    </>
     
   )
}

export default GIfBlock