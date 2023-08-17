import ThreadCard from "@/components/cards/ThreadCard";
import Comment from "@/components/forms/Comment";
import { fetchThreadById } from "@/lib/actions/thread.action";
import { fetchUser } from "@/lib/actions/user.action";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { json } from "stream/consumers";

async function ThreadWithId({ params }: { params: { id: string } }) {
    if (!params.id) return null;
    const user = await currentUser();
    if (!user) return null;
    const userInfo = await fetchUser(user.id);
    if (!userInfo.onboarded) redirect("/onboarding");
    const thread = await fetchThreadById(params.id);
    return (
        <section className='relative'>
            <div>
                <ThreadCard
                    key={thread._id}
                    id={thread._id}
                    currentUserId={user?.id || ""}
                    parentId={thread.parentId}
                    content={thread.text}
                    author={thread.author}
                    createdAt={thread.createdAt}
                    comments={thread.children}
                />
            </div>
            <div className='mt-7'>
                <Comment
                    threadId={thread._id}
                    currentUserImg={userInfo.image}
                    currentUserId={JSON.stringify(userInfo._id)}
                />
            </div>
            <div className='flex flex-col gap-2'>
                {thread.children.map((children: any) => (
                    <ThreadCard
                        key={children._id}
                        id={children._id}
                        currentUserId={children?.id || ""}
                        parentId={children.parentId}
                        content={children.text}
                        author={children.author}
                        createdAt={children.createdAt}
                        comments={children.children}
                        isComment
                    />
                ))}
            </div>
        </section>
    );
}

export default ThreadWithId;
