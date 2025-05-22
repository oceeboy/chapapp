"use client";

import { ChevronsUpDown, LogOut, MoveDiagonal } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

import { useAuthentication } from "@/lib/actions";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { useState } from "react";
import { useMe } from "@/modules/chat";

export function FootNav() {
  const { isMobile } = useSidebar();
  const router: AppRouterInstance = useRouter();
  const { logout } = useAuthentication();
  const { data: user } = useMe();

  async function onClickLogOut() {
    try {
      const result = await logout();

      // sessionStorage.removeItem("hasLoggedIn");

      if (result.success) {
        toast.success(result.message || "Logged out successfully.");
        router.replace("/login");

        // Delay redirect for 1.5 seconds to show the toast
        // setTimeout(() => {
        //   router.replace("/login");
        // }, 1500);
      } else {
        toast.error(result.message || "Logout failed.");
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
      console.error(error);
    }
  }
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);

  function onClickToAdmin() {
    router.replace("/admin/dashboard");
  }
  function onClickToUser() {
    router.replace("/account");
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 flex justify-center items-center rounded-full ">
                <AvatarImage
                  src={"/icons/logo2.svg"}
                  className="w-1/2 h-1/2"
                  alt={user?.userName}
                />
                <AvatarFallback className="">
                  {user?.userName[0]}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">{user?.userName}</span>
                <span className="truncate text-xs">{user?.email}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage
                    src={"/icons/logo2.svg"}
                    className="w-1/2 h-1/2"
                    alt={user?.userName}
                  />
                  <AvatarFallback className="rounded-lg">
                    {user?.userName[0]}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">
                    {user?.userName}
                  </span>
                  <span className="truncate text-xs">{user?.email}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem asChild></DropdownMenuItem>
            </DropdownMenuGroup>

            {user?.role === "admin" && (
              <DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={onClickToAdmin}>
                  <MoveDiagonal />
                  Go To Admin
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={onClickToUser}>
                  <MoveDiagonal />
                  Go To User
                </DropdownMenuItem>
              </DropdownMenuGroup>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={onClickLogOut}>
              <LogOut />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
