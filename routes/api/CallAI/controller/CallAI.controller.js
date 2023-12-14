import { changeSend } from "../../../../helper/toSend.js";
import { proccessIntent } from "../proccess/proccess.js";

export const intentAnylsis = async (req, res) => {
  try {
    const { transcript, id } = req.body;

    const processIntent = new proccessIntent();
    let response = await processIntent.process(transcript, id);

    res.send(changeSend(response));
  } catch (err) {
    console.log(err);
    throw err;
  }
};
