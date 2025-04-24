type Props = {
  message?: string;
};

function ElementNotFound({ message = "Aucun objet trouvé" }: Props) {
  return (
    <div className="w-full flex items-center justify-center border-dashed border border-secondary/100 rounded-lg p-4">
      <p>{message}</p>
    </div>
  );
}

export default ElementNotFound;
