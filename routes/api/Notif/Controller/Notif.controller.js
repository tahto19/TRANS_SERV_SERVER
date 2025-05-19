import { Op } from "sequelize";
import { changeSend } from "../../../../helper/toSend.js";
import Agents from "../../../../models/Agents.model.js";
import Groups from "../../../../models/Groups.model.js";
import Notes from "../../../../models/Notes.model.js";
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
          model: Transcripts,
          // attributes: ["Agents", "createdAt", "id"],
          include: [
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

    res.send(changeSend({ count: getNotif }));
  } catch (err) {
    console.log(err);
    throw err;
  }
};
export const NewgetNotif = async (req, res) => {
  try {
    const { id, offset, limit } = req.body;
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
            { model: Notes, required: true },
          ],
        },
      ],
      limit,
      offset: limit * offset,
    });

    res.send(changeSend(getNotif));
  } catch (err) {
    console.log(err);
    throw err;
  }
};
export const seenNotif = async (req, res) => {
  try {
    const { id, organization_id } = req.query;

    let getNotif;
    if (id !== undefined)
      getNotif = await averageTotal.update(
        { status: "Seen" },
        {
          where: { transcript_id: id, status: { [Op.not]: "Done" } },
        }
      );
    else {
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
                where: { organization_id: organization_id },
                attributes: [],
              },
            ],
          },
        ],
      });
      for (let i = 0; i < getNotif.length; i++) {
        let v = getNotif[i];
        await averageTotal.update({ status: "Seen" }, { where: { id: v.id } });
      }
    }
    res.send(changeSend(getNotif));
  } catch (err) {
    console.log(err);
    throw err;
  }
};
