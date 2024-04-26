import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { IUserChatT } from '../models/IUserChat'
import { API_URL } from '../http'

// Define a service using a base URL and expected endpoints
export const chatApi = createApi({
  reducerPath: 'pokemonApi',
  baseQuery: fetchBaseQuery({ baseUrl: API_URL ,headers : {Authorization :`${localStorage.getItem("token")}`}}),
  tagTypes: ["Chat"],
  endpoints: (builder) => ({
    getfetchGetUserChats: builder.query<IUserChatT, string>({
      query: (_) => `api/v1/getUsersChats`,
    }),
  }),
})

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const { useGetfetchGetUserChatsQuery } = chatApi