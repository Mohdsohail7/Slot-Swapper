import { useEffect, useState } from "react";
import apiAxios from "../api/apiConnector";

export default function Notifications() {
  const [requests, setRequests] = useState([]);

  const loadRequests = async () => {
    const { data } = await apiAxios.get("/api/swaps"); 
    setRequests(data);
  };

  useEffect(() => {
    loadRequests();
  }, []);

  const respond = async (id, accept) => {
    await apiAxios.post(`/api/swaps/swap-response/${id}`, { accept });
    loadRequests();
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Swap Requests
        </h2>

        {requests.length === 0 ? (
          <p className="text-center text-gray-500">
            No swap requests yet.
          </p>
        ) : (
          <div className="space-y-4">
            {requests.map((r) => (
              <div
                key={r._id}
                className="border border-gray-200 bg-gray-50 p-4 rounded-lg shadow-sm hover:shadow-md transition"
              >
                <p className="text-lg font-medium text-gray-800">
                  Request from:{" "}
                  <span className="text-blue-600">
                    {r.requesterId?.name || r.requesterId}
                  </span>
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  Offered slot:{" "}
                  <span className="font-medium text-gray-700">
                    {r.offeredSlot?.title || "N/A"}
                  </span>
                </p>
                <p className="text-sm text-gray-600">
                  Requested slot:{" "}
                  <span className="font-medium text-gray-700">
                    {r.requestedSlot?.title || "N/A"}
                  </span>
                </p>

                {/* Status */}
                <div className="mt-3">
                  <span
                    className={`px-2 py-1 text-xs font-semibold rounded ${
                      r.status === "PENDING"
                        ? "bg-yellow-100 text-yellow-700"
                        : r.status === "ACCEPTED"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {r.status}
                  </span>
                </div>

                {/* Action buttons */}
                {r.status === "PENDING" && (
                  <div className="mt-4 flex gap-3">
                    <button
                      onClick={() => respond(r._id, true)}
                      className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => respond(r._id, false)}
                      className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
                    >
                      Reject
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
