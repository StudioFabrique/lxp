import Modal from "../../../../components/UI/modal/modal";
import useResource from "../../hooks/useResource";
import ResourceForm from "./ResourceForm";

export default function CreateResourceModal({ onClose }: { onClose: () => void }) {
  const resource = useResource({ onResourceSaved: onClose });

  return (
    <Modal
      title="Créer une ressource"
      leftLabel="Fermer"
      onLeftClick={() => {
        if (!resource.isSubmitting) onClose();
      }}
      rightLabel="Ajouter la ressource"
      onRightClick={resource.handleSubmitForm}
      isSubmitting={resource.isSubmitting}
      modalBoxStyle="max-w-2xl"
      actionsClassName="w-full justify-between"
      rightClassName="btn-primary text-primary-content"
    >
      <div className="mt-5">
        <ResourceForm
          mode="create"
          data={resource.data}
          onSubmit={resource.handleSubmitForm}
          isLoading={resource.isSubmitting}
          tags={resource.tags}
          setTags={resource.setTags}
          tagError={resource.tagError}
          onTagError={resource.setTagError}
          onSetFile={resource.setFile}
          showSubmitButton={false}
        />
      </div>
    </Modal>
  );
}
