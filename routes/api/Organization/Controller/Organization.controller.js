import axios from "axios";

export const getOrganization = async (req, res) => {
  try {
    console.log(process.env.OUTER_IP_ADDRESS);
    let r = await axios.post(process.env.OUTER_IP_ADDRESS + "/user/get", {
      organization_id: 2,
    });
    console.log(r.data.details);
    res.send({ result: "success", data: r.data.details });
  } catch (err) {
    console.log(err);
    throw new Error(err);
  }
};
