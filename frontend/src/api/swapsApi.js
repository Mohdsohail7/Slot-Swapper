import apiAxios from "./apiConnector";

// Fetch all swappable slots from other users
export const getSwappableSlots = async () => {
  const { data } = await apiAxios.get("/api/swaps/swappable-slots");
  return data;
};

// Request a swap between my slot and another user's slot
export const requestSwap = async (mySlotId, theirSlotId) => {
  if (!mySlotId) return;
  const { data } = await apiAxios.post("/api/swaps/swap-request", { mySlotId, theirSlotId });
  return data;
};

// Fetch all swap requests
export const getSwapRequests = async () => {
  const { data } = await apiAxios.get("/api/swaps");
  return data;
};

// Respond to a swap request (accept or reject)
export const respondToSwapRequest = async (id, accept) => {
  const { data } = await apiAxios.post(`/api/swaps/swap-response/${id}`, { accept });
  return data;
};
