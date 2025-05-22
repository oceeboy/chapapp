import { useQuery } from "@tanstack/react-query";
import { me, users } from "../services";

export function useUsers(search: string, page: number, limit: number = 10) {
  const { data, error, isLoading, isError, isFetching } = useQuery({
    queryKey: ["users", search, page],
    queryFn: () => users(search, page, limit),

    refetchInterval: 3000, // <-- auto refetch every 5 seconds
    refetchOnWindowFocus: false, // <-- refetch when user focuses the tab
    // staleTime: 0, // <-- data becomes stale immediately (forces fresh fetch)
    staleTime: 1000 * 60 * 5, // cache stays fresh for 5 minutes
    // 👈 poll every 3 seconds
    refetchIntervalInBackground: false, // change true for production as i want it to fetch even when not focused on
  });
  return { data, error, isLoading, isError, isFetching };
}

export function useMe() {
  return useQuery({
    queryKey: ["useMe"],
    queryFn: () => me(),
    refetchInterval: 5000, // <-- auto refetch every 5 seconds
    refetchOnWindowFocus: true, // <-- refetch when user focuses the tab
    // staleTime: 0, // <-- data becomes stale immediately (forces fresh fetch)
    staleTime: 1000 * 60 * 5, // cache stays fresh for 5 minutes
    // 👈 poll every 3 seconds
    refetchIntervalInBackground: true,
  });
}
