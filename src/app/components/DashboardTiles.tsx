"use client";

import { useRouter } from "next/navigation";
import { ENTITY_CONFIGS, type EntityKey } from "@/lib/entities";
import { useEntitiesStore } from "./useEntitiesStore";

const ENTITY_ORDER: EntityKey[] = [
  "student",
  "faculty",
  "journal",
  "books",
  "chapter",
  "conference_paper",
  "grants",
  "ipr",
];

export default function DashboardTiles() {
  const router = useRouter();
  const store = useEntitiesStore();

  return (
    <section className="tiles">
      {ENTITY_ORDER.map((key) => {
        const cfg = ENTITY_CONFIGS[key];
        const count = store.state[key].length;
        return (
          <button
            className="tile tileClickable"
            key={key}
            type="button"
            onClick={() => router.push(`/entities/${key}`)}
          >
            <div className="tileHeader">
              <h3 className="tileTitle">{cfg.label}</h3>
              <span className="tileMeta">View</span>
            </div>
            <div className="tileValue">{count}</div>
          </button>
        );
      })}
    </section>
  );
}
