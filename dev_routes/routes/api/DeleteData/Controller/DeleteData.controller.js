import moment from "moment";
import { Op } from "sequelize";

export const deleteDataController = async (req, res) => {
  try {
    const { callerid, date_range, transcript_id } = req.body;
    let query;
    if (date_range !== undefined) {
      query["queue_date"] = {
        [Op.between]: [
          moment(date_range[0]).startOf("day"),
          moment(date_range[1]).endOf("day"),
        ],
      };
    }
    if (callerid !== undefined) {
      query["callerid"] = { [Op.in]: callerid };
    } else if (transcript_id !== undefined) {
      query["id"] = { [Op.in]: transcript_id };
    }
    console.log(query);
  } catch (err) {
    console.log(err);
    throw err;
  }
};
