import { ReactNode } from "react";
import { cookies as NextCookies } from "next/headers";
import { redirect } from "next/navigation";

interface LoginLayoutProps {
    children: ReactNode;
}

export default async function LoginLayout({ children }: LoginLayoutProps) {
    const cookies = NextCookies();
    const token = cookies.get("token");

    if (!token) {
        return <>{children}</>;
    } else {
        redirect("/livros");
    }
}
