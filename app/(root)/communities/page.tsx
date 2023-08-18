import { fetchPosts } from "@/lib/actions/thread.action";
import { currentUser } from "@clerk/nextjs";
import React from "react";

async function Communities() {
    const res = await fetchPosts(1, 30);

    const user = await currentUser();
    return (
        <section>
            <h1 className='head-text mb-10'>Communities</h1>
        </section>
    );
}

export default Communities;
