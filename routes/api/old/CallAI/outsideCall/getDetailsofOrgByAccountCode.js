import axios from "axios";
import getOrg from "./getDetailsofOrg.js";

export const getDetailsofOrgByAccountCode = async (ac, sequence) => {
  try {
    //

    let getIDOfOrg = await axios({
      method: "GET",
      url:
        "https://ai-insight.etpbx.com/general-info/organization/account/" + ac,
    });

    if (!getIDOfOrg.data.response) {
      console.log(getIDOfOrg.data);
      throw new Error("Something went wrong");
    }

    let id = getIDOfOrg.data.details.id;
    let org = new getOrg();
    let a = await org.start(id);

    let apikey = org.getApiByCallback(sequence);
    if (apikey === undefined) throw new Error("No API Found");
    let getAccess = await org.getAccess();
    let getOrgDetails = await org.getOrgDetails();
    let getOrgServices = await org.getOrgServices();

    // let getOrgServiceBundles = await org.getOrgServiceBundles();

    return {
      apikey,
      access: getAccess,
      details: getOrgDetails,
      service: getOrgServices,
    };
  } catch (err) {
    throw { error: err.message };
  }
};
