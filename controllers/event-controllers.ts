import { Request, Response } from "express";

// Trigger an event
export const triggerEventController = async (req: Request, res: Response) => {
  try {
    res.status(200).json();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
