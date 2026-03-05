import bgPhoto from "../../assets/images/login/photo.jpeg";

const LoginRightColumn = () => {
  // Constantes sorties de la boucle pour faciliter les réglages
  const gridSize = 10;
  const squareSize = 200;
  const gap = 16;

  const generateGridMask = () => {
    const rects = [];
    for (let i = 0; i < gridSize; i++) {
      for (let j = 0; j < gridSize; j++) {
        rects.push(
          <rect
            key={`${i}-${j}`}
            x={j * (squareSize + gap)}
            y={i * (squareSize + gap)}
            width={squareSize}
            height={squareSize}
            rx="24"
          />,
        );
      }
    }
    return rects;
  };

  return (
    <div className="hidden xl:flex flex-col justify-center items-end relative col-span-2 w-full h-full bg-white">
      {/* Définition du masque de découpe (invisible en soi) */}
      <svg className="absolute">
        <defs>
          <clipPath id="image-grid-mask">{generateGridMask()}</clipPath>
        </defs>
      </svg>

      {/* L'image à laquelle on applique le masque */}
      <img
        src={bgPhoto}
        alt="Décoration"
        className="w-auto h-full max-h-[85vh] min-h-[600px] object-cover"
        style={{ clipPath: "url(#image-grid-mask)" }}
      />
    </div>
  );
};

export default LoginRightColumn;
