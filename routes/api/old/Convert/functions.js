export const saveTranscripts = async () => {};

export const saveTable = async (data, Table) => {
  let a = await Table.create(data);
  return a.id;
};
export const random = (number) => {
  return Math.floor(Math.random() * number);
};
