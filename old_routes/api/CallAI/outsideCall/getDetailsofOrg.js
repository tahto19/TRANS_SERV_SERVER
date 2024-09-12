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
    this.defaultCallBack =
      "https://ai-insight.etpbx.com/transaction-service/callback";
  }
  async start(id) {
    const getAccess = await axios.get(
      "https://ai-insight.etpbx.com/general-info/organization/complete-details/" +
        id
    );

    if (!getAccess.data.response) this.error = true;

    this.orgDetails = getAccess.data.details;

    return this.orgDetails;
    this.getOrgServices();
    this.getApiByCallback();
    this.getOrgDetails();
    this.getOrgServices();
    this.getOrgServiceBundles();
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
      return this.access.api_key;
    }
  }
  getOrgDetails() {
    if (this.error) return "error";
    return this.orgDetails;
  }
  getOrgServices() {
    if (this.error) return "error";

    this.service =
      this.orgDetails.OrganizationSubscription.Subscription.SubscriptionServices;
    return this.service;
  }
  getOrgServices(data) {
    if (this.error) return "error";
    if (this.error) return "error";
    else if (data !== undefined) {
      this.access = this.orgDetails.ApiKeys.find(
        (x) => x.callback_url === data
      );
      let service_id = this.access.service_id;
      this.service =
        this.orgDetails.OrganizationSubscription.Subscription.SubscriptionServices.find(
          (x) => x.service_id === service_id
        );

      return this.service;
    } else {
      let service_id = this.access.service_id;

      this.service =
        this.orgDetails.OrganizationSubscription.Subscription.SubscriptionServices.find(
          (x) => x.service_id === service_id
        );

      return this.service;
    }
  }
  getOrgServiceBundles(data) {
    if (this.error) return "error";
    console.log();
    this.bundles = this.service.Service.ServiceBundles;
    return this.service.Service.ServiceBundles;
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
    console.log(toFind);
    return this.bundles.find(
      (x) => x.AiModule.name.toLowerCase() === toFind.toLowerCase()
    );
  }
}
export default getOrg;
