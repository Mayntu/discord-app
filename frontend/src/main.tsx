
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { Provider } from 'react-redux'
import store from './store/index.ts'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import MessageContainer from './components/MessageContainer.tsx'
import LoginForm from './components/LoginForm.tsx'

import ChatList from './components/ChatList.tsx'
import ServerChatList from './components/ServerChatList.tsx'
import SettingsBlock from './components/SettingsBlock.tsx'
import ServerVideoBlock from './components/ServerVIdeoBlock.tsx'
import ServerRolePanel from './components/ServerRolePanel.tsx'



const router = createBrowserRouter([
  {
    path: "/",
    element : <App/>,
    children:[
    
      {path: "/chat",element: <ChatList/>,children:[
        {index: true,element: <MessageContainer/>},
        {path: ":chatid",element: <MessageContainer/>}
       
      ]},
      {path: "/invite/:id",},
      {path:"/set",element:<SettingsBlock/>,children:[
        {index: true,element: <MessageContainer/>},
        {path: ":chatid",element: <MessageContainer/>},
        {path: ":chatserverid",element: <MessageContainer/>}
      ]},
      {path: "/server/:serverid",element: <ServerChatList/>,children:[
        {index: true,element: <MessageContainer/>},
        {path: "set",element: <ServerRolePanel/>},
        {path: ":chatserverid",element: <MessageContainer/>},
        {path: "voice/:idVoiceChst",element: <ServerVideoBlock/>}
      ]},
      ]
  },

  {
    path: "/login",
    element: <LoginForm/>,
  },
 
])


ReactDOM.createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
      <RouterProvider router={router}/>
  </Provider>
   

)
