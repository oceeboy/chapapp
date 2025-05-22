import React from "react";

type HeaderBoxProps = {
  type?: "title" | "greeting";
  title: string;
  subtext?: string;
  user?: string;
};

export function HeaderBox({
  type = "title",
  title,
  subtext,
  user,
}: HeaderBoxProps) {
  return (
    <div className="flex flex-col gap-1">
      <h1 className="text-[24px] leading-[30px] lg:text-[30px] lg:leading-[38px] font-semibold text-gray-900">
        {title}
        {type === "greeting" && (
          <span className="text-cyan-800 capitalize">&nbsp;{user}</span>
        )}
      </h1>
      <p className="text-[14px] leading-[20px] lg:text-[16px] lg:leading-[24px] font-normal text-gray-600">
        {subtext}
      </p>
    </div>
  );
}
