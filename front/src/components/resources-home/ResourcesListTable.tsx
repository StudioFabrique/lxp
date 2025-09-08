import { ResourceListItem } from "../../views/resources/hooks/useResources";

type Props = {
  resourcesList: ResourceListItem[];
};

export default function ResourcesListTable({ resourcesList }: Props) {
  return (
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Name</th>
          <th>Description</th>
        </tr>
      </thead>
      <tbody>
        {resourcesList.map((resource) => (
          <tr key={resource.id}>
            <td>{resource.id}</td>
            <td>{resource.title}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
