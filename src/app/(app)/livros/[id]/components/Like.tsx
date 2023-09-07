"use client";

import { useContext } from "react";
import { Heart } from "lucide-react";

import { AuthContext } from "@/contexts/AuthContext";

import { useGetUserLikedBook } from "@/endpoints/queries/likeBookQueries";
import { useAddLikeBook, useDislikeBook } from "@/endpoints/mutations/likeBookMutation";

import { Button } from "@/components/ui/Button";

interface LikeProps {
    bookId: string;
}

export function Like({ bookId }: LikeProps) {
    const { isAuthenticated, toggleAuthDialog } = useContext(AuthContext);

    const { data: like } = useGetUserLikedBook({
        bookId,
        enabled: isAuthenticated,
    });

    const addLikeBook = useAddLikeBook();
    const dislikeBook = useDislikeBook();

    async function handleToggleLikeBook() {
        if (!isAuthenticated) {
            toggleAuthDialog(true);
            return;
        }

        const isLiked = !!like;

        if (isLiked) {
            dislikeBook.mutate({
                bookId,
                likeId: like.id,
            });
        } else {
            addLikeBook.mutate({
                bookId,
            });
        }
    }

    return (
        <>
            <Button
                size="sm"
                variant="neobrutalism"
                onClick={handleToggleLikeBook}
                className={`${like ? "bg-pink-500 text-black" : ""} hover:bg-pink-500`}
            >
                <Heart size={16} />
                <span className="font-medium">{like ? "Curtido" : "Curtir"}</span>
            </Button>
        </>
    );
}
