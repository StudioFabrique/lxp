const ParcoursInfos = () => {
  return (
    <div className="flex flex-col gap-y-4 p-4 rounded-lg bg-secondary/10">
      <h3 className="font-bold text-xl">Informations</h3>
      <form className="flex flex-col gap-y-4">
        <div className="flex flex-col gap-y-1">
          <label htmlFor="title">Titre</label>
          <input className="input input-sm w-full" name="title" type="text" />
        </div>
        <div className="flex flex-col gap-y-1">
          <label htmlFor="description">Description</label>
          <textarea className="input w-full" name="description" rows={5} />
        </div>
        <div className="flex flex-col gap-y-1">
          <label htmlFor="degree">Diplôme</label>
          <input className="input input-sm w-full" name="degree" type="text" />
        </div>
        <div className="flex flex-col gap-y-1">
          <label htmlFor="fileToUpload">Téléverser une image</label>
          <input
            type="file"
            className="file-input file-input-sm file-input-neutral w-full bg-secondary/10 rounded-lg"
          />
        </div>
      </form>
    </div>
  );
};

export default ParcoursInfos;
