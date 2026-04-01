import FriendCard from "./FriendCard";
import type {Friend} from "@/types/friend";

type FriendsProps = {
  friends: Friend[];
};

const Friends = ({ friends }: FriendsProps) => {
  return (
    <section
      id="partners-and-friends"
      className="py-16 md:py-20 lg:py-28"
    >
      <div className="container">
        <div className="grid grid-cols-1 gap-x-8 gap-y-10 md:grid-cols-2 md:gap-x-6 lg:grid-cols-4 lg:gap-x-8">
          {friends.map((friend) => (
            <div key={friend.id} className="w-full">
              <FriendCard friend={friend} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Friends;

