import { useEffect, useState } from "react";
import { createEvent, getEvents, updateEventStatus } from "../api/eventsApi";

export default function Calendar() {
  const [events, setEvents] = useState([]);
  const [title, setTitle] = useState("");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");

  const loadEvents = async () => {
    const data = await getEvents();
    setEvents(data);
  };

  useEffect(() => {
    loadEvents();
  }, []);

  const addEvent = async () => {
    if (!title || !start || !end) {
      alert("Please fill in all fields");
      return;
    }
    await createEvent(title, start, end);
    setTitle("");
    setStart("");
    setEnd("");
    loadEvents();
  };

  const makeSwappable = async (id) => {
    await updateEventStatus(id, "SWAPPABLE");
    loadEvents();
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          My Events
        </h2>

        {/* Add Event Form */}
        <div className="mb-6 bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-3 text-gray-700">Add New Event</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
            <input
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="datetime-local"
              value={start}
              onChange={(e) => setStart(e.target.value)}
              className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="datetime-local"
              value={end}
              onChange={(e) => setEnd(e.target.value)}
              className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            onClick={addEvent}
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
          >
            Add Event
          </button>
        </div>

        {/* Event List */}
        <div>
          <h3 className="text-lg font-semibold mb-3 text-gray-700">Your Events</h3>
          {events.length === 0 ? (
            <p className="text-gray-500 text-center">No events yet. Add one above!</p>
          ) : (
            <ul className="space-y-3">
              {events.map((e) => (
                <li
                  key={e._id}
                  className="flex flex-col md:flex-row md:items-center justify-between bg-gray-50 p-4 rounded border border-gray-200"
                >
                  <div className="mb-2 md:mb-0">
                    <p className="font-medium text-gray-800">{e.title}</p>
                    <p className="text-sm text-gray-600">
                      {new Date(e.startTime).toLocaleString()} -{" "}
                      {new Date(e.endTime).toLocaleString()}
                    </p>
                    <p className="text-sm mt-1">
                      <span
                        className={`px-2 py-1 rounded text-xs font-semibold ${
                          e.status === "BUSY"
                            ? "bg-red-100 text-red-700"
                            : e.status === "SWAPPABLE"
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {e.status}
                      </span>
                    </p>
                  </div>

                  {e.status === "BUSY" && (
                    <button
                      onClick={() => makeSwappable(e._id)}
                      className="bg-indigo-600 text-white px-4 py-1 rounded hover:bg-indigo-700 transition"
                    >
                      Make Swappable
                    </button>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
