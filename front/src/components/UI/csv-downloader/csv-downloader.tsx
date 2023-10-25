import { FC } from "react";
import { useCSVDownloader } from "react-papaparse";
import { UnparseConfig } from "papaparse";

export interface CsvDownloaderProps {
  data: any;
  filename?: string;
  className?: string;
  config?: UnparseConfig;
}

const CSVDownloader: FC<CsvDownloaderProps> = ({
  filename = `lxp_roles-${new Date().toLocaleString()}`,
  data,
  className,
  config,
}) => {
  const { CSVDownloader } = useCSVDownloader();

  return (
    <CSVDownloader
      data={data}
      filename={filename}
      type="link"
      bom={true}
      className={className}
      config={config}
    >
      exporter les rôles en .csv
    </CSVDownloader>
  );
};

export default CSVDownloader;
