import { deleteDataController } from "../Controller/DeleteData.controller.js";

export const deleteDataSchema = {
  handler: deleteDataController,
  schema: {
    body: {
      transcript_id: { type: "array" },
      callerid: { type: "array" },
      date_range: { type: "array" },
      secretMessage: { type: "string" },
    },
  },
};
