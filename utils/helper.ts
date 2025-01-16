import { EventResponseType } from "./types";

export const processEvent = async (event: EventResponseType) => {
  // console.log("Provessing event: ", event);
  new Promise((resolve) => setTimeout(() => resolve("Processed"), 1000));
  const random = Math.random() * 10;
  if (random <= 5) throw new Error("Can't Process The Event Now!");
  return "It's Fine Brother !!!☺️";
};