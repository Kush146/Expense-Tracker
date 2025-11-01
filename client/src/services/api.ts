import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:4000'

export type Transaction = {
  _id?: string
  type: 'income' | 'expense'
  amount: number
  description: string
  category: string
  date: string
}

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: baseUrl + '/api' }),
  tagTypes: ['Transaction', 'Summary'],
  endpoints: (builder) => ({
    getTransactions: builder.query<Transaction[], {type?: string; category?: string; startDate?: string; endDate?: string}>({
      query: (params) => ({ url: 'transactions', params }),
      providesTags: (result) => result ? [
        ...result.map((t) => ({ type: 'Transaction' as const, id: t._id })),
        { type: 'Transaction', id: 'LIST' }
      ] : [{ type: 'Transaction', id: 'LIST' }]
    }),
    addTransaction: builder.mutation<Transaction, Omit<Transaction, '_id'>>({
      query: (body) => ({ url: 'transactions', method: 'POST', body }),
      invalidatesTags: [{ type: 'Transaction', id: 'LIST' }, { type: 'Summary', id: 'ONLY' }]
    }),
    updateTransaction: builder.mutation<Transaction, {id: string; body: Omit<Transaction, '_id'>}>({
      query: ({id, body}) => ({ url: `transactions/${id}`, method: 'PUT', body }),
      invalidatesTags: (_r,_e,arg) => [{ type:'Transaction', id: arg.id }, { type: 'Summary', id:'ONLY' }]
    }),
    deleteTransaction: builder.mutation<{ok: boolean}, string>({
      query: (id) => ({ url: `transactions/${id}`, method: 'DELETE' }),
      invalidatesTags: [{ type: 'Transaction', id: 'LIST' }, { type: 'Summary', id:'ONLY'}]
    }),
    getSummary: builder.query<{income:number; expense:number; balance:number}, void>({
      query: () => ({ url: 'summary' }),
      providesTags: [{ type: 'Summary', id: 'ONLY' }]
    })
  })
})

export const { useGetTransactionsQuery, useAddTransactionMutation, useUpdateTransactionMutation, useDeleteTransactionMutation, useGetSummaryQuery } = api
