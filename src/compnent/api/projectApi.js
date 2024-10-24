import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { store } from '../../store';

export const projectApi = createApi({
  reducerPath: 'projectApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://task-manager.codionslab.com/api/v1/admin/', // Start with an empty string
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth?.token;
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Project'],
  endpoints: (builder) => ({
    fetchProjects: builder.query({
      query: (page = 1) => {
        const state = store.getState(); // Access the store directly
        const { role } = state?.auth; // Get user info
        console.log(role)
        // const baseUrl = role === 'admin'? 'https://task-manager.codionslab.com/api/v1/admin/': 'https://task-manager.codionslab.com/api/v1/';

        return `${baseUrl}project?page=${page}`; // Return the full query string
      },
      providesTags: ['Project'],
    }),
    createProject: builder.mutation({
      query: (newProject) => ({
        url: `${baseUrl}project`, // Use baseUrl variable here
        method: 'POST',
        body: newProject,
      }),
      invalidatesTags: ['Project'],
    }),
    updateProject: builder.mutation({
      query: ({ id, data }) => ({
        url: `${baseUrl}project/${id}`, // Use baseUrl variable here
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Project'],
    }),
    deleteProject: builder.mutation({
      query: (id) => ({
        url: `${baseUrl}project/${id}`, // Use baseUrl variable here
        method: 'DELETE',
      }),
      invalidatesTags: ['Project'],
    }),
    assignProject: builder.mutation({
      query: ({ projectId, userId }) => ({
        url: `${baseUrl}project/${projectId}/assign`, // Use baseUrl variable here
        method: 'POST',
        body: { user_ids: [userId] },
      }),
      invalidatesTags: ['Project'],
    }),
  }),
});

// Export hooks for usage in functional components
export const {
  useFetchProjectsQuery,
  useCreateProjectMutation,
  useUpdateProjectMutation,
  useDeleteProjectMutation,
  useAssignProjectMutation,
} = projectApi;
