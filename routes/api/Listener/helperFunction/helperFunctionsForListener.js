import axios from "axios";
import Query from "../../../../models/Query.model.js";
const urlStatusChecker =
  "https://ai-insight.etpbx.com/api-gateway/gateway/status/";
export const statusChecker = async (code) => {
  try {
    let getStatusInfoFirst = await axios.get(urlStatusChecker + code);
    if (getStatusInfoFirst.data.response === "error") {
      throw new Error(getStatusInfoFirst.data.error);
    }

    return getStatusInfoFirst.data;
  } catch (err) {
    throw err;
  }
};
const checkDataStatus = async () => {};
export const runQueryChecker = async (queryInfo) => {
  try {
    let statusChecker_ = await statusChecker(queryInfo.code);
    if (
      statusChecker_.error !== undefined &&
      statusChecker_.error === "Data not found"
    ) {
      // add code here
      //   await changeStatusOfQuery(
      //     queryInfo,
      //     "statusChecker data not found error on checker"
      //   );
      //   rerun all data here still no code cant find any
      return statusChecker_;
    } else {
      // if no error check for all the status

      checkStatusOfChecker(queryInfo, statusChecker_.details);
      return statusChecker_;
    }
  } catch (err) {
    throw err;
  }
};
const changeStatusOfQuery = async (queryInfo, other_details) => {
  try {
    if (
      queryInfo.type.includes("Compliance") ||
      queryInfo.type.includes("Text Analysis") ||
      queryInfo.type.includes("Content Summarizer")
    ) {
      // change status of this queryInfo
      // updating status to re process
      // await Query.updateOne(
      //   {
      //     status: "re processs",
      //     other_details: other_details,
      //   },
      //   {
      //     id: queryInfo.id,
      //   }
      // );
    } else if (
      queryInfo.type.includes("Intent Analysis") ||
      queryInfo.type.includes("Sentiment Analysis")
    ) {
      // change status of this queryInfo
      // updating status to re process
      // await Query.updateOne(
      //   {
      //     status: "re processs",
      //     other_details: other_details,
      //   },
      //   {
      //     id: queryInfo.id,
      //   }
      // );
    }
  } catch (err) {
    throw err;
  }
};
const checkStatusOfChecker = async (queryInfo, data) => {
  if (
    queryInfo.type.includes("Compliance") ||
    queryInfo.type.includes("Text Analysis") ||
    queryInfo.type.includes("Content Summarizer")
  ) {
    let getFailed = data.filter((x) => x.status === "Failed");
    if (getFailed.length > 0) {
      //   console.log("here");
      //  rerun data
      //   change the status
      //   await changeStatusOfQuery(
      //     queryInfo,
      //     `${getFailed.length} Failed cant proceed`
      //   );
    }
    // for (let i = 0; i < data.length; i++) {
    //   let val = data[i];
    //   console.log(val, "asd");
    // }
  }
};
