import { QueryTypes, Sequelize } from "sequelize";
import "dotenv/config";
let sequelize = new Sequelize("transaction_service", "root", "", {
  host: "localhost",
  dialect: "mariadb",
});

class dbQuery {
  getQtype(i) {
    let Qtype = [{ type: QueryTypes.SELECT }];

    return Qtype[i];
  }

  async query(q, i) {
    let type = this.getQtype(i);
    console.log(q, this.getQtype(i));

    return await sequelize.query(q, type);
  }
}

export default dbQuery;
