import axios from "axios";

class getOrg {
  constructor() {
    this.bundles;
    this.apiKey;
    this.name;
    this.error = false;
    this.orgDetails;
    this.access;
    this.service;
    this.defaultCallBack = "http://localhost:4118/gateway/mock/callback";
  }
  async start(id) {
    const getAccess = await axios.get(
      "https://ai-insight.etpbx.com/general-info/organization/complete-details/" +
        id
    );

    if (!getAccess.data.response) this.error = true;

    this.orgDetails = getAccess.data.details;

    return this.orgDetails;
    //   this.getOrgServices();
    //   this.getApiByCallback();
    //   this.getOrgDetails();
    //   this.getOrgServiceBundles();
  }
  getApiByCallback(data) {
    if (this.error) return "error";
    else if (data !== undefined) {
      this.access = this.orgDetails.ApiKeys[data];

      return this.access.api_key;
    } else {
      this.access = this.orgDetails.ApiKeys.find(
        (x) => x.callback_url === this.defaultCallBack
      );
    }
  }
  getOrgDetails() {
    if (this.error) return "error";
    return this.orgDetails;
  }
  getOrgServices(data) {
    if (this.error) return "error";

    this.service = this.orgDetails.ApiKeys[data];
    return this.service;
  }
  // getOrgServices(data) {
  //   if (this.error) return "error";
  //   else if (data !== undefined) {
  //     // this.access = this.orgDetails.ApiKeys.find(
  //     //   (x) => x.callback_url === data
  //     // );
  //     // let service_id = this.access.service_id;
  //     // this.service =
  //     //   this.orgDetails.OrganizationSubscription.Subscription.SubscriptionServices.find(
  //     //     (x) => x.service_id === service_id
  //     //   );

  //     return this.orgDetails.ApiKeys[data];
  //   } else {
  //     let service_id = this.access.service_id;

  //     this.service =
  //       this.orgDetails.OrganizationSubscription.Subscription.SubscriptionServices.find(
  //         (x) => x.service_id === service_id
  //       );

  //     return this.orgDetails.ApiKeys[data];
  //   }
  // }
  getOrgServiceBundles(data) {
    if (this.error) return "error";

    // this.bundles = this.orgDetails.ApiKeys[data];
    // return this.orgDetails.ApiKeys[data];
  }
  getAccess(data) {
    if (this.error) return "error";
    if (data === undefined) return this.access;
    else {
      this.access = this.orgDetails.ApiKeys.find(
        (x) => x.callback_url === data
      );
      return this.access;
    }
  }
  findBundles(toFind) {
    return this.bundles.find(
      (x) => x.AiModule.name.toLowerCase() === toFind.toLowerCase()
    );
  }
}
export default getOrg;
