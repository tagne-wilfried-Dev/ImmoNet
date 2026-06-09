import React from 'react';
import { Inbox } from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface Column<T> {
  key: keyof T | string;
  header: string;
  /** Largeur optionnelle Tailwind ex: 'w-32' */
  width?: string;
  render: (row: T) => React.ReactNode;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  isLoading?: boolean;
  /** Nombre de lignes skeleton affichées pendant le chargement */
  skeletonRows?: number;
  emptyMessage?: string;
  /** Clé unique par ligne — doit être un champ de T qui retourne string | number */
  rowKey: (row: T) => string | number;
  onRowClick?: (row: T) => void;
}

// ─── Skeleton d'une ligne ─────────────────────────────────────────────────────

const SkeletonRow: React.FC<{ cols: number }> = ({ cols }) => (
  <tr>
    {Array.from({ length: cols }).map((_, i) => (
      <td key={i} className="px-4 py-3">
        <div className="h-4 bg-slate-100 rounded-lg animate-pulse" style={{ width: `${60 + (i % 3) * 15}%` }} />
      </td>
    ))}
  </tr>
);

// ─── Composant ────────────────────────────────────────────────────────────────

function DataTable<T>({
  columns,
  data,
  isLoading = false,
  skeletonRows = 5,
  emptyMessage = 'Aucune donnée disponible',
  rowKey,
  onRowClick,
}: DataTableProps<T>) {
  return (
    <div className="w-full overflow-x-auto rounded-2xl border border-slate-100">
      <table className="w-full text-sm border-collapse">
        {/* Header */}
        <thead>
          <tr className="bg-slate-50 border-b border-slate-100">
            {columns.map((col) => (
              <th
                key={String(col.key)}
                className={`px-4 py-3 text-left text-[11px] font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap ${col.width ?? ''}`}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>

        <tbody className="bg-white divide-y divide-slate-50">
          {/* Loading state */}
          {isLoading &&
            Array.from({ length: skeletonRows }).map((_, i) => (
              <SkeletonRow key={i} cols={columns.length} />
            ))}

          {/* Data rows */}
          {!isLoading &&
            data.map((row) => (
              <tr
                key={rowKey(row)}
                onClick={() => onRowClick?.(row)}
                className={`transition-colors duration-100 ${
                  onRowClick
                    ? 'cursor-pointer hover:bg-cyan-50/50'
                    : 'hover:bg-slate-50/60'
                }`}
              >
                {columns.map((col) => (
                  <td
                    key={String(col.key)}
                    className="px-4 py-3 text-slate-700 align-middle"
                  >
                    {col.render(row)}
                  </td>
                ))}
              </tr>
            ))}

          {/* Empty state */}
          {!isLoading && data.length === 0 && (
            <tr>
              <td colSpan={columns.length} className="py-12 text-center">
                <div className="flex flex-col items-center gap-2 text-slate-400">
                  <Inbox size={28} aria-hidden="true" />
                  <p className="text-sm">{emptyMessage}</p>
                </div>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default DataTable;
