import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { AddProject, GetAllProjects } from "../../action/api"

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
    }
}