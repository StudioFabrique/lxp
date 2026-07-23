import User from "../../../../utils/interfaces/user";
import { BotMessageSquare } from "lucide-react";
import { AvatarSmall } from "../../../../components/avatar/AvatarSmall";

type Props = {
  message: {
    origin: "user" | "bot";
    message: string;
  };
  user: User | null;
};

export default function AvatarChatbot({ message, user }: Props) {
  if (message.origin === "bot") return <BotMessageSquare />;
  else
    return (
      <div className="flex items-center w-10 rounded-full">
        {user ? (
          <AvatarSmall
            user={user}
            noImgClassName="text-xs p-3.5 bg-accent text-base-200 rounded-full"
            imgClassName="w-10 h-10 rounded-full object-cover"
          />
        ) : null}
      </div>
    );
}
