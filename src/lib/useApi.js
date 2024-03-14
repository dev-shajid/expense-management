import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { AddProject, AddTransaction, DeleteTransaction, EditTransaction, GetAllActiviies, GetAllProjects, GetAllTransactions, GetProject, GetTransaction } from "../../action/api"

export default function useApi() {
    const queryClient = useQueryClient()
    return {
        getProject: ({id})=>useQuery({
            queryKey: ['projects', id],
            queryFn: async () => await GetProject(id),
            refetchOnWindowFocus: false,
        }),
        getAllProjects: useQuery({
            queryKey: ['projects'],
            queryFn: async () => await GetAllProjects(),
            refetchOnWindowFocus: false,
        }),
        creatProject: useMutation({
            mutationFn: AddProject,
            onSuccess: async (_, e) => await queryClient.invalidateQueries(['projects'])
        }),
        getAllTransactions: ({ isPaid, type, projectId }) => {
            return useQuery({
                queryKey: ['transactions'],
                queryFn: async () => await GetAllTransactions({ isPaid, type, projectId }),
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
            mutationFn: ({ id, data }) => EditTransaction({ id, data }),
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