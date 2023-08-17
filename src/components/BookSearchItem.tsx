"use client";

import Image from "next/image";
import { Image as ImageIcon, User } from "lucide-react";

import { BookDataFromGoogle } from "./ApplicationSearch";

interface BookSearchItemProps {
    book: BookDataFromGoogle;
}

export function BookSearchItem({ book }: BookSearchItemProps) {
    return (
        <>
            <div className="h-16 w-12 overflow-hidden rounded-sm">
                {book.volumeInfo.imageLinks?.thumbnail ? (
                    <Image
                        src={book.volumeInfo.imageLinks?.thumbnail?.replace("edge=curl", "")}
                        alt=""
                        width={48}
                        height={64}
                        quality={100}
                        className="w-full overflow-hidden"
                    />
                ) : (
                    <div className="flex h-full items-center justify-center">
                        <ImageIcon size={42} className="text-gray-500" />
                    </div>
                )}
            </div>

            <div>
                <div className="flex items-center gap-2">
                    <h2 className="line-clamp-1" title={book.volumeInfo.title}>
                        {book.volumeInfo.title}
                    </h2>
                    <span className="text-xs text-gray-500">
                        {book.volumeInfo.publishedDate &&
                            book.volumeInfo.publishedDate.split("-")[0]}
                    </span>
                </div>
                <span className="flex items-center gap-2 text-sm">
                    <User size={18} />
                    {book.volumeInfo.authors?.[0]}
                </span>
            </div>
        </>
    );
}
