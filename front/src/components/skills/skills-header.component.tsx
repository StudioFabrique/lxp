import ImportBadges from "./import-badges.component";
import ImportButton from "./import-button.component";

const SkillsHeader = () => {
  return (
    <div className="w-full flex justify-between items-center">
      <h3 className="text-xl font-bold">Compétences</h3>
      <div className="flex items-center gap-x-8">
        <ImportButton label="Importer des compétences" />
        <ImportBadges label="Importer des badges" outline={true} />
        <ImportButton label="Sauvergarder" outline={false} />
      </div>
    </div>
  );
};

export default SkillsHeader;
