const auth = (req, res, done) => {
  const getAuth = req.headers["x-auth"];
  console.log(req.url.includes("callback"), req.method);
  if (
    getAuth === undefined &&
    !req.url.includes("callback") &&
    req.method !== "POST"
  )
    return res.code(401).send({ error: "Something went wrong... 9999" });

  done();
};
export default auth;
