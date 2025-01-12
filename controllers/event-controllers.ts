import { Request, Response } from "express";

export const postEventController = async (req: Request, res: Response) => {
  try {
    const event_name = req.params.event_name;

    if (event_name) {
      res.status(200).json();
      return;
    }
    
    res.status(400).json({ error: "Invalid parameters" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
