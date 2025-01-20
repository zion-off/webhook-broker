import { EventRequestType } from "@/utils/types";
import axios, { AxiosError, isAxiosError } from "axios";

export const processEvent = async (event: EventRequestType) => {
  try {
    // throw new AxiosError("idk", "ECONNABORTED");
    await axios.post(event.webhookUrl, payload);
  } catch (error) {
    if (isAxiosError(error) && isRetryableError(error)) {
      throw new Error(error.message);
    }
  }
  return "Job Processed👌";
};

const isRetryableError = (error: AxiosError): boolean => {
  if (error.code === "ECONNABORTED") {
    return true;
  }
  if (error.response) {
    return (
      error.response.status === 408 ||
      error.response.status === 429 ||
      error.response.status === 500 ||
      error.response.status === 503
    );
  }
  return false;
};

const payload = {
  id: "123456",
  url: "https://example.com/images/sample.jpg",
  name: "sample_image",
  description: "A sample image for demonstration purposes",
  tags: ["sample", "image", "demo"],
  metadata: {
    dimensions: {
      width: 1920,
      height: 1080,
    },
    format: "jpeg",
    size_in_bytes: 204800,
    created_at: "2024-12-23T12:00:00Z",
    updated_at: "2024-12-23T12:00:00Z",
  },
  related_entities: {
    album_id: "7890",
    user_id: "user_456",
  },
  is_public: true,
};
