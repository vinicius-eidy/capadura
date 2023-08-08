import { ProfileData } from "@/contexts/AuthContext";

import { Avatar, AvatarFallback, AvatarImage } from "./ui/Avatar";
import { Button } from "./ui/Button";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "./ui/HoverCard";
import { LinkUnderline } from "./LinkUnderline";

interface UserHoverCardProps {
    user: ProfileData;
}

export function UserHoverCard({ user }: UserHoverCardProps) {
    return (
        <HoverCard>
            <HoverCardTrigger asChild>
                <div className="flex items-center">
                    <Avatar className="h-8 w-8">
                        <AvatarImage src="https://github.com/eidynho.png" />
                        <AvatarFallback>{user.username[0].toUpperCase() || ""}</AvatarFallback>
                    </Avatar>
                    <Button variant="link" size="sm">
                        {user.username}
                    </Button>
                </div>
            </HoverCardTrigger>
            <HoverCardContent className="w-80">
                <div className="flex space-x-4">
                    <Avatar>
                        <AvatarImage src="https://github.com/eidynho.png" />
                        <AvatarFallback>{user.username[0]?.toUpperCase() || ""}</AvatarFallback>
                    </Avatar>
                    <div className="space-y-1">
                        <h4 className="text-sm font-semibold">@{user.username}</h4>
                        <p className="text-sm">{user.description}</p>
                        <div className="flex items-center gap-2 pt-2">
                            <LinkUnderline href="">
                                <span className="font-semibold">234</span>
                                <span>livros</span>
                            </LinkUnderline>
                        </div>
                    </div>
                </div>
            </HoverCardContent>
        </HoverCard>
    );
}
