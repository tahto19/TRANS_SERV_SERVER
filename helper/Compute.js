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
      let changeMetric =
        x.metricsRange === undefined
          ? parseFloat(x.rating)
          : x.metricsRange === "1-5"
          ? convert1_5ToPercentage(parseFloat(x.rating))
          : x.metricsRange === "1-10"
          ? convert1_10ToPercentage(parseFloat(x.rating))
          : parseFloat(x.rating);
      let temp = {
        anaylsis: x.anaylsis,
        kpi: x.kpi,
        rating: x.rating,
        weightConverted: changeMetric * 0.01 * parseInt(x.getWeight),
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
  totalOfKPI() {
    let totalRating = 0;
    this.data.forEach((x) => {
      totalRating += parseInt(x.rating) * 0.01 * parseInt(x.getWeight);
    });
    return totalRating;
  }
}

function handleError(message) {
  return { message: message, status: 400 };
}

export function computePerKpi(x) {
  try {
    // kpi.forEach((x, i) => {
    // totalRating += parseInt(x.getWeight);

    // if (!isNaN(parseInt(x.getWeight)) && !isNaN(parseInt(x.rating))) {
    let changeMetric =
      x.metricsRange === undefined
        ? parseFloat(x.rating)
        : x.metricsRange === "1-5"
        ? convert1_5ToPercentage(parseFloat(x.rating))
        : x.metricsRange === "1-10"
        ? convert1_10ToPercentage(parseFloat(x.rating))
        : parseFloat(x.rating);
    let temp = {
      kpi: x.kpi,
      rating: parseInt(x.rating) * 0.01,
      weightConverted: changeMetric,
      count: 1,
      metrics: x.metricsRange,
      getOnlyWeight: changeMetric * 0.01 * parseInt(x.getWeight),
    };
    return temp;
    // });
  } catch (err) {
    console.log(err);
  }
}
// export function
function convert1_5ToPercentage(number) {
  if (number >= 1 && number <= 5) {
    var percentage = (number / 5) * 100;

    return percentage;
  } else {
    console.log("Number must be in the range of 1 to 5.");
    return null;
  }
}
function convert1_10ToPercentage(number) {
  if (number >= 1 && number <= 5) {
    var percentage = number * 100 * 0.1;

    return percentage;
  } else {
    console.log("Number must be in the range of 1 to 5.");
    return null;
  }
}
