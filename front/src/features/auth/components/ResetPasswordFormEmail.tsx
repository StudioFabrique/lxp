type Props = {
  email: string;
  onChange: (value: string) => void;
  error?: string;
  placeholder?: string;
};

const ResetPasswordFormEmail = ({
  email,
  onChange,
  error,
  placeholder = "jean.dupont@exemple.fr",
}: Props) => {
  return (
    <div className="flex flex-col gap-y-2 w-full">
      <input
        className={`w-full input input-bordered focus:outline-none ${
          error ? "input-error" : ""
        }`}
        type="email"
        id="email"
        name="email"
        value={email}
        placeholder={placeholder}
        onChange={(e) => onChange(e.currentTarget.value)}
      />
      {error && <p className="text-error text-xs">{error}</p>}
    </div>
  );
};

export default ResetPasswordFormEmail;
