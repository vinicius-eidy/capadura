"use client";

import { useContext } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FieldValues, useForm } from "react-hook-form";

import { api } from "@/lib/api";
import { AuthContext } from "@/contexts/AuthContext";
import getGoogleOAuthURL from "@/utils/get-google-url";

import { Button } from "@/components/Button";
import { ButtonLink } from "@/components/ButtonLink";

export default function SignUp() {
    const router = useRouter();

    const { register, handleSubmit } = useForm();
    const { signIn } = useContext(AuthContext);

    async function handleSignUp({ username, email, password }: FieldValues) {
        try {
            await api.post("/users", {
                username,
                email,
                password,
            });

            await signIn({
                email,
                password,
            });

            router.push("/books");
        } catch (err) {
            throw new Error("Failed to create account: " + err);
        }
    }

    return (
        <div className="flex w-full">
            <main className="w-full px-4 lg:w-3/5 lg:px-20">
                <header className="pb-20 pt-20">
                    <div className="flex items-center justify-between">
                        <Link href="/" className="font-medium">
                            Contopia
                        </Link>
                        <Link href="/login" className="font-medium underline">
                            Entrar
                        </Link>
                    </div>
                    <h1 className="mt-20 text-justify text-4xl font-medium leading-snug">
                        Faça parte de uma comunidade que ama livros.
                    </h1>
                </header>
                <div className="flex w-full flex-col gap-8">
                    <ButtonLink href={getGoogleOAuthURL()} size="md" className="bg-blue-500">
                        Conectar com Google
                    </ButtonLink>
                    <div
                        className="flex items-center
                            before:mr-4 before:h-[1px] before:flex-1 before:bg-black before:content-['']
                            after:ml-4 after:h-[1px] after:flex-1 after:bg-black after:content-['']
                        "
                    >
                        <span>ou</span>
                    </div>
                    <form onSubmit={handleSubmit(handleSignUp)} className="flex flex-col gap-8">
                        <label className="w-full">
                            <span className="mb-2 block font-medium">Nome do usuário</span>
                            <input
                                {...register("username")}
                                type="text"
                                className="w-full rounded-md border border-black px-4 py-3 font-normal outline-pink-500"
                            />
                        </label>
                        <label className="w-full">
                            <span className="mb-2 block font-medium">Email</span>
                            <input
                                {...register("email")}
                                type="text"
                                className="w-full rounded-md border border-black px-4 py-3 font-normal outline-pink-500"
                            />
                        </label>
                        <label className="w-full">
                            <span className="mb-2 block font-medium">Senha</span>
                            <input
                                {...register("password")}
                                type="password"
                                className="w-full rounded-md border border-black px-4 py-3 font-normal outline-pink-500"
                            />
                        </label>
                        <Button size="md">Criar conta</Button>
                    </form>
                    <span className="mb-8 block font-medium">
                        Você concorda com nossos{" "}
                        <Link href="" className="underline">
                            Termos de Uso
                        </Link>{" "}
                        e{" "}
                        <Link href="" className="underline">
                            Política de Privacidade
                        </Link>
                        .
                    </span>
                </div>
            </main>
            <aside className="hidden lg:block lg:w-2/5">
                <div className="h-screen w-full bg-black"></div>
            </aside>
        </div>
    );
}