import User from "../../../utils/interfaces/user";
import chatbot from "../../../assets/images/chatbot.png";

type Props = {
  message: {
    origin: "user" | "bot";
    message: string;
  };
  user: User | null;
};

export default function AvatarChatbot({ message, user }: Props) {
  if (message.origin === "bot")
    return (
      <div className="w-10 rounded-full">
        <img alt="User avatar" src={chatbot} />
      </div>
    );
  else
    return (
      <div className="w-10 rounded-full">
        {user ? (
          user.avatar ? (
            <img
              alt="User avatar"
              src={`data:image/jpeg;base64,${user.avatar}`}
            />
          ) : (
            <p className="text-xs p-3.5 bg-accent text-base-200">
              {(user!.firstname[0] + user!.lastname[0]).trim().toUpperCase()}
            </p>
          )
        ) : null}
      </div>
    );
}
