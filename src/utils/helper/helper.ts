export const tableHeaders = [
  {
    label: "Date & Shift",
    rowSpan: 2,
  },
  {
    label: "Crew T. No",
    rowSpan: 2,
  },
  {
    label: "Input Drum",
    rowSpan: 2,
  },
  {
    label: "Output Drum",
    rowSpan: 2,
  },
  {
    label: "Color",
    rowSpan: 2,
  },
  {
    label: "Meter Reading",
    colSpan: 2,
    children: ["Start", "Finish"],
  },
  {
    label: "Total Output",
    rowSpan: 2,
  },
  {
    label: "Batch",
    rowSpan: 2,
  },
  {
    label: "Setting Up",
    colSpan: 3,
    children: ["Start", "Finish", "Total"],
  },
  {
    label: "Running Phase",
    colSpan: 3,
    children: ["Start", "Finish", "Total"],
  },
  {
    label: "Lost Time",
    colSpan: 2,
    children: ["Reason", "Hours"],
  },
  {
    label: "Signature",
    colSpan: 2,
    children: ["Op", "Sup"],
  },
];

export const getTimeDifference = (start: string, finish: string) => {
  if (!start || !finish) return "";

  const parseTime = (timeStr: string) => {
    const [time, modifier] = timeStr.split(" ");
    let [hours, minutes, seconds] = time.split(":").map(Number);

    if (modifier === "PM" && hours !== 12) hours += 12;
    if (modifier === "AM" && hours === 12) hours = 0;

    return hours * 3600 + minutes * 60 + seconds;
  };

  const startSec = parseTime(start);
  const endSec = parseTime(finish);

  let diff = endSec - startSec;
  if (diff < 0) diff += 24 * 3600;

  const hours = Math.floor(diff / 3600);
  const minutes = Math.floor((diff % 3600) / 60);

  return `${hours}h ${minutes}m`;
};