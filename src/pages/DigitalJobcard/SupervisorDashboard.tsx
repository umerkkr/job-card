import { useState, useMemo, useEffect, useRef } from "react";
import jobsData from "../../JsonForTest/jobs.json";

const PROCESS_OPTIONS = [
  "Extrusion",
  "Bunching",
  "Laying Up",
  "Armouring",
  "Bedding",
  "Insulation",
  "Sheathing",
  "Wire Drawing",
];



const MACHINE_MAP: Record<string, string[]> = {
  Extrusion: ["150-1-Extruder", "150-2-Extruder", "CCV-LINE"],
  Armouring: ["Drum-Twister", "M1", "3200-D-T"],
  Bunching: ["1000-Buncher", "800-Buncher"],
  "Laying Up": ["37-BOBBIN", "Bema-2"],
  Sheathing: ["150-Extruder", "CCV-LINE"],
  Bedding: ["150-2-Extruder"],
  Insulation: ["Sioplas", "CCV-LINE"],
  "Wire Drawing": ["F-13", "MM-30"],
};

let jobCounter = 1;

const generateJobName = (process: string) => {
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const now = new Date();

  const month = monthNames[now.getMonth()];
  const year = String(now.getFullYear()).slice(-2);

  const prefixMap: Record<string, string> = {
    Armouring: "ARM",
    Extrusion: "EXT",
    Bunching: "BUN",
    "Laying Up": "LUP",
    Bedding: "BED",
    Insulation: "INS",
    Sheathing: "SHE",
    "Wire Drawing": "WD",
  };

  const prefix = prefixMap[process] || "JOB";
  const number = String(jobCounter++).padStart(2, "0");

  return `${prefix}-${month}-${year}-${number}`;
};

type JobData = {
  jobName: string;
  jobId: string;
  machine: string;
  process: string;
  products: any[];
};

type Props = {
  onCreateJob: (data: JobData) => void;
};


export default function SupervisorDashboard({  }: Props){
  const [activeTab, setActiveTab] = useState<"create" | "history">("create");
  const [selectedProduct, setSelectedProduct] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedProcess, setSelectedProcess] = useState("");
  const [selectedMachine, setSelectedMachine] = useState("");
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [productSearch, setProductSearch] = useState("");
  const [jobs, setJobs] = useState<any[]>([]);

  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const productOptions = useMemo(() => {
    if (!selectedProcess) return [];

    return jobsData
      .filter((i) => i.process === selectedProcess)
      .filter((i) =>
        i.product.toLowerCase().includes(productSearch.toLowerCase())
      )
      .filter(
        (item, index, self) =>
          index === self.findIndex((x) => x.product === item.product)
      )
      .slice(0, 10);
  }, [selectedProcess, productSearch]);

  const filteredData = useMemo(() => {
    if (!selectedProcess) return [];

    return jobsData
      .filter((i) => i.process === selectedProcess)
      .filter((i) => {
        if (selectedProduct) {
          return i.product === selectedProduct;
        }
        return i.product.toLowerCase().includes(productSearch.toLowerCase());
      });
  }, [selectedProcess, productSearch, selectedProduct]);

  const toggleRow = (id: number) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id]
    );
  };

  const handleCreateJob = () => {
  const selected = filteredData.filter((i) =>
    selectedRows.includes(i.id)
  );

  if (!selected.length) return;

  const totalQty = selected.reduce(
    (sum, i) => sum + Number(i.qty || 0),
    0
  );

  const job = {
  jobId: generateJobName(selectedProcess),

  items: selected.map((i) => ({
    product: i.product,
    batchNo: i.batchNo,
    workOrder: i.workOrder,
    qty: i.qty,
  })),

  totalQty: totalQty,
  status: "Inactive",
};

  setJobs((prev) => [job, ...prev]);
  setSelectedRows([]);
};

  return (
    <div className="space-y-6">
      <div className="flex gap-2">
        <button
          onClick={() => setActiveTab("create")}
          className={`px-4 py-2 rounded-lg ${
            activeTab === "create" ? "bg-green-600 text-white" : "bg-gray-200"
          }`}
        >
          Create Job
        </button>

        <button
          onClick={() => setActiveTab("history")}
          className={`px-4 py-2 rounded-lg ${
            activeTab === "history" ? "bg-green-600 text-white" : "bg-gray-200"
          }`}
        >
          View Job History
        </button>
      </div>

      {activeTab === "create" && (
        <>
          <div className="bg-white p-5 rounded-xl shadow grid md:grid-cols-3 gap-4">
            <select
              value={selectedProcess}
              onChange={(e) => {
                setSelectedProcess(e.target.value);
                setSelectedRows([]);
                setSelectedMachine("");
                setSelectedProduct("");
                setProductSearch("");
                setShowDropdown(false);
              }}
              className="p-3 border rounded-lg"
            >
              <option value="">Select Process</option>
              {PROCESS_OPTIONS.map((p) => (
                <option key={p}>{p}</option>
              ))}
            </select>

            <div className="relative" ref={dropdownRef}>
              <input
                placeholder="Search & Select Product..."
                value={productSearch}
                onChange={(e) => {
                  setProductSearch(e.target.value);
                  setSelectedProduct("");
                  setShowDropdown(true);
                  setSelectedRows([]);
                }}
                onFocus={() => {
                  if (selectedProcess) setShowDropdown(true);
                }}
                disabled={!selectedProcess}
                className="p-3 border rounded-lg w-full disabled:bg-gray-100"
              />

              {showDropdown && selectedProcess && productOptions.length > 0 && (
                <div className="absolute z-10 bg-white border rounded-lg mt-1 w-full max-h-40 overflow-y-auto shadow">
                  {productOptions.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => {
                        setSelectedProduct(item.product);
                        setProductSearch(item.product);
                        setShowDropdown(false);
                        setSelectedRows([]);
                      }}
                      className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                    >
                      <div className="font-medium text-gray-800">{item.product}</div>
                      <div className="text-xs text-gray-500">{item.batchNo}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <select
              value={selectedMachine}
              onChange={(e) => setSelectedMachine(e.target.value)}
              disabled={!selectedProcess}
              className="p-3 border rounded-lg disabled:bg-gray-100"
            >
              <option value="">Select Machine</option>
              {(MACHINE_MAP[selectedProcess] || []).map((m) => (
                <option key={m}>{m}</option>
              ))}
            </select>
          </div>

          {selectedProcess && (
            <div className="bg-white rounded-xl shadow overflow-hidden">
              <div className="flex justify-between items-center px-4 py-3 bg-gray-50 border-b">
                <h4 className="text-sm font-semibold text-gray-600">
                  {selectedProcess} Work Orders
                </h4>

                <button
                  disabled={selectedRows.length === 0}
                  onClick={handleCreateJob}
                  className={`px-5 py-2 rounded-lg text-sm font-semibold text-white ${
                    selectedRows.length > 0
                      ? "bg-green-600 hover:bg-green-700"
                      : "bg-gray-400 cursor-not-allowed"
                  }`}
                >
                  Create Job
                </button>
              </div>

              <div className="max-h-[400px] overflow-y-auto">
                <table className="w-full text-sm border-collapse">
                  <thead className="bg-gray-100 text-gray-500 text-xs uppercase sticky top-0">
                    <tr>
                      <th className="w-12 px-4 py-3 text-center">Select</th>
                      <th className="px-4 py-3 text-left">Process</th>
                      <th className="px-4 py-3 text-left">Product</th>
                      <th className="px-4 py-3 text-left">Batch No</th>
                      <th className="px-4 py-3 text-left">Work Order</th>
                      <th className="px-4 py-3 text-left">Machine</th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredData.map((item) => (
                      <tr
                        key={item.id}
                        onClick={() => toggleRow(item.id)}
                        className={`cursor-pointer border-t ${
                          selectedRows.includes(item.id)
                            ? "bg-green-50"
                            : "hover:bg-gray-50"
                        }`}
                      >
                        <td className="px-4 py-3 text-center">
                          <input
                            type="checkbox"
                            checked={selectedRows.includes(item.id)}
                            readOnly
                          />
                        </td>
                        <td className="px-4 py-3">{item.process}</td>
                        <td className="px-4 py-3 font-semibold">{item.product}</td>
                        <td className="px-4 py-3">{item.batchNo}</td>
                        <td className="px-4 py-3">{item.workOrder}</td>
                        <td className="px-4 py-3 text-green-600">
                          {selectedMachine || "-"}
                        </td>
                      </tr>
                    ))}

                    {filteredData.length === 0 && (
                      <tr>
                        <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                          No records found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {jobs.length > 0 && (
            <div className="bg-white rounded-xl shadow mt-6 overflow-hidden">
              <div className="px-4 py-3 bg-gray-100 border-b">
                <h4 className="text-sm font-bold uppercase text-gray-600">
                  Created Jobs
                </h4>
              </div>

              <table className="w-full text-sm">
  <thead className="bg-gray-50 text-xs uppercase text-gray-500">
    <tr>
      <th className="px-4 py-3 text-left">Job ID</th>
      <th className="px-4 py-3 text-left">Product</th>
      <th className="px-4 py-3 text-left">Batch No</th>
      <th className="px-4 py-3 text-left">Work Order</th>
      <th className="px-4 py-3 text-left">Qty</th>
      <th className="px-4 py-3 text-left">Status</th>
    </tr>
  </thead>

  <tbody>
    {jobs.map((job, index) => (
      <tr key={index} className="border-t align-top">
        
        {/* Job ID */}
        <td className="px-4 py-3 font-semibold text-blue-600">
          {job.jobId}
        </td>

        {/* Product */}
        <td className="px-4 py-3 space-y-1">
          {job.items.map((item: any, i: number) => (
            <div key={i}>{item.product}</div>
          ))}
        </td>

        {/* Batch No */}
        <td className="px-4 py-3 space-y-1">
          {job.items.map((item: any, i: number) => (
            <div key={i}>{item.batchNo}</div>
          ))}
        </td>

        {/* Work Order */}
        <td className="px-4 py-3 space-y-1">
          {job.items.map((item: any, i: number) => (
            <div key={i}>{item.workOrder}</div>
          ))}
        </td>

        {/* ✅ Qty (FIXED) */}
        <td className="px-4 py-3 space-y-1 text-center font-semibold">
          {job.items.map((item: any, i: number) => (
            <div key={i}>{item.qty}</div>
          ))}

          {/* Total */}
          <div className="border-t mt-1 pt-1 font-bold text-green-700">
            Total: {job.totalQty}
          </div>
        </td>

        {/* Status */}
        <td className="px-4 py-3">
          <span className="px-2 py-1 text-xs rounded-full bg-gray-200 text-gray-700">
            {job.status}
          </span>
        </td>

      </tr>
    ))}
  </tbody>
</table>
            </div>
          )}
        </>
      )}
      {activeTab === "history" && (
        <div className="bg-white rounded-xl shadow p-4">
          <table className="w-full text-sm">
            <thead className="bg-gray-100 text-xs uppercase">
              <tr>
                <th className="px-4 py-3 text-left">Job ID</th>
                <th className="px-4 py-3 text-left">Product</th>
                <th className="px-4 py-3 text-left">Batch No</th>
                <th className="px-4 py-3 text-left">Work Order</th>
                <th className="px-4 py-3 text-left">Qty</th>
                <th className="px-4 py-3 text-left">Status</th>
              </tr>
            </thead>

            <tbody>
              {jobs.map((job, index) => (
                <tr key={index} className="border-t">
                  <td className="px-4 py-3 font-semibold text-blue-600">
                    {job.jobId}
                  </td>
                  <td className="px-4 py-3">{job.products?.join(", ") || "-"}</td>
                  <td className="px-4 py-3">{job.batchNos?.join(", ") || "-"}</td>
                  <td className="px-4 py-3">{job.workOrders?.join(", ") || "-"}</td>
                  <td className="px-4 py-3 font-bold">{job.qty}</td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-1 text-xs rounded-full bg-gray-200 text-gray-700">
                      {job.status}
                    </span>
                  </td>
                </tr>
              ))}

              {jobs.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                    No jobs created yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}