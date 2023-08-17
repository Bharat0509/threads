"use client";
import React, { ChangeEvent, useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { userValidation } from "@/lib/validations/user";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { Textarea } from "../ui/textarea";
import { isBase64Image } from "@/lib/utils";
import { useUploadThing } from "@/lib/uploadthing";
import { updateUser } from "@/lib/actions/user.action";
import { usePathname, useRouter } from "next/navigation";

interface Props {
    user: {
        id: string;
        objectId: string;
        username: string;
        name: string;
        bio: string;
        image: string;
    };
    btnTitle: string;
}
const AccountProfile = ({ user, btnTitle }: Props) => {
    const [file, setFile] = useState<File[]>([]);
    const { startUpload } = useUploadThing("media");
    const pathname = usePathname();
    const router = useRouter();
    const form = useForm({
        resolver: zodResolver(userValidation),
        defaultValues: {
            profile_photo: user?.image || "",
            name: user?.name || "",
            username: user?.username || "",
            bio: user?.bio || "",
        },
    });

    const handleImage = (
        e: ChangeEvent<HTMLInputElement>,
        fieldChange: (value: string) => void
    ) => {
        e.preventDefault();
        const fileReader = new FileReader();
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            setFile(Array.from(e.target.files));

            if (!file.type.includes("image")) return;

            fileReader.onload = async (event) => {
                const imageDataUrl = event.target?.result?.toString() || "";
                fieldChange(imageDataUrl);
            };
            fileReader.readAsDataURL(file);
        }
    };

    async function onSubmit(values: z.infer<typeof userValidation>) {
        const blob = values.profile_photo;
        const hasImageChanged = isBase64Image(blob);
        if (hasImageChanged) {
            const imgRes = await startUpload(file);
            if (imgRes && imgRes[0].fileUrl) {
                values.profile_photo = imgRes[0].fileUrl;
            }
        }
        await updateUser(
            user.id,
            values.username,
            values.name,
            values.bio,
            values.profile_photo,
            pathname
        );
        if (pathname === "/profile/edit") return router.back();
        else router.push("/");
    }
    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className='flex flex-col justify-start gap-10'
            >
                <FormField
                    control={form.control}
                    name='profile_photo'
                    render={({ field }) => (
                        <FormItem className='flex items-center gap-4'>
                            <FormLabel className='account-form_image-label text-white'>
                                {field.value ? (
                                    <Image
                                        src={field.value}
                                        alt='Profile Photo'
                                        width={96}
                                        height={96}
                                        priority
                                        className='rounded-full object-contain'
                                    />
                                ) : (
                                    <Image
                                        src={"/assets/profile.svg"}
                                        alt='Profile Photo'
                                        width={96}
                                        height={96}
                                        className='object-contain'
                                    />
                                )}
                            </FormLabel>
                            <FormControl className='flex-1 text-base-semibold text-gray-200'>
                                <Input
                                    type='file'
                                    accept='image/*'
                                    placeholder='Upload a photo'
                                    className='account-form_image-input'
                                    onChange={(e) =>
                                        handleImage(e, field.onChange)
                                    }
                                />
                            </FormControl>
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name='name'
                    render={({ field }) => (
                        <FormItem className='flex flex-col w-full gap-3'>
                            <FormLabel className='text-base-semibold gap-3 w-full text-light-2'>
                                Name
                            </FormLabel>
                            <FormControl>
                                <Input
                                    type='text'
                                    className='account-form_input no-focus'
                                    {...field}
                                />
                            </FormControl>
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name='username'
                    render={({ field }) => (
                        <FormItem className='flex flex-col w-full gap-3'>
                            <FormLabel className='text-base-semibold gap-3 w-full text-light-2'>
                                Userame
                            </FormLabel>
                            <FormControl>
                                <Input
                                    type='text'
                                    className='account-form_input no-focus'
                                    {...field}
                                />
                            </FormControl>
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name='bio'
                    render={({ field }) => (
                        <FormItem className='flex flex-col w-full gap-3'>
                            <FormLabel className='text-base-semibold gap-3 w-full text-light-2'>
                                Bio
                            </FormLabel>
                            <FormControl>
                                <Textarea
                                    rows={10}
                                    className='account-form_input no-focus'
                                    {...field}
                                />
                            </FormControl>
                        </FormItem>
                    )}
                />
                <Button type='submit' className='bg-primary-500 '>
                    Submit
                </Button>
            </form>
        </Form>
    );
};

export default AccountProfile;
