import axios from "axios";

class executeRequest {
  constructor() {
    this.data = {};
    this.id;
  }
  async start(data) {
    this.getData = data;
  }
  async create() {
    try {
      let r = await axios.post(
        `${process.env.EXTERNAL_SERVICE_API_ENDPOINT}/request/create`,
        this.getData
      );
      if (r.data.details.id === undefined) return null;
      this.id = r.data.details.id;
      return r.data.details.id;
    } catch (err) {
      return null;
    }
  }
  async execute(id) {
    try {
      let getId = id !== undefined ? id : this.id;
      if (this.id === undefined) throw "Something went wrong code AI-9999";

      let r = await axios.get(
        `${process.env.EXTERNAL_SERVICE_API_ENDPOINT}/request/mock/execute/` +
          getId
      );
      if (r.data.details === undefined) return null;
      else
        return r.data.details.choices[0].message.tool_calls[0].function
          .arguments;
    } catch (err) {
      return null;
    }
  }
}

export default executeRequest;
