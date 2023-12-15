export class computeForKpi {
  constructor() {
    this.data = [];
  }
  start(kpis) {
    this.data = kpis;
  }
  details(data) {
    let getData = data !== undefined ? data : this.data;
    if (getData !== undefined) {
      return this.compute();
    } else {
      return handleError("Error Something went wrong 9995");
    }
  }
  compute() {
    let a = this.data.map((x) => {
      let temp = {
        anaylsis: x.anaylsis,
        kpi: x.kpi,
        rating: x.rating,
        weightConverted: parseInt(x.rating) * 0.01 * parseInt(x.getWeight),
      };
      return temp;
    });
    return a;
  }
  totalRating() {
    let totalRating = 0;
    let a = this.data.map((x) => {
      totalRating += parseInt(x.getWeight);
      let temp = {
        anaylsis: x.anaylsis,
        kpi: x.kpi,
        rating: x.rating,
        weightConverted: parseInt(x.rating) * 0.01 * parseInt(x.getWeight),
      };
    });
    return totalRating;
  }
}

function handleError(message) {
  return { message: message, status: 400 };
}
