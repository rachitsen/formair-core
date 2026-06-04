import {trpc} from '~/trpc/client'

export const useCreateForm = () => {
  const utils = trpc.useUtils()

  const {
    mutateAsync: createFormAsync,
    mutate: createForm,
    error,
    failureCount,
    isError,
    isIdle,
    isSuccess,
    status,
  } = trpc.form.createForm.useMutation({
    onSuccess: async () => {
      await utils.form.invalidate();
    },
  })

  const isLoading = status === "pending"

  return {
    createFormAsync,
    createForm,
    isLoading,
    error,
    failureCount,
    isError,
    isIdle,
    isSuccess,
    status,
  }
}

export const useListForms = () => {
  const {data: forms, error, isFetched, isFetching, isLoading, status} = trpc.form.listForms.useQuery();
  return { forms, error, isFetched, isFetching, isLoading, status }
}