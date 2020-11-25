const jwt = require("jwt-simple");
const db = require('./dbConnection')

const generateToken = (user) => {
  let token = jwt.encode(
    {
      id: user.reg_id,
    },
    process.env.SECRET
  );

  return {
    token,
    user: {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      reg_id: user.reg_id,
      is_admin: user.is_admin
    }
  };
};

const authenticate = (req, res, next) => {
    const token = req.headers.authorization;
 
    if (token) {
      const decoded = jwt.decode(token.split(" ")[1], process.env.SECRET);
      db.query(
          "SELECT * FROM staff WHERE reg_id=?",
          [decoded.id],
          (err, res) => {
              if(res) {
                  next();
              }
              else {
                res.status(401).json({ err: "Token not found", data: null});
              }
          }
      )
    }
    else {
      res.status(401).json({ err: "Token not found", data: null})
    }
}

const authenticateAdmin = (req, res, next) => {
  const token = req.headers.authorization;

  if (token) {
    const decoded = jwt.decode(token.split(" ")[1], process.env.SECRET);
    db.query(
        "SELECT * FROM staff WHERE reg_id=?",
        [decoded.id],
        (err, user) => {
            if(user) {
                if(user[0].is_admin) {
                  next();
                }
                else {
                  res.status(401).json({ err: "Invalid admin token", data: null});
                }
            }
            else {
              res.status(401).json({ err: "Token not found", data: null});
            }
        }
    )
  }
  else {
    res.status(401).json({ err: "Token not found", data: null})
  }
}

module.exports = { 
    generateToken,
    authenticate,
    authenticateAdmin
};