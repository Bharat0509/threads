import UserCard from "@/components/cards/UserCard";
import ProfileHeader from "@/components/shared/ProfileHeader";
import ThreadsTab from "@/components/shared/ThreadsTab";
import { TabsList, Tabs, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { profileTabs } from "@/constants";
import { fetchUser, fetchUsers } from "@/lib/actions/user.action";
import { currentUser } from "@clerk/nextjs";
import Image from "next/image";
import { redirect } from "next/navigation";
import React from "react";

async function Search({ params }: { params: { id: string } }) {
    const user = await currentUser();
    if (!user) return null;

    const userInfo = await fetchUser(user.id);
    if (!userInfo?.onboarded) redirect("/onboarding");
    //Fetch Users
    const res = await fetchUsers({
        userId: user.id,
        searchString: "",
        pageNumber: 1,
        pageSize: 25,
    });

    return (
        <section>
            <h1 className='head-text mb-10'>Search</h1>
            <div className='mt-14 flex flex-col gap-9'>
                {res.users.length === 0 ? (
                    <p className='no-result'>No users found...</p>
                ) : (
                    <>
                        {res.users.map((user) => (
                            <UserCard
                                key={user.id}
                                id={user.id}
                                name={user.name}
                                username={user.username}
                                imgUrl={user.image}
                                personType='User'
                            />
                        ))}
                    </>
                )}
            </div>
        </section>
    );
}

export default Search;
