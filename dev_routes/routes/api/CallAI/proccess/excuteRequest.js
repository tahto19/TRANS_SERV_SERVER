import axios from "axios";

class executeRequest {
  constructor() {
    this.data = {};
    this.id;
    this.apikey = null;
  }
  async start(data, ak) {
    this.getData = data;
    this.apikey = ak;
  }
  async create() {
    try {
      let r = await axios({
        method: "POST",
        url: `https://ai-insight.etpbx.com/api-gateway/gateway/start`,
        data: this.getData,
        headers: {
          AuthorizationCode: this.apikey,
        },
      });

      if (r.data.response === false) {
        throw new Error("Something wrong 9995");
      }

      if (r.data.details === undefined) return null;
      this.id = r.data.details.id;
      return r.data.details;
    } catch (err) {
      throw err;
    }
  }
  async execute(id) {
    try {
      console.log("execute running");
      let getId = id !== undefined ? id : this.id;
      if (getId === undefined) throw "Something went wrong code AI-9999";

      let r = await axios.get(
        `${process.env.EXTERNAL_SERVICE_API_ENDPOINT}/request/mock/execute/` +
          getId
      );

      console.log("execute done");
      console.log(r.data);
      if (r.data.details === undefined) return null;
      else {
        if (r.data.details.choices === undefined) {
          return r.data.details.text;
        } else
          return r.data.details.choices[0].message.tool_calls[0].function
            .arguments;
      }
    } catch (err) {
      console.log(err);
      return null;
    }
  }
  async details(id) {
    try {
      console.log("details");
      let getId = id !== undefined ? id : this.id;
      console.log(getId);
      if (getId === undefined) throw "Something went wrong code AI-9998";

      let r = await axios.get(
        `${process.env.EXTERNAL_SERVICE_API_ENDPOINT}/request/details/` + getId
      );
      console.log(r.data.details);
      if (r.data.details === undefined) return null;
      else return r.data.details.details.RequestData[3].value_array;
    } catch (err) {
      console.log(err);
      return null;
    }
  }
  async callback() {
    try {
      let r = await axios.get(
        `${process.env.EXTERNAL_SERVICE_API_ENDPOINT}/request/mock/callback-url`
      );
      console.log(r.data);
      if (r.data.details === undefined) return null;
      else return r.data.details.details.RequestData[3].value_array;
    } catch (err) {
      console.log(err);
      return null;
    }
  }
  async start_call() {
    try {
      console.log(this.apikey);
      console.log("###########################");
      let api_key = this.apikey === undefined ? "" : this.apikey;
      let config = {
        method: "POST",
        url: `https://ai-insight.etpbx.com/api-gateway/gateway/start`,
        data: this.getData,
        headers: {
          AuthorizationCode: api_key,
        },
      };
      console.log("###########################");
      let r = await axios(config);
      console.log(r.data);
      return r.data.details;
    } catch (err) {
      console.log(err);
      throw err;
    }
  }
}

export default executeRequest;
