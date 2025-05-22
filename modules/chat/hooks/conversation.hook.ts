import { useMutation, useQuery } from "@tanstack/react-query";
import {
  myConversations,
  startConversation,
} from "../services/conversation.service";

import { ChatSchema, Conversationschema } from "../types";
import { queryClient } from "@/lib/queryClient";
import { createChat, messageConversation } from "../services";

export const useStartConversation = () => {
  return useMutation({
    mutationFn: ({ data }: { data: Conversationschema }) =>
      startConversation(data),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["useConversations"] }),
      ]);
    },
  });
};

export const useConversations = () => {
  return useQuery({
    queryKey: ["useConversations"],
    queryFn: () => myConversations(),
    refetchInterval: 5000, // <-- auto refetch every 5 seconds
    refetchOnWindowFocus: true, // <-- refetch when user focuses the tab
    staleTime: 0,
    refetchIntervalInBackground: true,
  });
};

export const useMessageById = (convesationId: string) => {
  return useQuery({
    queryKey: ["useMessages", convesationId],
    queryFn: () => messageConversation(convesationId),

    enabled: !!convesationId,
    refetchInterval: 2000, // <-- auto refetch every 5 seconds
    refetchOnWindowFocus: true, // <-- refetch when user focuses the tab
    // staleTime: 0, // <-- data becomes stale immediately (forces fresh fetch)
    staleTime: 0, // cache stays fresh for 5 minutes
    // 👈 poll every 3 seconds
    refetchIntervalInBackground: true,
  });
};

export const useCreateChat = () => {
  return useMutation({
    mutationFn: ({ data }: { data: ChatSchema }) => createChat(data),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["useConversations"] }),
        queryClient.invalidateQueries({ queryKey: ["useMessages"] }),
      ]);
    },
  });
};
