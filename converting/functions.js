import { Sequelize } from "sequelize";

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    dialect: process.env.SEQUELIZE_DIALECT,
  }
);
export const getTranscript = async () => {
  let getTranscript = await sequelize.query(
    `SELECT * FROM etpbx_ca_transcripts `
  );
  return getTranscript;
};
