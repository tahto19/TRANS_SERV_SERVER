import { changeSend } from "../../../../helper/toSend.js";
import Notes from "../../../../models/Notes.model.js";
import Transcripts from "../../../../models/Transcripts.model.js";

export const getNotes = async (req, res) => {
  try {
    const { id } = req.query;
    let findTranscript = await Transcripts.findByPk(id);
    if (findTranscript === null)
      throw new Error("Something went wrong not found notes");
    let findNotes = await Notes.findOne({ where: { transcript_id: id } });
    if (findNotes === null || findNotes.length === 0) {
      findNotes = await Notes.create({ transcript_id: id });
      findNotes["notes"] = "";
    }

    res.send(changeSend(findNotes));
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export const postNotes = async (req, res) => {
  try {
    const { id, notes } = req.body;
    let r = await Notes.update({ notes }, { where: { transcript_id: id } });
    res.send(changeSend(r));
  } catch (err) {
    throw err;
  }
};
