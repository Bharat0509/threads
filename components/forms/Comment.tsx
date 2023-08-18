"use client";
import React, { ChangeEvent, useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { Textarea } from "../ui/textarea";
import { isBase64Image } from "@/lib/utils";
import { updateUser } from "@/lib/actions/user.action";
import { usePathname, useRouter } from "next/navigation";
import { CommentValidation } from "@/lib/validations/thread";
import { addCommentToThread } from "@/lib/actions/thread.action";

interface CommentProps {
    threadId: string;
    currentUserImg: string;
    currentUserId: string;
}
const Comment = ({ currentUserId, currentUserImg, threadId }: CommentProps) => {
    const pathname = usePathname();
    const router = useRouter();
    const form = useForm({
        resolver: zodResolver(CommentValidation),
        defaultValues: {
            thread: "",
        },
    });
    const onSubmit = async (values: z.infer<typeof CommentValidation>) => {
        await addCommentToThread(
            threadId,
            values.thread,
            JSON.parse(currentUserId),
            pathname
        );
        form.reset();
    };

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className='comment-form'
            >
                <FormField
                    control={form.control}
                    name='thread'
                    render={({ field }) => (
                        <FormItem className='flex items-center w-full gap-3'>
                            <FormLabel>
                                <div className='relative h-8 w-8'>
                                    <Image
                                        src={currentUserImg}
                                        alt={currentUserId}
                                        fill
                                        className='cursor-pointer rounded-full object-cover'
                                    />
                                </div>
                            </FormLabel>
                            <FormControl className='w-full border-none bg-transparent'>
                                <Input
                                    type='text'
                                    placeholder='Comment...'
                                    className='no-focus text-light-1 outline-none '
                                    {...field}
                                />
                            </FormControl>
                        </FormItem>
                    )}
                />

                <Button type='submit' className='comment-form_btn'>
                    Reply
                </Button>
            </form>
        </Form>
    );
};

export default Comment;
