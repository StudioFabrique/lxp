import bgPhoto from "../../assets/images/login/photo.jpeg";

const LoginRightColumn = () => {
  const generateSquaresTransparency = (size: number) => {
    const squares = [];
    const squareSize = 100; // Taille de chaque carré
    const gap = 20; // Espace entre les carrés

    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size; j++) {
        squares.push(
          <div
            key={`${i}-${j}`}
            className="absolute bg-white opacity-90 rounded-lg pointer-events-none"
            style={{
              width: `${squareSize}px`,
              height: `${squareSize}px`,
              top: `${i * (squareSize + gap)}px`,
              left: `${j * (squareSize + gap)}px`,
            }}
          />,
        );
      }
    }

    return squares;
  };

  return (
    <div className="hidden xl:flex flex-col justify-center items-end relative col-span-2 w-full h-full">
      <img
        src={bgPhoto}
        alt="Décoration"
        className="w-auto h-full max-h-[85vh] min-h-[600px] object-contain rounded-l-2xl"
      />
      {generateSquaresTransparency(10)}
    </div>
  );
};

export default LoginRightColumn;
