"use client";

import { useMemo, useSyncExternalStore } from "react";
import type { EntitiesState, EntityKey, EntityRecord } from "@/lib/entities";
import { INITIAL_ENTITIES_STATE } from "@/lib/entities";

const STORAGE_KEY = "apollo_entities_v1";

type Listener = () => void;

let state: EntitiesState = INITIAL_ENTITIES_STATE;
const listeners = new Set<Listener>();
let hasHydrated = false;

function emit() {
  for (const l of listeners) l();
}

function safeParse(raw: string): unknown {
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function hydrateFromStorageOnce() {
  if (hasHydrated) return;
  hasHydrated = true;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    const parsed = safeParse(raw) as Partial<EntitiesState> | null;
    if (!parsed) return;
    state = { ...state, ...parsed } as EntitiesState;
  } catch {
    // ignore
  }
}

function persist() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // ignore
  }
}

function subscribe(listener: Listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot() {
  return state;
}

function randomId(prefix: string) {
  const anyCrypto = globalThis.crypto as Crypto | undefined;
  if (anyCrypto?.randomUUID) return `${prefix}_${anyCrypto.randomUUID()}`;
  return `${prefix}_${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

export function useEntitiesStore() {
  const snapshot = useSyncExternalStore(
    subscribe,
    () => {
      hydrateFromStorageOnce();
      return getSnapshot();
    },
    () => INITIAL_ENTITIES_STATE,
  );

  return useMemo(() => {
    return {
      state: snapshot,
      list(entity: EntityKey) {
        return snapshot[entity];
      },
      add(entity: EntityKey, values: Omit<EntityRecord, "id">) {
        hydrateFromStorageOnce();
        const record: EntityRecord = { id: randomId(entity), ...values };
        state = { ...state, [entity]: [record, ...state[entity]] };
        persist();
        emit();
        return record;
      },
      update(entity: EntityKey, id: string, values: Omit<EntityRecord, "id">) {
        hydrateFromStorageOnce();
        state = {
          ...state,
          [entity]: state[entity].map((r) => (r.id === id ? { id, ...values } : r)),
        };
        persist();
        emit();
      },
      remove(entity: EntityKey, id: string) {
        hydrateFromStorageOnce();
        state = { ...state, [entity]: state[entity].filter((r) => r.id !== id) };
        persist();
        emit();
      },
      reset() {
        state = INITIAL_ENTITIES_STATE;
        try {
          localStorage.removeItem(STORAGE_KEY);
        } catch {
          // ignore
        }
        emit();
      },
    };
  }, [snapshot]);
}

