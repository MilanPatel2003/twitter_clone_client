import api from "@/lib/api";
import { useState } from "react";

export function useFollow(initialFollowing:boolean) {
    const [isFollowing,setIsfollowing] = useState(initialFollowing)

    const follow = async (userId:number) => {
        await api.post(`/follows/${userId}`)
        setIsfollowing(true)
    }
    const unFollow = async (userId:number) => {
        await api.delete(`follows/${userId}`)
        setIsfollowing(false)
    }

    return {isFollowing,follow,unFollow}
}