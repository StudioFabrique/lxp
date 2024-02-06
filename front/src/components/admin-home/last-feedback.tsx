import AvatarCard from "../UI/avatar-card";

const feedbacks = [
  {
    avatarSrc:
      "https://daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg",
    username: "Tata",
    message: "Tata n'a pas réussi le quizz sur le javascript.",
  },
  {
    avatarSrc:
      "data:image/jpeg;base64,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",
    username: "Martin",
    message: "Martin a commencé le cours sur le CSS.",
  },
  {
    avatarSrc:
      "data:image/jpeg;base64,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",
    username: "David",
    message: "David a terminé le module C++.",
  },
];

export default function LastFeedback() {
  return (
    <div className="flex flex-col gap-y-2">
      <h2 className="font-bold">Derniers feedbacks des apprenants</h2>
      <ul className="flex flex-col gap-y-2">
        {feedbacks.map((item) => (
          <li key={item.username}>
            <AvatarCard
              avatarSrc={item.avatarSrc}
              username={item.username}
              message={item.message}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
