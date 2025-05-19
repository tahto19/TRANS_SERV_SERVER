import { Op } from "sequelize";

export function WhereFilters(filters = []) {
  let wherefilters = {};

  if (filters && filters instanceof Array && filters.length > 0) {
    for (var x = 0; x < filters.length; x++) {
      const f = filters[x];

      switch (f.type.toString().toLowerCase()) {
        case "multiple-string":
        case "multiple-boolean":
        case "multiple-array":
        case "multiple-date":
          let multiplewherefilters = this.WhereFilters(
            f.field.map((i) => {
              return {
                field: i,
                filter: f.filter,
                type: f.type.toString().toLowerCase().replace("multiple-", ""),
              };
            })
          );

          wherefilters = Object.assign({}, wherefilters, multiplewherefilters);
          break;
        case "string":
          wherefilters[f.field] = {
            [Op.substring]: f.filter.toString(),
          };
          break;
        case "boolean":
          wherefilters[f.field] = f.filter;
          break;
        case "array":
          wherefilters[f.field] = {
            [Op.in]: f.filter,
          };
          break;
        case "date":
          if (
            f.filter.start &&
            f.filter.start.toString().length > 0 &&
            moment(f.filter.start.toString()).isValid()
          ) {
            if (
              f.filter.end &&
              f.filter.end.toString().length > 0 &&
              moment(f.filter.end.toString()).isValid()
            ) {
              wherefilters[f.field] = {
                [Op.gte]: `${moment(f.filter.start.toString()).format(
                  "YYYY-MM-DD"
                )} 00:00:00`,
                [Op.lte]: `${moment(f.filter.end.toString()).format(
                  "YYYY-MM-DD"
                )} 23:59:59`,
              };
            } else {
              wherefilters[f.field] = {
                [Op.gte]: `${moment(f.filter.start.toString()).format(
                  "YYYY-MM-DD"
                )} 00:00:00`,
                [Op.lte]: `${moment(f.filter.start.toString()).format(
                  "YYYY-MM-DD"
                )} 23:59:59`,
              };
            }
          }
          break;
      }
    }
  }

  return wherefilters;
}
