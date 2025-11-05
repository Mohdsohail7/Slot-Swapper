import { useEffect, useState } from "react";
import { getSwappableSlots, requestSwap as sendSwapRequest } from "../api/swapsApi";
import { getEvents } from "../api/eventsApi";

export default function Marketplace() {
  const [swappableSlots, setSwappableSlots] = useState([]);
  const [mySwappable, setMySwappable] = useState([]);

  const loadSlots = async () => {
    const slots = await getSwappableSlots();
    setSwappableSlots(slots);

    const mine = await getEvents();
    setMySwappable(mine.filter((e) => e.status === "SWAPPABLE"));
  };

  useEffect(() => {
    loadSlots();
  }, []);

  const requestSwap = async (mySlotId, theirSlotId) => {
    if (!mySlotId) return;
    await sendSwapRequest(mySlotId, theirSlotId);
    alert("Swap request sent!");
    loadSlots();
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Swappable Slots Marketplace
        </h2>

        {swappableSlots.length === 0 ? (
          <p className="text-center text-gray-500">
            No swappable slots available right now.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {swappableSlots.map((slot) => (
              <div
                key={slot._id}
                className="border border-gray-200 bg-gray-50 p-4 rounded-lg shadow-sm hover:shadow-md transition"
              >
                <p className="text-lg font-semibold text-gray-800">{slot.title}</p>
                <p className="text-sm text-gray-600 mb-2">
                  {new Date(slot.startTime).toLocaleString()} –{" "}
                  {new Date(slot.endTime).toLocaleString()}
                </p>
                <p className="text-xs text-gray-500 mb-4">
                  Owner: <span className="font-medium">{slot.owner?.name || "Unknown"}</span>
                </p>

                <select
                  onChange={(e) => requestSwap(e.target.value, slot._id)}
                  defaultValue=""
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Offer one of my slots...</option>
                  {mySwappable.length === 0 ? (
                    <option disabled>You have no swappable slots</option>
                  ) : (
                    mySwappable.map((mine) => (
                      <option key={mine._id} value={mine._id}>
                        {mine.title} ({new Date(mine.startTime).toLocaleDateString()})
                      </option>
                    ))
                  )}
                </select>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
