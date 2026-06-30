import bgPhoto from "../../assets/images/login/photo.jpeg";

const LoginRightColumn = () => {
  // Constantes sorties de la boucle pour faciliter les réglages
  const gridSize = 10;
  const squareSize = 300;
  const gap = 10;
  const radius = 15;

  const generateGridMask = () => {
    const rects = [];
    for (let i = 0; i < gridSize; i++) {
      for (let j = 0; j < gridSize; j++) {
        rects.push(
          <rect
            key={`${i}-${j}`}
            x={j * (squareSize + gap)}
            y={i * (squareSize + gap - 50)}
            width={squareSize}
            height={squareSize - 50}
            rx={radius}
          />,
        );
      }
    }
    return rects;
  };

  return (
    <div className="hidden lg:flex flex-col justify-center items-end relative w-full h-full">
      {/* Définition du masque de découpe (invisible en soi) */}
      <svg className="absolute">
        <defs>
          <clipPath
            id="image-grid-mask"
            className="-translate-x-40 -translate-y-20"
          >
            {generateGridMask()}
          </clipPath>
        </defs>
      </svg>

      {/* L'image à laquelle on applique le masque */}
      <img
        src={bgPhoto}
        alt="Décoration"
        className="h-full max-h-[85vh] min-h-150 object-cover rounded-l-2xl"
        style={{ clipPath: "url(#image-grid-mask)" }}
      />
    </div>
  );
};

export default LoginRightColumn;
