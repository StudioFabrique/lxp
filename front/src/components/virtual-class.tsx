interface VirtualClassProps {
  virtualClass: any;
}

const VirtualClass = (props: VirtualClassProps) => {
  const { virtualClass } = props;

  return (
    <div className="w- full flex items-center gap-x-4">
      <label className="font-bold">Classe Virtuelle</label>
      <input
        className="flex-1 input input-sm focus:outline-none"
        id="virtual"
        name="virtual"
        defaultValue={virtualClass.value}
        onChange={virtualClass.valueChangeHandler}
        onBlur={virtualClass.valueBlurHandler}
        placeholder="Lien vers la classe virtuelle"
      />
    </div>
  );
};

export default VirtualClass;
