'use client'

import { format } from "date-fns";
import currency from "@/lib/currency";


const CustomTooltip = ({ active, payload, label }: {
  active?: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  payload?: any[];
  label?: string | number | Date;
}) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#101928] text-[#FDFDFD] p-2 rounded-md text-sm flex items-center gap-2">
        <div className="bg-vivaiia_primary h-2 w-2 rounded-full" />

        {label && label instanceof Date ? (
          <p className="label">{`${format(new Date(label), 'd MMM YYY')}`}</p>
        ) : (
          <p className="label">{label}</p>
        )}
        <p className="font-medium">{currency.format(payload[0].value)}</p>
      </div>
    );
  }

  return null;
};

export default CustomTooltip