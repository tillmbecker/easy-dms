import Link from "next/link";
import { SidebarMenu, SidebarMenuItem } from "../ui/sidebar";

export default function AppName() {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <div className="flex w-full items-center justify-start p-2">
          <h1 className="font-bold text-xl">
            <Link href="/">{process.env.NEXT_PUBLIC_APP_NAME || ""}</Link>
          </h1>
        </div>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
