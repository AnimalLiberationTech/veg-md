import {Link} from "@/i18n/navigation";
import {uvmEmail, veganMoldovaTgGroupUrl} from "@/constants";
import {useTranslations} from "next-intl";
import FriendCard from "./FriendCard";
import type {Friend} from "@/types/friend";

type FriendsProps = {
  friends: Friend[];
};

const Friends = ({ friends }: FriendsProps) => {
  const t = useTranslations("partnersAndFriendsPage");

  return (
    <section id="partners-and-friends">
      <div className="container">
        <p className="mb-10 max-w-4xl text-base leading-relaxed text-body-color md:text-lg">
          {t.rich("collaborationInvite", {
            valuesLink: (chunks) => (
              <Link href="/community/values" className="text-primary hover:underline">
                {chunks}
              </Link>
            ),
            emailLink: (chunks) => (
              <a href={`mailto:${uvmEmail}`} className="text-primary hover:underline">
                {chunks}
              </a>
            ),
            telegramLink: (chunks) => (
              <a
                href={veganMoldovaTgGroupUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                {chunks}
              </a>
            ),
          })}
        </p>
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

