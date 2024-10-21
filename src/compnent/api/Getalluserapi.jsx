// src/services/userApi.js
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const Getalluserapi = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://task-manager.codionslab.com/api/v1/admin/',
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.token;
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['User'],
  endpoints: (builder) => ({
    fetchUsers: builder.query({
      query: (page = 1) => `user?page=${page}`,
      providesTags: ['User'],
    }),
    updateUser: builder.mutation({
      query: ({ id, data }) => ({
        url: `user/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['User'],
    }),
    deleteUser: builder.mutation({
      query: (id) => ({
        url: `user/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['User'],
    }),
    addUser: builder.mutation({ // New mutation to add a user
      query: (data) => ({
        url: `user`, // Endpoint for creating a new user
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['User'], // Invalidate users tag to refetch users after adding a new user
    }),
  }),
});

export const { useFetchUsersQuery, useUpdateUserMutation, useDeleteUserMutation,useAddUserMutation } = Getalluserapi;