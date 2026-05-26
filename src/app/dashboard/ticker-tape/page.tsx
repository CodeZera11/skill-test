import AddTickerTapeDialog from "./_components/add-ticker-tape-dialog";
import TickerTapeConfigForm from "./_components/ticker-tape-config-form";
import TickerTapeTable from "./_components/ticker-tape-table";

export default function TickerTapePage() {
  return (
    <div className="space-y-4 p-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Ticker Tape</h1>
        <AddTickerTapeDialog />
      </div>

      <TickerTapeConfigForm />
      <TickerTapeTable />
    </div>
  );
}
