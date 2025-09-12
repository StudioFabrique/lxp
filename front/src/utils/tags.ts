import Tag from "./interfaces/tag";

const tags: string[] = [
  "HTML",
  "CSS",
  "JavaScript",
  "TypeScript",
  "React",
  "Angular",
  "Vue.js",
  "Node.js",
  "Express",
  "Django",
  "Ruby on Rails",
  "PHP",
  "Laravel",
  "Symfony",
  "ASP.NET",
  "Java",
  "Spring",
  "C#",
  "Python",
  "Flask",
  "FastAPI",
  "GraphQL",
  "REST API",
  "MongoDB",
  "MySQL",
  "PostgreSQL",
  "Firebase",
  "AWS",
  "Docker",
  "Kubernetes",
];

const colors = [
  "bg-red-500/50",
  "bg-orange-500/50",
  "bg-amber-500/50",
  "bg-yellow-500/50",
  "bg-lime-500/50",
  "bg-green-500/50",
  "bg-emerald-500/50",
  "bg-teal-500/50",
  "bg-cyan-500/50",
  "bg-sky-500/50",
  "bg-blue-500/50",
  "bg-indigo-500/50",
  "bg-violet-500/50",
  "bg-purple-500/50",
  "bg-fuchsia-500/50",
  "bg-pink-500/50",
  "bg-rose-500/50",
];

function getRandomNumber(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

let tagsColors = Array<string>();

function setTagsColors() {
  let leftColors = colors;
  for (let i = 0; i < tags.length; i++) {
    if (leftColors.length === 0) {
      leftColors = colors;
    }
    tagsColors.push(leftColors[getRandomNumber(0, leftColors.length - 1)]);
    leftColors = leftColors.filter((col) => col !== tagsColors[i]);
  }
}

export default function createTag() {
  const tab = Array<Tag>();
  setTagsColors();
  let index = 0;
  tags.forEach((tag: any) => {
    tab.push({ id: index, name: tag, color: `${tagsColors[index]}` });
    index++;
  });

  return tab;
}
