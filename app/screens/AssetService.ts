// app/screens/AssetService.ts
export type CycleLabel = "Odd" | "Even";

export interface Asset {
  id: number;
  fam: string | null;
  tag: string | null;
  description: string | null;
  maintType?: number | null;
  cycleId?: number | null;
  lastUpdated?: string | null;
}

export interface LatestInfo {
  inventoryDate: string;   // ISO date from API
  cycleLabel: CycleLabel;  // "Odd" | "Even"
  cycleId?: number;        // optional
}

const RAW = process.env.EXPO_PUBLIC_API_BASE ?? "http://localhost:3000";
export const API = RAW.includes("/api/v1") ? RAW : `${RAW}/api/v1`;

async function getJson<T>(url: string): Promise<T> {
  const r = await fetch(url);
  if (!r.ok) {
    const text = await r.text().catch(() => "");
    throw new Error(`HTTP ${r.status} for ${url} :: ${text}`);
  }
  return r.json() as Promise<T>;
}

export async function fetchLatestInventory(): Promise<LatestInfo> {
  const data = await getJson<{ inventoryDate: string; cycleId?: number; cycleLabel?: string }>(
    `${API}/inventory/latest`
  );

  const cycleLabel: CycleLabel =
    (data.cycleLabel?.toLowerCase() === "odd" ? "Odd" :
     data.cycleLabel?.toLowerCase() === "even" ? "Even" :
     (data.cycleId ?? 0) % 2 === 0 ? "Even" : "Odd");

  return {
    inventoryDate: data.inventoryDate,
    cycleLabel,
    cycleId: data.cycleId,
  };
}

export interface PagedAssets {
  total: number;
  page: number;
  pageSize: number;
  data: Asset[];
}

export async function fetchAssets(q: string, page = 1, pageSize = 50): Promise<PagedAssets> {
  const params = new URLSearchParams({ q, page: String(page), pageSize: String(pageSize) });
  return getJson<PagedAssets>(`${API}/assets?${params.toString()}`);
}