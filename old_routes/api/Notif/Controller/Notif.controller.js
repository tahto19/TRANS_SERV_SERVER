import { changeSend } from "../../../../helper/toSend.js";
import Agents from "../../../../models/Agents.model.js";
import Groups from "../../../../models/Groups.model.js";
import Transcripts from "../../../../models/Transcripts.model.js";
import averageTotal from "../../../../models/averageTotal.model.js";

import { Group } from "../../Group/Group.js";

export const getNotif = async (req, res) => {
  try {
    const { id } = req.query;
    let getNotif = await averageTotal.findAll({
      where: { status: "Created" },
      include: [
        {
          required: true,
          model: Transcripts,
          // attributes: ["Agents", "createdAt", "id"],
          include: [
            { model: Agents },
            {
              required: true,
              model: Groups,
              where: { organization_id: id },
              // attributes: [],
            },
          ],
        },
      ],
    });
    console.log(getNotif);
    res.send(changeSend(getNotif));
  } catch (err) {
    console.log(err);
    throw err;
  }
};
export const seenNotif = async (req, res) => {
  try {
    const { id } = req.query;
    let getNotif = await averageTotal.update(
      { status: "Seen" },
      {
        where: { transcript_id: id },
      }
    );
    res.send(changeSend(getNotif));
  } catch (err) {
    console.log(err);
    throw err;
  }
};
