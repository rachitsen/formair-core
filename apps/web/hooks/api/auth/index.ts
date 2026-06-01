import {trpc} from '~/trpc/client'
export const useSignup = () => {
  const utils = trpc.useUtils()

      const {mutateAsync: createUserWithEmailAndPasswordAsync, 
        mutate:createUserWithEmailAndPassword,
        error,
        failureCount,
        isError,
        isIdle,
        isSuccess,
        status
    } = 
      trpc.auth.createUserWithEmailAndPassword.useMutation({
        //cacheIn Validation
        onSuccess: async () => {
          await utils.auth.getLoggedInUserInfo.invalidate();
        }
      });
      return {
        createUserWithEmailAndPasswordAsync,
        createUserWithEmailAndPassword,
        error,
        failureCount,
        isError,
        isIdle,
        isSuccess,
        status
      }
}

export const useSignIn = () => {
  
  const utils = trpc.useUtils()
    const {mutateAsync: signinUserWithEmailAndPasswordAsync, 
        mutate:signinUserWithEmailAndPassword,
        error,
        failureCount,
        isError,
        isIdle,
        isSuccess,
        status
    } = trpc.auth.signinUserWithEmailAndPassword.useMutation({
        onSuccess: async () => {
          await utils.auth.getLoggedInUserInfo.invalidate();
        }
      });

    return {
      signinUserWithEmailAndPasswordAsync,
      signinUserWithEmailAndPassword,
      error,
      failureCount,
      isError,    
      isIdle,
      isSuccess,
      status
    }
}

export const useUser = () => {
  const {data: user, error, isFetched, isLoading, status} = trpc.auth.getLoggedInUserInfo.useQuery();
return {
      user,
      error,
      isFetched,
      isLoading,  
      status
    }
}