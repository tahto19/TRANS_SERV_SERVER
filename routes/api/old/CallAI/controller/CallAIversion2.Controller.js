export const speechTotextFromListener = async (req, res) => {
  try {
    const {
      user_id,
      queue_id,
      file,
      group_id,
      client_id,
      account_code,
      createdAt,
    } = req.body;
    let getQuery = await Queue.findAll({
      where: { queue_id, status: { [Op.not]: "Error" } },
    });
    if (getQuery.length > 0) {
      let getQuery = await Queue.findAll({
        where: { queue_id, user_id, status: { [Op.not]: "Error" } },
      });
      if (getQuery.length > 0) throw new error("already in the database");
      else {
        console.log("adding queue_id agent");
        queueId = await saveToDatabase(Queue, {
          user_id,
          queue_id,
          user_group_id: group_id,
          queue_date: createdAt,
          account_code: account_code,
        });
        res.send({ result: "success" });
      }
    } else {
      if (user_id !== "") {
        let agent = await findAgent(user_id, {
          required: true,
          model: Groups,
          where: { id: parseInt(group_id) },
          include: {
            model: GroupServiceConfig,
            include: [
              {
                model: Intents,
                attributes: ["intent", "desc", "data", "script"],
                where: { active: true },
              },
            ],
          },
        });
        if (agent.length > 0) {
          throw new Error("Agent is not on group:" + group_id);
        }
        var queueId;
      }
    }
  } catch (err) {
    res.send({ result: "error", message: err.message });
    console.log(err);
  }
};
