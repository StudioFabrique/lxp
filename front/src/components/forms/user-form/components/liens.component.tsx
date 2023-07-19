import {
  ChangeEvent,
  ChangeEventHandler,
  EventHandler,
  FC,
  MouseEvent,
  MouseEventHandler,
  useState,
} from "react";
import Wrapper from "../../../UI/wrapper/wrapper.component";

const Liens: FC<{ onSubmit: (links: Array<String>) => void }> = ({
  onSubmit,
}) => {
  const [links, setLinks] = useState<Array<String>>([]);
  const [currentLink, setCurrentLink] = useState<String>("");

  const handleInputChange: ChangeEventHandler<HTMLInputElement> = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    setCurrentLink(event.currentTarget.value);
  };

  const handleAddLink: MouseEventHandler<HTMLButtonElement> = (
    event: MouseEvent<HTMLButtonElement>
  ) => {
    if (currentLink.length > 0) {
      setLinks((links) => [...links, currentLink]);
    }
  };

  return (
    <Wrapper>
      <h2>Liens</h2>
      <span className="flex justify-between gap-x-5">
        <input
          onChange={handleInputChange}
          type="text"
          className="input input-sm w-full rounded-md"
        />
        <button onClick={handleAddLink} type="button" className="btn btn-sm">
          +
        </button>
      </span>
      <ul className="carousel carousel-vertical h-56">
        {links.map((link) => (
          <li>{link}</li>
        ))}
      </ul>
    </Wrapper>
  );
};

export default Liens;
