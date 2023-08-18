"use client";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
interface ThreadCardProps {
    id: string;
    username: string;
    name: string;
    imgUrl: string;
    personType?: string;
}

const UserCard = ({
    id,
    imgUrl,
    name,
    personType,
    username,
}: ThreadCardProps) => {
    const router = useRouter();
    return (
        <article className='user-card'>
            <div className='user-card_avatar '>
                <div className='relative h-8 w-8'>
                    <Image
                        src={imgUrl}
                        alt='Profile Img'
                        fill
                        className='cursor-pointer rounded-full object-cover'
                    />
                </div>
                <div className='flex-1 text-ellipsis'>
                    <h4 className='text-base-semibold text-light-1'>{name}</h4>
                    <p className='text-small-medium text-gray-1'>@{username}</p>
                </div>
            </div>
            <Button
                className='user-card_btn '
                onClick={() => router.push(`/profile/${id}`)}
            >
                View
            </Button>
        </article>
    );
};

export default UserCard;
