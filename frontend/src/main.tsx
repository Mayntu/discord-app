
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { Provider } from 'react-redux'
import store from './store/index.ts'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import MessageContainer from './components/MessageContainer.tsx'
import LoginForm from './components/LoginForm.tsx'
import Test from './components/Test.tsx'
import ChatList from './components/ChatList.tsx'



const router = createBrowserRouter([
  {
    path: "/",
    element : <App/>,
    children:[
      {path: "/chat",element: <ChatList/>,children:[
        {index: true,element: <MessageContainer/>},
        {path: ":chatid",element: <MessageContainer/>}
      ]},
      {path: "/",element: <ChatList/>,
      children:[
        {path: "/",element: <MessageContainer/>},
      ]
    },]
  },

  {
    path: "/login",
    element: <LoginForm/>,
  },{
    path: "/test",
    element: <Test/>
  }
])


ReactDOM.createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
      <RouterProvider router={router}/>
  </Provider>
   

)
