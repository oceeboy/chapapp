"use client";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { LayoutDashboardIcon, MessageCircle } from "lucide-react";
import { NavMain } from "./nav-main";

import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { NavSubMain } from "./nav-submain";
import { FootNav } from "./FooterNav";

export function SideBar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const data = {
    user: {
      name: "shadcn",
      email: "m@example.com",
      avatar: "/avatars/shadcn.jpg",
    },
    navMain: [
      {
        title: "Chat",
        url: "/chat",
        icon: LayoutDashboardIcon,
      },
      {
        title: "Conversations",
        url: "/conversations",
        icon: MessageCircle,
      },
    ],
    navSubMain: [
      //   {
      //     title: "Notification",
      //     url: "/admin/notification",
      //     icon: BellIcon,
      //     isActive: true,
      //     items: [
      //       {
      //         title: "Edit",
      //         url: "/admin/notification",
      //       },
      //       {
      //         title: "Create",
      //         url: "/admin/notification/create",
      //       },
      //     ],
      //   },
    ],
  };

  const appDetail = {
    name: "",
    image: "",
  };
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <Link
                href="/admin/dashboard"
                className="mb-12 w-full cursor-pointer flex items-center gap-2"
              >
                <Avatar className="h-8 w-8 flex justify-center items-center rounded-full ">
                  <AvatarImage
                    src={appDetail.image}
                    className="w-1/2 h-1/2"
                    alt={appDetail.name[0]}
                  />
                  <AvatarFallback>{appDetail.name[0]}</AvatarFallback>
                </Avatar>
                <h1 className="2xl:text-[20px] flex-wrap 2xl:leading-[24px]  text-[18px] font-bold text-black-1 ">
                  {appDetail.name}
                </h1>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavSubMain items={data.navSubMain} />
      </SidebarContent>
      <SidebarFooter>
        <FootNav />
      </SidebarFooter>
    </Sidebar>
  );
}
