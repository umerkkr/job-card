import { useQuery } from "@tanstack/react-query";
import { ENDPOINTS } from "../endpoints";
import { fetchJson } from "../api/http";

export type ActiveJobBatch = {
  id: number;
  jobWorkBenchJobId: number;
  batchNo: string;
  workOrder: string;
  workOrders: string[];
  process: string;
  product: string;
  description: string;
  customerName: string;
  saleOrderLine: string;
  fgProduct: string;
  packingLength: string | null;
  customerInspection: string;
  ppdDate: string;
  wipPlanQty: number;
  executedQty: number;
  allocatedQty: number;
  qty: number;
  balance: number;
  originalQty: number;
  plannedQty: number;
  remainingQty: number;
};

export type ActiveJob = {
  id: number;
  jobNumber: string;
  processName: string;
  productCode: string;
  productDescription: string;
  status: string;
  machineCode: string;
  stopReason: string | null;
  totalQty: number;
  planningDate: string;
  batches: ActiveJobBatch[];
};

export function useActiveJobs() {
  return useQuery({
    queryKey: ["active-jobs"],
    queryFn: () => fetchJson<ActiveJob[]>(ENDPOINTS.activeJobs),
    staleTime: 30_000,
  });
}
