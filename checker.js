import { Op } from "sequelize";
import Transcripts from "./models/Transcripts.model.js";
import moment from "moment";
import axios from "axios";
const sendEmail = async (n) => {
  try {
    let send = await axios.post(
      "https://api.postmarkapp.com/email",
      {
        From: "insights@elishatelecom.com",
        To: "crisanto.tubelleja@eacomm.com",
        Subject: "Warning No Data",
        HtmlBody: "<strong>Hello</strong> No processing",
        MessageStream: "outbound",
      },
      {
        headers: {
          "X-Postmark-Server-Token": "237dec88-f040-4ff2-b4d5-4cf3ab3639b3",
        },
      }
    );
    console.log(send);
  } catch (err) {
    console.log(err.message);
  }
};
const checker = async (date) => {
  let getData = await Transcripts.count({
    where: {
      queue_date: {
        [Op.between]: [
          date.format("YYYY-MM-DD HH:mm:ss"),
          date.subtract(4, "hours").format("YYYY-MM-DD HH:mm:ss"),
        ],
      },
    },
    attributes: ["id"],
  });
  // console.log(getData);
  if (getData === 0) {
    sendEmail();
  } else {
    console.log(getData + "Total in 1 hour", date);
  }
};
export default checker;
