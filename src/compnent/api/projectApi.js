
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const projectApi = createApi({
  reducerPath: 'projectApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://task-manager.codionslab.com/api/v1/admin',
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
      query: (page=1) => `project?page=${page}`,
      providesTags: ['Project'],
    }),
    createProject: builder.mutation({
      query: (newProject) => ({
        url: 'project',
        method: 'POST',
        body: newProject,
      }),
      invalidatesTags: ['Project'],
    }),
    updateProject: builder.mutation({
      query: ({ id, data }) => ({
        url: `project/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Project'],
    }),
    deleteProject: builder.mutation({
      query: (id) => ({
        url: `project/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Project'],
    }),
    assignProject: builder.mutation({
      query: ({ projectId, userId }) => ({
        url: `project/${projectId}/assign`,
        method: 'POST',
        body: { user_id: userId },
      }),
      invalidatesTags: ['Project'],
    }),
  }),
});

export const {
  useFetchProjectsQuery,
  useCreateProjectMutation,
  useUpdateProjectMutation,
  useDeleteProjectMutation,
  useAssignProjectMutation,
} = projectApi;