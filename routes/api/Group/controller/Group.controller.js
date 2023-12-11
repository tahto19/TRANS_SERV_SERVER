import axios from "axios";

export const getUsersByGroupId = async (req, res) => {
  try {
    let r = await axios.get(process.env.OUTER_IP_ADDRESS, {});
  } catch (err) {
    throw err;
  }
};
export const getGroups = async (req, res) => {
  try {
    console.log(process.env.OUTER_IP_ADDRESS);
    let r = await axios.post(process.env.OUTER_IP_ADDRESS + "/user/get", {
      organization_id: 2,
    });
    console.log(r.data.details);
    res.send({ result: "success", data: r.data.details });
  } catch (err) {
    throw err;
  }
};
