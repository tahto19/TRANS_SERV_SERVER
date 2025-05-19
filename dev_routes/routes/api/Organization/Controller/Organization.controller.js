import axios from "axios";

export const getOrganization = async (req, res) => {
  try {
    const { organization_id } = req.query;
    let r = await axios.post(process.env.OUTER_IP_ADDRESS + "/user/get", {
      organization_id,
    });
    console.log(r.data.details);
    res.send({ result: "success", data: r.data.details });
  } catch (err) {
    throw new Error(err);
  }
};
