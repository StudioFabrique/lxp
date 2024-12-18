import Media from "../../utils/interfaces/media";

type Props = {
  videos: Media[];
};

function ListVideos({ videos }: Props) {
  return (
    <div className="flex-1 flex flex-col justify-around items-center gap-y-4">
      {videos && videos.length > 0 ? (
        <ul>
          {(videos as Media[]).map((item) => (
            <li key={item.id}>
              <p>toto</p>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

export default ListVideos;
