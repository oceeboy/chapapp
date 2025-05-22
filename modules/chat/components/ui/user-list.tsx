"use client";

import { useState } from "react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import { useStartConversation, useUsers } from "../../hooks";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function UserList() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const { data, isLoading, isError, error, isFetching } = useUsers(
    search,
    page
  );

  const router: AppRouterInstance = useRouter();

  const { mutate } = useStartConversation();

  function startConvo(participantId: string) {
    mutate(
      {
        data: {
          participantId,
        },
      },
      {
        onSuccess: (data) => {
          toast.success(data.message, { position: "top-right" });
          router.push(
            `/conversations/message?conversationId=${data.conversation._id}`
          );
        },
        onError: (data) => {
          toast.error(data.message, { position: "top-right" });
        },
      }
    );
  }

  const totalPages = data?.totalPages || 1;

  return (
    <div className="space-y-6">
      <div className="w-full max-w-md">
        <Input
          placeholder="Search users by username..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1); // reset to page 1 on new search
          }}
        />
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[...Array(4)].map((_, idx) => (
            <Skeleton key={idx} className="h-16 w-full rounded-xl" />
          ))}
        </div>
      ) : isError ? (
        <div className="flex items-center text-red-500 gap-2">
          <AlertCircle className="w-5 h-5" />
          <span>{(error as Error).message}</span>
        </div>
      ) : data?.users.length === 0 ? (
        <p className="text-muted-foreground">No users found.</p>
      ) : (
        <>
          <div className="grid gap-4 grid-cols-2">
            {data?.users.map((user) => (
              <Card
                key={user._id}
                className="p-4 space-y-1"
                onClick={() => startConvo(user._id)}
              >
                <div className="text-lg font-medium">{user.userName}</div>
                <div className="text-sm text-muted-foreground">
                  {user.email}
                </div>
                {/* <div className="text-sm text-muted-foreground capitalize">
                  Role: {user.role}
                </div> */}
                <div className="text-xs text-muted-foreground">
                  Joined: {new Date(user.createdAt).toLocaleDateString()}
                </div>
              </Card>
            ))}
          </div>

          <div className="flex gap-2 items-center pt-4">
            <Button
              disabled={page === 1}
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              variant="outline"
            >
              Prev
            </Button>
            <span className="text-sm text-muted-foreground">
              Page {page} of {totalPages}
            </span>
            <Button
              disabled={page === totalPages}
              onClick={() => setPage((prev) => prev + 1)}
              variant="outline"
            >
              Next
            </Button>
            {isFetching && <span className="text-xs ml-2">Refreshing...</span>}
          </div>
        </>
      )}
    </div>
  );
}
