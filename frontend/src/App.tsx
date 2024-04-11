
import './App.css'
import ChatList from './components/ChatList'
import LoginForm from './components/LoginForm'
import { useAppSelector } from './hooks/redux-hoock'

function App() {
  
  const {isAuth,isLoading,error} = useAppSelector(state=> state.auth)

  
  return (
    <>
    {isLoading && <>...Loading</>}
    {error && <h1 style={{color: "red"}}>{error}</h1>}
    {!isAuth &&  <LoginForm/>}
     {isAuth && <ChatList/>}
    </>
  )
}

export default App
