import Wrapper from "../../../../../src.legacy/components/UI/wrapper/wrapper.component";

type Props = {
  description: string;
  onDescription: (v: string) => void;
  disabled?: boolean;
};

const UserFormPresentation = ({ description, onDescription, disabled }: Props) => (
  <Wrapper>
    <h2 className="font-bold text-xl">Présentation</h2>
    <label>Qui suis-je ?</label>
    <textarea
      className="textarea h-26 w-full p-2"
      value={description}
      onChange={(e) => onDescription(e.target.value)}
      autoComplete="off"
      disabled={disabled}
    />
  </Wrapper>
);

export default UserFormPresentation;
