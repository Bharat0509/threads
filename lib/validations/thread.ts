import * as z from "zod";
export const ThreadValidation = z.object({
    accountId: z.string().nonempty(),
    thread: z.string().min(3).nonempty(),
});

export const CommentValidation = z.object({
    thread: z.string().min(3).nonempty(),
});
