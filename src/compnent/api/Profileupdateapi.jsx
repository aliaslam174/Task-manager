// src/services/userApi.js
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';


export const Profileupdateapi = createApi({
    reducerPath: 'userApi',
    baseQuery: fetchBaseQuery({

      baseUrl: 'https://task-manager.codionslab.com/api/v1/',
      prepareHeaders: (headers,{ getState }) => {
       console.log(getState)
        const token = getState().auth.token;
        console.log(token)
     
          headers.set('Authorization', `Bearer ${token}`); // Set Authorization header
       
        return headers;
      },
    }),
    tagTypes: ['User'], 
    endpoints: (builder) => ({
      updateUser: builder.mutation({
        query: (userData) => ({
          url: `profile`, // Assuming you're updating the profile
          method: 'post',
          body: userData,
        }),
      }),
      // Add more endpoints as needed...
       // Fetch user profile endpoint
       getUser: builder.query({
        query: (userData) => `profile`, // Assuming you have an API to fetch user profile
        providesTags: ['User'],  // Caching with a tag
        
      }),
      invalidatesTags: ['User'],
    }),
  });

export const { useUpdateUserMutation,useGetUserQuery} = Profileupdateapi;
