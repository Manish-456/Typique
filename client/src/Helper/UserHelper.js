
import { useGetAllUsersQuery } from "../Features/users/userApiSlice";

export const userHelperQuery = (arg = null) => {
  return useGetAllUsersQuery(arg ? arg : "userLists", {
    pollingInterval: 60000,
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
  });
};

export const userWithUserIdQuery = (userId) => {
  return useGetAllUsersQuery("userLists", {
    selectFromResult : ({data}) => ({
        user : data?.entities[userId]
    })
    ,
    pollingInterval : 60000,
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
  })
 
}