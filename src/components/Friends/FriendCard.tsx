import Image from "next/image";
import type { Friend } from "@/types/friend";

const FriendCard = ({ friend }: { friend: Friend }) => {
  return (
    <a
      href={friend.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group block h-full overflow-hidden rounded-xs bg-white p-6 shadow-one duration-300 hover:shadow-two dark:bg-gray-dark dark:hover:shadow-gray-dark"
    >
      <div
        className="relative mb-6 aspect-square overflow-hidden rounded-sm border border-dark/10 bg-white p-6 dark:border-white/10"
        style={{
          backgroundColor: friend.logoBackgroundColor,
        }}
      >
        <Image
          src={friend.image}
          alt={`${friend.name} logo`}
          fill
          className="object-contain p-2"
        />
      </div>
      <h3 className="mb-2 text-2xl font-bold text-black transition group-hover:text-primary dark:text-white">
        {friend.name}
      </h3>
      <p className="break-all text-sm font-medium text-body-color dark:text-body-color-dark">
        {friend.url.replace(/^https?:\/\//, "")}
      </p>
    </a>
  );
};

export default FriendCard;
