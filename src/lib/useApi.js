import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { AddProject, AddTransaction, DeleteTransaction, EditTransaction, GetAllActiviies, GetAllProjects, GetAllTransactions, GetTransaction } from "../../action/api"

export default function useApi() {
    const queryClient = useQueryClient()
    return {
        getAllProjects: useQuery({
            queryKey: ['projects'],
            queryFn: async () => await GetAllProjects(),
            refetchOnWindowFocus: false,
        }),
        creatProject: useMutation({
            mutationFn: AddProject,
            onSuccess: async (_, e) => await queryClient.invalidateQueries(['projects'])
        }),
        getAllTransactions: ({ isPaid, type }) => {
            return useQuery({
                queryKey: ['transactions'],
                queryFn: async () => await GetAllTransactions({ isPaid, type }),
                refetchOnWindowFocus: false,
            })
        },
        getTransaction: ({ id, isPaid, type }) => {
            return useQuery({
                queryKey: ['transactions', id],
                queryFn: async () => await GetTransaction(id, isPaid, type),
                refetchOnWindowFocus: false,
            })
        },
        creatTransaction: useMutation({
            mutationFn: ({ data, isPaid }) => AddTransaction({ data, isPaid }),
            onSuccess: async (_, e) => await queryClient.invalidateQueries(['transactions'])
        }),
        editTransaction: useMutation({
            mutationFn: ({ id, data, isPaid, type }) => EditTransaction({ id, data, isPaid, type }),
            onSuccess: async (_, e) => await queryClient.invalidateQueries(['transactions'])
        }),
        deleteTransaction: useMutation({
            mutationFn: (id) => DeleteTransaction(id),
            onSuccess: async (_, e) => await queryClient.invalidateQueries(['transactions'])
        }),


        getAllActivities: useQuery({
            queryKey: ['activities'],
            queryFn: async () => await GetAllActiviies(),
            refetchOnWindowFocus: false,
        }),
    }
}