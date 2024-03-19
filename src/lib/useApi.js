import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { AddCustomer, AddProject, AddTransaction, AddWithdraw, DeleteCustomer, DeleteTransaction, DeleteUser, DeleteWithdraw, EditCustomer, EditPassword, EditProfile, EditProject, EditTransaction, EditWithdraw, GetAllActiviies, GetAllProjects, GetAllTransactions, GetAllWithdraws, GetBasicInfo, GetCustomer, GetCustomers, GetProject, GetTransaction, GetUsers, GetWithdraw, TotalCount, VerifyUser } from "../../action/api"

export default function useApi() {
    const queryClient = useQueryClient()

    return {
        getProject: ({ id }) => useQuery({
            queryKey: ['projects', id],
            queryFn: async () => await GetProject(id),
            refetchOnWindowFocus: false,
        }),
        getAllProjects: () => useQuery({
            queryKey: ['projects'],
            queryFn: async () => await GetAllProjects(),
            refetchOnWindowFocus: false,
        }),
        creatProject: useMutation({
            mutationFn: AddProject,
            onSuccess: async (_, e) => await queryClient.invalidateQueries(['projects'])
        }),
        editProject: useMutation({
            mutationFn: async ({ id, values }) => await EditProject({ id, values }),
            onSuccess: async (_, e) => await queryClient.invalidateQueries(['projects'])
        }),


        getAllTransactions: (query, paginition) => {
            return useQuery({
                queryKey: ['transactions', query, paginition],
                queryFn: async () => await GetAllTransactions(query, paginition),
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


        getAllWithdraws: () => {
            return useQuery({
                queryKey: ['withdraws'],
                queryFn: async () => await GetAllWithdraws(),
                refetchOnWindowFocus: false,
            })
        },
        getWithdraw: ({ id }) => {
            return useQuery({
                queryKey: ['withdraws', id],
                queryFn: async () => await GetWithdraw({ id }),
                refetchOnWindowFocus: false,
            })
        },
        creatWithdraw: useMutation({
            mutationFn: ({ data }) => AddWithdraw({ data }),
            onSuccess: async (_, e) => await queryClient.invalidateQueries(['withdraws'])
        }),
        editWithdraw: useMutation({
            mutationFn: ({ id, data }) => EditWithdraw({ id, data }),
            onSuccess: async (_, e) => await queryClient.invalidateQueries(['withdraws'])
        }),
        deleteWithdraw: useMutation({
            mutationFn: ({ id }) => DeleteWithdraw({ id }),
            onSuccess: async (_, e) => await queryClient.invalidateQueries(['withdraws'])
        }),


        totalCount: (name, query) => useQuery({
            queryKey: ['total_counts', name , query],
            queryFn: async () => await TotalCount(name, query),
            refetchOnWindowFocus: false,
        }),

        getAllActivities: ({ page, limit }) => useQuery({
            queryKey: ['activities', page],
            queryFn: async (key) => {
                console.log(key)
                return await GetAllActiviies({ page, limit })
            },
            refetchOnWindowFocus: false,
        }),


        getCustomers: () => useQuery({
            queryKey: ['customers'],
            queryFn: async () => await GetCustomers(),
            refetchOnWindowFocus: false,
        }),
        getCustomer: ({ id }) => useQuery({
            queryKey: ['customers', id],
            queryFn: async () => await GetCustomer({ id }),
            refetchOnWindowFocus: false,
        }),
        addCustomer: useMutation({
            mutationFn: ({ data }) => AddCustomer({ data }),
            onSuccess: async (_, e) => await queryClient.invalidateQueries(['customers'])
        }),
        editCustomer: useMutation({
            mutationFn: ({ id, data }) => EditCustomer({ id, data }),
            onSuccess: async (_, e) => await queryClient.invalidateQueries(['customers'])
        }),
        deleteCustomer: useMutation({
            mutationFn: ({ id }) => DeleteCustomer({ id }),
            onSuccess: async (_, e) => await queryClient.invalidateQueries(['customers'])
        }),


        getBasicInfo: () => useQuery({
            queryKey: ['basic'],
            queryFn: async () => {
                let res = await GetBasicInfo()
                return res
            },
            refetchOnWindowFocus: false,
        }),

        getUsers: () => useQuery({
            queryKey: ['users'],
            queryFn: async () => await GetUsers(),
            refetchOnWindowFocus: false,
        }),
        verifyUser: useMutation({
            mutationFn: ({ id, role = 'user' }) => VerifyUser({ id, role }),
            onSuccess: async (_, e) => await queryClient.invalidateQueries(['users'])
        }),
        roleUser: useMutation({
            mutationFn: ({ id }) => VerifyUser({ id }),
            onSuccess: async (_, e) => await queryClient.invalidateQueries(['users'])
        }),
        deleteUser: useMutation({
            mutationFn: ({ id }) => DeleteUser({ id }),
            onSuccess: async (_, e) => await queryClient.invalidateQueries(['users'])
        }),


        getProfile: () => useQuery({
            queryKey: ['profile'],
            queryFn: async () => await GetUsers(),
            refetchOnWindowFocus: false,
        }),
        editProfile: useMutation({
            mutationFn: ({ id, data }) => EditProfile({ id, data }),
            onSuccess: async (_, e) => await queryClient.invalidateQueries(['profile'])
        }),
        editPassword: useMutation({
            mutationFn: ({ id, data }) => EditPassword({ id, data }),
            onSuccess: async (_, e) => await queryClient.invalidateQueries(['profile'])
        }),


    }
}