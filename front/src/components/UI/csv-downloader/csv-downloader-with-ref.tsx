import { forwardRef } from "react";
import { unparse, UnparseConfig } from "papaparse";

export interface CsvDownloaderWithRefProps {
  data: any;
  filename?: string;
  className?: string;
  config?: UnparseConfig;
  onClick?: () => void;
}

const CsvDownloaderWithRef = forwardRef<
  HTMLButtonElement,
  CsvDownloaderWithRefProps
>(
  (
    {
      filename = `lxp_roles-${new Date().toLocaleString()}`,
      data,
      className,
      config,
      onClick,
    },
    ref,
  ) => {
    const handleClick = () => {
      const csv = unparse(data, config);
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      if (onClick) onClick();
    };

    return (
      <button onClick={handleClick} className={className} ref={ref}>
        exporter les rôles en .csv
      </button>
    );
  },
);

export default CsvDownloaderWithRef;
