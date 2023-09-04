"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Library, MoreHorizontal } from "lucide-react";

import { BookData } from "@/app/(app)/livros/[id]/page";
import { isPageUserSameCurrentUser } from "@/utils/is-page-user-same-current-user";
import { publishDateFormat } from "@/utils/publish-date-format";

import { useFetchUserBookLists } from "@/endpoints/queries/bookListsQueries";
import { useFetchUserByUsername } from "@/endpoints/queries/usersQueries";
import { useFetchBooksOnBookList } from "@/endpoints/queries/booksOnBookListQueries";
import { useDeleteBookList, useUpdateBookList } from "@/endpoints/mutations/bookListsMutations";
import { useRemoveBookFromBookList } from "@/endpoints/mutations/booksOnBookListMutations";

import Loading from "./loading";

import { CreateBookListDialog } from "./components/CreateBookListDialog";
import { UpdateBookListDialog } from "./components/UpdateBookListDialog";
import { DeleteBookListDialog } from "./components/DeleteBookListDialog";

import { Button } from "@/components/ui/Button";
import { Container } from "@/components/layout/Container";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/DropdownMenu";
import { Separator } from "@/components/ui/Separator";
import { Subtitle } from "@/components/Subtitle";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/Table";
import { Title } from "@/components/Title";
import { UserHoverCard } from "@/components/UserHoverCard";

export interface BookOnBookList {
    id: string;
    bookId: string;
    bookListId: string;
}

export type BookOnBookListWithBook = BookOnBookList & {
    book: BookData;
};

interface UserListsProps {
    params: {
        username: string;
    };
}

export default function UserLists({ params }: UserListsProps) {
    const [isMounted, setIsMounted] = useState(false);
    const [activeBookList, setActiveBookList] = useState(0);

    const isCurrentUser = isPageUserSameCurrentUser(params.username);

    const { data: targetUser, isError } = useFetchUserByUsername({
        username: params.username,
    });

    const { data: bookLists, isFetching: isFetchingUserBookLists } = useFetchUserBookLists({
        userId: targetUser?.id || "",
        enabled: !!targetUser?.id,
    });

    const { data: booksOnBookList, isFetching: isFetchingBooksOnBookList } =
        useFetchBooksOnBookList({
            bookListId: bookLists?.[activeBookList]?.id || "",
            enabled: !!bookLists?.[activeBookList]?.id,
        });

    const updateBookList = useUpdateBookList();
    async function handleUpdateBookList(name: string, description?: string, image?: any) {
        if (!targetUser?.id || !bookLists) return;

        await updateBookList.mutateAsync({
            userId: targetUser.id,
            activeBookList,
            bookListId: bookLists[activeBookList].id,
            name,
            description,
            image,
        });
    }

    const deleteBookList = useDeleteBookList();
    async function handleDeleteBookList(bookListId: string) {
        if (!targetUser?.id) return;

        await deleteBookList.mutateAsync({
            userId: targetUser.id,
            bookListId,
        });
    }

    const removeBookFromBookList = useRemoveBookFromBookList();
    function handleRemoveBookFromBookList(bookOnBookList: BookOnBookList) {
        if (!targetUser?.id) return;

        const { id, bookId, bookListId } = bookOnBookList;

        removeBookFromBookList.mutate({
            userId: targetUser.id,
            bookOnBookListId: id,
            bookId: bookId,
            bookListId: bookListId,
        });
    }

    async function handleUpdateActiveBookList(index: number) {
        setActiveBookList(index);
    }

    // render loading
    // if (!isMounted) {
    //     return <Loading />;
    // }

    function renderBookLists() {
        return (
            <>
                {bookLists?.length ? (
                    <nav className="flex flex-col gap-1 text-black dark:text-white">
                        {bookLists.map((bookList, index) => {
                            return (
                                <div
                                    key={bookList.id}
                                    onClick={() => handleUpdateActiveBookList(index)}
                                    className={`${
                                        activeBookList === index
                                            ? "bg-muted-foreground text-white dark:bg-accent"
                                            : "hover:bg-muted-foreground/25 dark:hover:bg-accent/50"
                                    } cursor-pointer rounded-md px-4 py-2 text-sm`}
                                >
                                    <span className="block w-full truncate">{bookList.name}</span>
                                </div>
                            );
                        })}
                    </nav>
                ) : (
                    <div className="mx-5">
                        <span>Nenhuma lista encontrada.</span>
                    </div>
                )}
            </>
        );
    }

    return (
        <Container>
            <Title>{isCurrentUser ? "Minhas listas" : `Listas do ${params.username}`}</Title>
            {isCurrentUser && <Subtitle>Organize sua leitura do jeito que você quiser.</Subtitle>}

            <Separator className="my-6" />

            <div className="mt-4 flex flex-col gap-8 md:flex-row lg:gap-6 xl:gap-8">
                <div className="w-full md:w-1/4">
                    {isCurrentUser && (
                        <>
                            <CreateBookListDialog />
                            <Separator className="my-6" />
                        </>
                    )}
                    {renderBookLists()}
                </div>

                {bookLists?.[activeBookList] ? (
                    <div className="flex w-full flex-col gap-8 md:w-3/4">
                        <div className="flex gap-4">
                            <div className="flex h-56 w-56 rounded-md bg-neutral-800 transition-all">
                                {bookLists[activeBookList].imageUrl ? (
                                    <Image
                                        src={bookLists[activeBookList].imageUrl as string}
                                        alt=""
                                        width={224}
                                        height={224}
                                        className="rounded-md"
                                    />
                                ) : (
                                    <div className="flex h-56 w-56 items-center justify-center rounded-md text-white">
                                        <Library size={32} />
                                    </div>
                                )}
                            </div>

                            <div className="flex flex-1 flex-col justify-between gap-3">
                                <div>
                                    <div className="flex items-center justify-between gap-2">
                                        <h2 className="flex-1 text-xl font-medium leading-relaxed tracking-tight text-black dark:text-white">
                                            {bookLists[activeBookList].name}
                                        </h2>

                                        {isCurrentUser && (
                                            <>
                                                <UpdateBookListDialog
                                                    activeBookList={activeBookList}
                                                    bookLists={bookLists}
                                                    isUpdateBookListLoading={
                                                        updateBookList.isLoading
                                                    }
                                                    handleUpdateBookList={handleUpdateBookList}
                                                />

                                                <DeleteBookListDialog
                                                    bookListId={bookLists[activeBookList].id}
                                                    isDeleteBookLoading={
                                                        removeBookFromBookList.isLoading
                                                    }
                                                    handleDeleteBookList={handleDeleteBookList}
                                                />
                                            </>
                                        )}
                                    </div>
                                    <p className="mt-2 text-muted-foreground">
                                        {bookLists[activeBookList].description}
                                    </p>
                                </div>
                                <div className="flex items-center text-black dark:text-white">
                                    {targetUser && <UserHoverCard user={targetUser} />}
                                    <span className="mr-2">•</span>
                                    <span className="text-sm font-medium">
                                        {!booksOnBookList?.length
                                            ? "Nenhum livro"
                                            : booksOnBookList.length === 1
                                            ? "1 livro"
                                            : `${booksOnBookList.length} livros`}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {booksOnBookList?.length ? (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-[100px]">#</TableHead>
                                        <TableHead className="hover:bg-gray-200">Nome</TableHead>
                                        <TableHead>Autor(a)</TableHead>
                                        <TableHead>Ano de publicação</TableHead>
                                        <TableHead>Páginas</TableHead>
                                        <TableHead className="text-right"></TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {booksOnBookList?.map((bookOnBookList, index) => (
                                        <TableRow>
                                            <TableCell className="font-medium">
                                                {index + 1}
                                            </TableCell>
                                            <TableCell>
                                                <Link
                                                    href={`/livros/${bookOnBookList.bookId}`}
                                                    className="font-medium hover:underline"
                                                >
                                                    {bookOnBookList.book.title}
                                                </Link>
                                            </TableCell>
                                            <TableCell>{bookOnBookList.book.authors[0]}</TableCell>
                                            <TableCell>
                                                {publishDateFormat(bookOnBookList.book.publishDate)}
                                            </TableCell>
                                            <TableCell>{bookOnBookList.book.pageCount}</TableCell>
                                            <TableCell className="text-right">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button
                                                            variant="default"
                                                            className="flex h-8 w-8 p-0 data-[state=open]:bg-gray-200"
                                                        >
                                                            <MoreHorizontal className="h-4 w-4" />
                                                            <span className="sr-only">
                                                                Abrir menu
                                                            </span>
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent
                                                        align="end"
                                                        className="w-[160px]"
                                                    >
                                                        <DropdownMenuItem
                                                            onClick={() =>
                                                                handleRemoveBookFromBookList(
                                                                    bookOnBookList,
                                                                )
                                                            }
                                                        >
                                                            Deletar
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        ) : (
                            <div className="mt-2 flex h-36 w-full flex-col items-center justify-center rounded-md border bg-white text-center transition-colors dark:bg-dark">
                                <h2 className="text-base font-semibold text-black dark:text-white">
                                    Nenhum livro na lista.
                                </h2>
                                <p className="mt-2 w-[26rem] text-sm leading-6 text-muted-foreground">
                                    Vamos começar adicionar livros para organizar sua leitura?
                                </p>
                            </div>
                        )}
                    </div>
                ) : (
                    <></>
                )}
            </div>
        </Container>
    );
}
