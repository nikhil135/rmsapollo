"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { EntityKey, EntityRecord } from "@/lib/entities";
import { getEntityConfig } from "@/lib/entities";
import { useEntitiesStore } from "@/app/components/useEntitiesStore";

function emptyValues(fieldKeys: string[]) {
  const out: Record<string, string> = {};
  for (const k of fieldKeys) out[k] = "";
  return out;
}

export default function EntityDetailsClient({ entity }: { entity: string }) {
  const router = useRouter();
  const store = useEntitiesStore();

  const entityParam = String(entity ?? "");
  const cfg = useMemo(() => getEntityConfig(entityParam), [entityParam]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formValues, setFormValues] = useState<Record<string, string>>({});

  const fieldKeys = cfg?.fields.map((f) => f.key) ?? [];

  const editingRecord: EntityRecord | null = useMemo(() => {
    if (!editingId || !cfg) return null;
    if (editingId === "__new__") return { id: "__new__" };
    return store.list(cfg.key).find((r) => r.id === editingId) ?? null;
  }, [editingId, cfg, store]);

  if (!cfg) {
    return (
      <div className="entityPage">
        <div className="entityHeader">
          <div>
            <h1 className="entityTitle">Unknown entity</h1>
            <div className="entitySubTitle">
              This route doesn’t match a known entity: <code>{entityParam}</code>
            </div>
          </div>
          <div className="entityHeaderActions">
            <button className="entityButton" type="button" onClick={() => router.push("/")}>
              Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  const entityKey: EntityKey = cfg.key;
  const records = store.list(entityKey);

  function startAdd() {
    setEditingId("__new__");
    setFormValues(emptyValues(fieldKeys));
  }

  function startEdit(id: string) {
    const record = store.list(entityKey).find((r) => r.id === id);
    if (!record) return;
    const next: Record<string, string> = {};
    for (const k of fieldKeys) next[k] = record[k] ?? "";
    setEditingId(id);
    setFormValues(next);
  }

  function cancel() {
    setEditingId(null);
    setFormValues({});
  }

  function onChange(key: string, value: string) {
    setFormValues((prev) => ({ ...prev, [key]: value }));
  }

  function onSave() {
    if (!editingId) return;
    const payload = { ...formValues } as Omit<EntityRecord, "id">;

    if (editingId === "__new__") {
      store.add(entityKey, payload);
    } else {
      store.update(entityKey, editingId, payload);
    }
    cancel();
  }

  return (
    <div className="entityPage">
      <div className="entityHeader">
        <div>
          <h1 className="entityTitle">{cfg.label}</h1>
          <div className="entitySubTitle">Total: {records.length}</div>
        </div>

        <div className="entityHeaderActions">
          <button className="entityButton" type="button" onClick={() => router.push("/")}>
            Back
          </button>
          <button className="entityButtonPrimary" type="button" onClick={startAdd}>
            Add new
          </button>
        </div>
      </div>

      {editingId ? (
        <div className="entityFormCard">
          <div className="entityFormHeader">
            <div className="entityFormTitle">
              {editingId === "__new__" ? "Add new" : "Edit"} {cfg.label}
            </div>
            <div className="entityFormActions">
              <button className="entityButtonPrimary" type="button" onClick={onSave}>
                Save
              </button>
              <button className="entityButton" type="button" onClick={cancel}>
                Cancel
              </button>
            </div>
          </div>

          <div className="entityFormGrid">
            {cfg.fields.map((f) => (
              <label className="entityLabel" key={f.key}>
                {f.label}
                <input
                  className="entityInput"
                  value={formValues[f.key] ?? ""}
                  onChange={(e) => onChange(f.key, e.target.value)}
                  placeholder={f.placeholder}
                  inputMode={f.type === "number" ? "numeric" : undefined}
                />
              </label>
            ))}
          </div>

          {editingRecord && editingId !== "__new__" ? (
            <div className="entityHint">Editing record id: {editingRecord.id}</div>
          ) : null}
        </div>
      ) : null}

      <div className="entityTableWrap">
        <table className="entityTable">
          <thead>
            <tr>
              {cfg.fields.map((f) => (
                <th key={f.key}>{f.label}</th>
              ))}
              <th className="entityActionsCol">Actions</th>
            </tr>
          </thead>
          <tbody>
            {records.length ? (
              records.map((r) => (
                <tr key={r.id}>
                  {cfg.fields.map((f) => (
                    <td key={f.key}>{r[f.key] ?? ""}</td>
                  ))}
                  <td className="entityActions">
                    <button className="entityLinkButton" type="button" onClick={() => startEdit(r.id)}>
                      Edit
                    </button>
                    <button
                      className="entityLinkButtonDanger"
                      type="button"
                      onClick={() => store.remove(entityKey, r.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={cfg.fields.length + 1} className="entityEmpty">
                  No data yet. Click “Add new”.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
