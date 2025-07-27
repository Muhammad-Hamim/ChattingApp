import { apiSlice } from "@/redux/api/apiSlice";
import type { TUserData, UserData } from "@/types/auth";

export const authApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    registration: builder.mutation<{ data: TUserData }, { userData: TUserData }>({
      query: ({ userData }) => {
        console.log(userData);
        return {
          url: "/user",
          method: "POST",
          body: userData,
        };
      },
    }),
    login: builder.mutation<{ user: UserData }, { uid: string }>({
      query: ({ uid }) => ({
        url: "/user/login",
        method: "POST",
        body: { uid },
      }),
    }),
    updateLastLogin: builder.mutation<{ success: boolean }, { uid: string }>({
      query: ({ uid }) => ({
        url: "/auth/update-login",
        method: "POST",
        body: { uid, lastLogin: new Date().toISOString() },
      }),
    }),
  }),
});

export const {
  useRegistrationMutation,
  useLoginMutation,
  useUpdateLastLoginMutation,
} = authApi;
