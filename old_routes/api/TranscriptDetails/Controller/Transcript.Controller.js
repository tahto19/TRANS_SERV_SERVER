import { changeToJson } from "../../../../helper/helpersHere.js";
import { changeSend } from "../../../../helper/toSend.js";
import TranscriptSeperation from "../../../../models/TranscriptSeperation.js";

export const getSeperation = async (req, res) => {
  try {
    const { id } = req.query;
    console.log(id);
    let a = await TranscriptSeperation.findOne({
      where: { transcript_id: id },
    });
    if (a === null) throw new Error("Not found");
    let changeA = changeToJson(a);
    // let modifyAgent = changeA.agentSegment.map((v) => ({
    //   agent_message: v.text,
    //   start: v.start,
    //   end: v.end,
    //   id: v.id,
    // }));
    // let modifyCostumer = changeA.costumerSegment.map((v) => ({
    //   customer_message: v.text,
    //   start: v.start,
    //   end: v.end,
    //   id: v.id,
    // }));
    // let mergetArray = [...modifyAgent, ...modifyCostumer];
    // mergetArray.sort((a, b) => a.id - b.id);
    res.send(changeSend(changeA));
  } catch (err) {
    console.log(err);
    throw err;
  }
};
