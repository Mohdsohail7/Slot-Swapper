import apiAxios from "./apiConnector";

// Fetch all events for the logged-in user
export const getEvents = async () => {
  const { data } = await apiAxios.get("/api/events");
  return data;
};

// Create a new event
export const createEvent = async (title, startTime, endTime) => {
  const { data } = await apiAxios.post("/api/events", { title, startTime, endTime });
  return data;
};

// Update event status
export const updateEventStatus = async (id, status) => {
  const { data } = await apiAxios.patch(`/api/events/${id}/status`, { status });
  return data;
};
