import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { API_URL } from '../http'

export const serverApi = createApi({
  reducerPath: 'serverApi',
  baseQuery: fetchBaseQuery({ baseUrl: API_URL ,headers : {Authorization :`${localStorage.getItem("token")}`}}),
  tagTypes: ["Server"],
  endpoints: (build) => ({
    postCreateServer:  build.mutation({
      query: (server) => ({
        url: `api/v1/createServer`,
        method: 'PATCH',
        body: server,
      }),
     
  }),
  getServerChatRooms: build.query({
    query:()=>""
  })
})
})

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const { usePostCreateServerMutation } = serverApi