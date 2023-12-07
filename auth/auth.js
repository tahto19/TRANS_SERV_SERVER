const auth = (req, res, done) => {
  const getAuth = req.headers["x-auth"];
  if (getAuth === undefined)
    return res.code(401).send({ error: "Something went wrong... 9999" });

  done();
};
export default auth;
