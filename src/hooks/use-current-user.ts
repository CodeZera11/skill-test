// import { useConvexAuth, useQuery } from "convex/react";
// import { api } from "~/convex/_generated/api";

// export function useCurrentUser() {
//   const { isLoading, isAuthenticated } = useConvexAuth();
//   const user = useQuery(api.users.current);
//   return {
//     isLoading: isLoading || (isAuthenticated && user === null),
//     isAuthenticated: isAuthenticated && user !== null,
//     user,
//   };
// }

import { useConvexAuth, useQuery } from "convex/react";
import { api } from "~/convex/_generated/api";

export function useCurrentUser() {
  const { isAuthenticated, isLoading: authLoading } = useConvexAuth();
  const user = useQuery(api.users.current);

  const isLoading = authLoading || (isAuthenticated && user === undefined);

  console.log("useCurrentUser:", { isLoading, isAuthenticated, user });

  return {
    isLoading,
    isAuthenticated, // ← ONLY from Convex auth
    user, // null | object
  };
}
