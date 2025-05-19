import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { CreatureFullData } from 'entities/creature/model'

export const llmApi = createApi({
  reducerPath: 'llmApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api/llm' }),
  endpoints: builder => ({
    // POST /api/llm/text → { job_id }
    submitGenerationPrompt: builder.mutation<{ job_id: string }, { description: string }>({
      query: body => ({
        url: '/text',
        method: 'POST',
        body
      }),
    }),

    // POST /api/llm/image → { job_id }
    submitGenerationImage: builder.mutation<{ job_id: string }, FormData>({
      query: formData => ({
        url: '/image',
        method: 'POST',
        body: formData,
      }),
    }),

    // GET /api/llm/{job_id} → { status, result? }
    getGenerationStatus: builder.query<{ status: 'pending'|'processing_step_1'|'processing_step_2'|'done'|'error'; result?: CreatureFullData },string >({
      query: jobId => `/${jobId}`,
    }),
  }),
})

export const {
  useSubmitGenerationPromptMutation,
  useSubmitGenerationImageMutation,
  useGetGenerationStatusQuery,
} = llmApi
export default llmApi
