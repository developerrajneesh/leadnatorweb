"use client";

import { FiLayers } from "react-icons/fi";
import type { PlatformStat } from "@/lib/analytics/types";
import { truncateLabel } from "@/lib/analytics/platform-chart";

type Props = {
  rows: PlatformStat[];
  colorFor: (name: string) => string;
};

export default function PlatformSourcesTable({ rows, colorFor }: Props) {
  if (!rows.length) return null;

  return (
    <div className="sa-card sa-card-table" id="all-sources">
      <div className="sa-card-head">
        <div className="sa-card-head-icon sa-card-head-icon-violet">
          <FiLayers aria-hidden />
        </div>
        <div>
          <h3>All visitor sources ({rows.length})</h3>
          <p>Every place your visitors came from — scroll to see the full list</p>
        </div>
      </div>
      <div className="sa-table-wrap sa-table-wrap-scroll">
        <table className="sa-table sa-table-sources">
          <thead>
            <tr>
              <th>#</th>
              <th>Source</th>
              <th>Views</th>
              <th>Visitors</th>
              <th>Share</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => {
              const color = colorFor(row.platform);
              return (
                <tr key={row.platform}>
                  <td className="sa-rank">{i + 1}</td>
                  <td>
                    <div className="sa-source-cell">
                      <span className="sa-source-dot" style={{ background: color }} />
                      <span title={row.platform}>{truncateLabel(row.platform, 36)}</span>
                    </div>
                  </td>
                  <td><span className="sa-num">{row.views.toLocaleString()}</span></td>
                  <td><span className="sa-num">{row.uniqueVisitors.toLocaleString()}</span></td>
                  <td><span className="sa-time">{row.pct}%</span></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
