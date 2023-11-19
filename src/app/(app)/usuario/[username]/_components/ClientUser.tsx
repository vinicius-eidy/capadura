"use client";

// import { useState } from "react";
import { notFound } from "next/navigation";
import { Link as LinkIcon, MapPin, Twitter } from "lucide-react";

import { ProfileDataResponse } from "@/endpoints/queries/usersQueries";

import { useWindowSize } from "@/hooks/useWindowSize";

import { useFetchUserByUsername } from "@/endpoints/queries/usersQueries";
import { useGetUsersFollowsCount } from "@/endpoints/queries/followsQueries";
import { ReadData, useFetchUserReadsByStatus } from "@/endpoints/queries/readsQueries";
import { ProgressData, useFetchUserProgress } from "@/endpoints/queries/progressQueries";

import Loading from "../loading";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/Avatar";
// import { Calendar } from "@/components/ui/Calendar";
import { EditProfileButton } from "../_components/EditProfileButton";
import { FavoriteBooks } from "../_components/favoriteBooks";
import { FinishedReads } from "../_components/FinishedReads";
import { FollowUserButton } from "../_components/follows/FollowUserButton";
import { FollowersDialog } from "../_components/follows/FollowersDialog";
import { FollowingDialog } from "../_components/follows/FollowingDialog";
import { LinkUnderline } from "@/components/LinkUnderline";
import { RatingChart } from "@/components/RatingChart";
import { RecentProgress } from "../_components/RecentProgress";
import { UserActivities } from "../_components/UserActivities";

export interface HandleToggleFollowUserProps {
    userId: string;
    targetUserId: string;
}

export interface UserData {
    user: ProfileDataResponse;
    reads: {
        items: ReadData[];
        total: number;
    };
    progress: {
        items: ProgressData[];
        total: number;
    };
    followersCount: number;
    followingCount: number;
}

interface ClientUserProps {
    username: string;
}

export function ClientUser({ username }: ClientUserProps) {
    // const [date, setDate] = useState<Date | undefined>(new Date());

    const { width } = useWindowSize();

    // ----- queries ----- //
    const {
        data: targetUser,
        isFetched: isFetchedUser,
        isError: isErrorFetchUser,
    } = useFetchUserByUsername({
        username: username,
        enabled: !!username,
    });

    const { data: followingCount, isFetched: isFetchedFollowsCount } = useGetUsersFollowsCount({
        userId: targetUser?.id || "",
        enabled: !!targetUser?.id,
    });

    const { data: userReads, isFetched: isFetchedUserReads } = useFetchUserReadsByStatus({
        userId: targetUser?.id || "",
        status: "FINISHED",
        enabled: !!targetUser?.id,
    });

    const { data: userProgress, isFetched: isFetchedUserProgress } = useFetchUserProgress({
        userId: targetUser?.id || "",
        enabled: !!targetUser?.id,
    });

    const isMounting =
        !isFetchedUser || !isFetchedFollowsCount || !isFetchedUserReads || !isFetchedUserProgress;

    if ((isFetchedUser && !targetUser) || isErrorFetchUser) {
        notFound();
    }

    if (isMounting) {
        return <Loading />;
    }

    const ProfileHeader = () => (
        <div className="flex w-full flex-col gap-5 md:w-[28rem]">
            <div className="mt-5 flex gap-x-8 gap-y-3 md:mt-3">
                {!!targetUser?.id && (
                    <>
                        <FollowersDialog
                            username={username}
                            targetUserId={targetUser.id}
                            followersCount={followingCount?.followers || 0}
                        />

                        <FollowingDialog
                            username={username}
                            targetUserId={targetUser.id}
                            followingCount={followingCount?.following || 0}
                        />
                    </>
                )}
            </div>

            {targetUser?.description && (
                <p className="text-sm text-muted-foreground">{targetUser?.description}</p>
            )}

            <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm">
                {targetUser?.location && (
                    <div className="flex items-center gap-1">
                        <MapPin size={16} className="text-black dark:text-white" />

                        <span className="text-muted-foreground">{targetUser.location}</span>
                    </div>
                )}

                {targetUser?.website && (
                    <div className="flex items-center gap-1">
                        <LinkIcon size={15} className="text-black dark:text-white" />

                        <LinkUnderline asChild className="font-semibold text-muted-foreground">
                            <a href={targetUser.website} target="_blank">
                                {targetUser.website}
                            </a>
                        </LinkUnderline>
                    </div>
                )}

                {targetUser?.twitter && (
                    <div className="flex items-center gap-1">
                        <Twitter size={16} className="text-black dark:text-white" />
                        <LinkUnderline asChild className="font-semibold text-muted-foreground">
                            <a href={`https://twitter.com/${targetUser?.twitter}`} target="_blank">
                                {targetUser.twitter}
                            </a>
                        </LinkUnderline>
                    </div>
                )}
            </div>
        </div>
    );

    return (
        <>
            <div className="flex flex-col items-start justify-center md:flex-row">
                <div className="flex items-start gap-8">
                    <Avatar className="h-28 w-28 md:h-40 md:w-40">
                        <AvatarImage
                            src={targetUser?.imageUrl}
                            width={160}
                            height={160}
                            loading="eager"
                            alt={`Foto de perfil dea ${targetUser?.username}`}
                            title={`Foto de perfil de ${targetUser?.username}`}
                        />
                        <AvatarFallback className="text-2xl">
                            {targetUser?.username[0]?.toUpperCase()}
                        </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col gap-3">
                        <div className="flex flex-col gap-4 md:flex-row md:items-start">
                            <div>
                                <h1 className="block text-xl font-bold leading-relaxed tracking-tight text-black dark:text-white">
                                    {targetUser?.name}
                                </h1>
                                <span className="font-medium text-black dark:text-white">
                                    @{targetUser?.username}
                                </span>
                            </div>

                            <EditProfileButton username={username} />
                            {!!targetUser?.id && (
                                <FollowUserButton
                                    username={username}
                                    targetUserId={targetUser.id}
                                />
                            )}
                        </div>

                        {!!width && width >= 768 && <ProfileHeader />}
                    </div>
                </div>

                {!!width && width < 768 && <ProfileHeader />}
            </div>

            <div className="mt-8 flex flex-col justify-center gap-8 lg:flex-row">
                <div className="flex w-full flex-col gap-12 lg:w-3/5">
                    <FavoriteBooks username={username} />

                    {!!userReads && <FinishedReads username={username} readsData={userReads} />}

                    {!!userProgress && (
                        <RecentProgress username={username} progressData={userProgress} />
                    )}
                </div>

                <div className="w-full lg:w-72">
                    <div className="flex w-full flex-col gap-8 sm:flex-row lg:flex-col">
                        {/* <div className="w-full sm:w-1/2 lg:w-full">
                            <h2 className="font-semibold text-black dark:text-white">Calendário</h2>
                            <Calendar
                                mode="single"
                                selected={date}
                                onSelect={setDate}
                                className="mt-2 rounded-md border bg-white transition-colors dark:bg-dark"
                            />
                        </div> */}

                        <div className="w-full sm:w-1/2 lg:w-full">
                            <h2 className="font-semibold text-black dark:text-white">Avaliações</h2>
                            {targetUser?.id && (
                                <RatingChart userId={targetUser.id} username={username} />
                            )}
                        </div>
                    </div>

                    <div className="mt-8 w-full">
                        <h2 className="font-semibold text-black dark:text-white">Atividades</h2>
                        {targetUser?.id && <UserActivities userId={targetUser.id} />}
                    </div>
                </div>
            </div>
        </>
    );
}
