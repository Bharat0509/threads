import UserCard from "@/components/cards/UserCard";
import ProfileHeader from "@/components/shared/ProfileHeader";
import ThreadsTab from "@/components/shared/ThreadsTab";
import { TabsList, Tabs, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { profileTabs } from "@/constants";
import { fetchUser, fetchUsers, getActivity } from "@/lib/actions/user.action";
import { currentUser } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import React from "react";

async function Activity({ params }: { params: { id: string } }) {
    const user = await currentUser();
    if (!user) return null;

    const userInfo = await fetchUser(user.id);
    if (!userInfo?.onboarded) redirect("/onboarding");

    //Fetch activities
    const activity = await getActivity(userInfo._id);

    const res = await fetchUsers({
        userId: user.id,
        searchString: "",
        pageNumber: 1,
        pageSize: 25,
    });

    return (
        <section>
            <h1 className='head-text mb-10'>Activity</h1>
            <div className='mt-10 flex flex-col gap-5'>
                {activity.length === 0 ? (
                    <p className='!text-base-regular text-light-1'>
                        No activity yet...
                    </p>
                ) : (
                    <>
                        {activity.map((activity) => (
                            <Link
                                key={activity._id}
                                href={`/thread/${activity.parentId}`}
                            >
                                <article className='activity-card'>
                                    <div className='relative h-8 w-8'>
                                        <Image
                                            src={activity.author.image}
                                            alt='Profile Img'
                                            fill
                                            className='cursor-pointer rounded-full object-cover'
                                        />
                                    </div>
                                    <p className='!text-small-regular text-light-1'>
                                        <span className='mr-1 text-primary-500'>
                                            {activity.author.name}
                                        </span>{" "}
                                        replied to your thread
                                    </p>
                                </article>
                            </Link>
                        ))}
                    </>
                )}
            </div>
        </section>
    );
}

export default Activity;
