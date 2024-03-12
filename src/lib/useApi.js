import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { AddProject, AddTransaction, GetAllActiviies, GetAllProjects, GetAllTransactions } from "../../action/api"

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
        getAllTransactions: useQuery({
            queryKey: ['transactions'],
            queryFn: async () => await GetAllTransactions(),
            refetchOnWindowFocus: false,
        }),
        creatTransaction: useMutation({
            mutationFn: AddTransaction,
            onSuccess: async (_, e) => await queryClient.invalidateQueries(['transactions'])
        }),
        getAllActivities: useQuery({
            queryKey: ['activities'],
            queryFn: async () => await GetAllActiviies(),
            refetchOnWindowFocus: false,
        }),
    }
}