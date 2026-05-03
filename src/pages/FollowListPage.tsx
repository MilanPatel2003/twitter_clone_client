import { useParams } from "react-router-dom";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MainLayout } from "@/components/Layout/MainLayout";
import { useFollowers, useFollowing } from "@/hooks/useFollow";
import { useNavigate } from "react-router-dom";

export function FollowListPage() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { followers } = useFollowers(Number(userId));
  const { followings } = useFollowing(Number(userId));

  return (
    <MainLayout>
      <Tabs className="mt-10" defaultValue="followers">
        <TabsList className="w-full rounded-none border-b border-gray-200 bg-transparent h-auto p-0">
          <TabsTrigger
            value="followers"
            className="flex-1 text-sm font-semibold text-gray-500 rounded-none border-b-2 border-transparent pb-3 pt-2 data-[state=active]:border-[#1d9bf0] data-[state=active]:text-gray-900 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
          >
            Followers
          </TabsTrigger>
          <TabsTrigger
            value="following"
            className="flex-1 text-sm font-semibold text-gray-500 rounded-none border-b-2 border-transparent pb-3 pt-2 data-[state=active]:border-[#1d9bf0] data-[state=active]:text-gray-900 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
          >
            Following
          </TabsTrigger>
        </TabsList>

        <TabsContent value="followers" className="mt-0">
          {followers.length > 0 ? (
            followers.map((user) => (
              <div
                key={user.user_id}
                onClick={() => navigate(`/${user.username}`)}
                className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100"
              >
                <Avatar className="w-10 h-10">
                  <AvatarImage src={user.profile_image} />
                  <AvatarFallback className="bg-[#1d9bf0] text-white font-semibold">
                    {user.fullname?.[0]?.toUpperCase() ?? "U"}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-bold text-sm text-gray-900">
                    {user.fullname}
                  </p>
                  <p className="text-gray-500 text-sm">@{user.username}</p>
                  
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500 py-10 text-sm">
              There’s nothing here yet.
            </p>
          )}
        </TabsContent>

        <TabsContent value="following" className="mt-0">
          {followings.length > 0 ? (
            followings.map((user) => (
              <div
                key={user.user_id}
                onClick={() => navigate(`/${user.username}`)}
                className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100"
              >
                <Avatar className="w-10 h-10">
                  <AvatarImage src={user.profile_image} />
                  <AvatarFallback className="bg-[#1d9bf0] text-white font-semibold">
                    {user.fullname?.[0]?.toUpperCase() ?? "U"}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-bold text-sm text-gray-900">
                    {user.fullname}
                  </p>
                  <p className="text-gray-500 text-sm">@{user.username}</p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500 py-10 text-sm">
              There’s nothing here yet.
            </p>
          )}
        </TabsContent>
      </Tabs>
    </MainLayout>
  );
}
