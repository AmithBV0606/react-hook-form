import { FormData } from "../types";

// Simulating API calls :
const simulatedAPI = (
  data: FormData
): Promise<{ success: boolean; data?: FormData; message?: string }> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // Simulate an error response
      if (Math.random() < 0.5) {
        reject({ message: "Server error occured. Please try again!" });
      } else {
        resolve({ success: true, data });
      }
    }, 3000);
  });
};

export default simulatedAPI;