import { useCallback, useEffect,  useRef, useState } from "react";


export const useStateWithCallback = (initialState:string[]):[string[],(newState: any, cb: any) => void] => {
    const [state, setState] = useState<string[]>(initialState);
    const cbRef = useRef(null);
  
    const updateState = useCallback((newState:any, cb:any) => {
      cbRef.current = cb;
  
      setState(prev => typeof newState === 'function' ? newState(prev) : newState);
    }, []);
  
    useEffect(() => {
      if (cbRef.current) {
        cbRef.current(state);
        cbRef.current = null;
      }
    }, [state]);
  
    return [state, updateState];
  }