import { useEffect, useState } from "react"

type TValidathion={
    isEmpty?:boolean,
    minlength:number,
    maxlength : number
}

export const useValidathion=(value:string,validathions:TValidathion)=>{
    
    const [isEmpty,setEmpty] = useState<boolean>(true)
    const [minlengthError,setMinlengthError] = useState<boolean>(false)
    const [maxlengthError,setMaxlengthError] = useState<boolean>(false)
    const [ErrorNameminlength,setErrorName] = useState<string>("")
    const [ErrorNameisEmpty,setErrorNameisEmpty] = useState<string>("")
    const [ErrorNamemaxlength,setErrorNamemaxlength] = useState<string>("")
    const [valid,setValid] = useState<boolean>(false)

    useEffect(()=>{
        for (const validathion in validathions ){
            switch(validathion){
                case "isEmpty":
                    value ? setEmpty(false) : setEmpty(true), setErrorNameisEmpty(`пустое поле`)
                    break;
                case "minlength" : 
                      value.length < validathions[validathion] ? setMinlengthError(true) : setMinlengthError(false) , setErrorName(`минимальное значение символов ${validathions[validathion]}`)
                    break;
                case "maxlength" : 
                    value.length > validathions[validathion] ? setMaxlengthError(true) : setMaxlengthError(false) , setErrorNamemaxlength(`максимальное значение символов ${validathions[validathion]}`)
                  break;
            }
        }
    },[value])

    useEffect(()=>{
        if(maxlengthError || minlengthError || isEmpty ){
            setValid(false)
        }else{
            setValid(true)
        }
    },[maxlengthError,minlengthError,isEmpty])

    const notValid = ()=>{
        setEmpty(true)
        setMinlengthError(false)
        setMaxlengthError(false)
        setErrorName("")
        setErrorNameisEmpty("")
        setErrorNamemaxlength("")
        setValid(false)
    }
    return{
        isEmpty,
        minlengthError,
        ErrorNameminlength,
        ErrorNameisEmpty,
        ErrorNamemaxlength,
        valid,
        maxlengthError,
        notValid
    }
} 


export const  useInput = (initialValue:string,validathions:TValidathion)=>{
    const [value,setValue] = useState(initialValue)
    const [isDirty,setDirty] = useState(false)
    let valid = useValidathion(value.trim(),validathions)

    const onChange=(e: React.ChangeEvent<HTMLInputElement>)=>{
        setValue(e.target.value)
    }

    const onBlur=(e: React.ChangeEvent<HTMLInputElement>)=>{
        console.log("blur")
        setDirty(true)
    }

    
    return {
        value,
        onChange,
        onBlur,
        isDirty,
        ...valid,
      
    }
}


