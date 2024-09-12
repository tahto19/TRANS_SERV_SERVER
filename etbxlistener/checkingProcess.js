import axios from "axios";

const checkingProcess = async () => {
  try {
    const getProcess = await axios({
      url: "http://localhost:5000/listener/process",
      method: "GET",
      headers: { "x-auth": "1231231" },
    });
    if (getProcess.data.result === "error")
      throw new Error(getProcess.data.message);
    console.log(getProcess.data);
    return;
    //
    const getCodeInfo = await axios({
      url: `https://ai-insight.etpbx.com/api-gateway/gateway/status/${getProcess.data.data[0].code}`,
      method: "GET",
    });
    console.log(getCodeInfo);
  } catch (err) {
    console.log(err);
  }
};
export default checkingProcess;
