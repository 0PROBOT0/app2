const fs = require("fs");
const express = require("express");
const cookieparser = require("cookie-parser");
const { visit } = require("./bot");

const app = express();
const flag = fs.readFileSync("flag.txt", "utf-8").trim();
const clean = (str) => str.toString().replace(/[\r\n]/g, ""); // it's not gonna work anyways ¯\_(ツ)_/¯
const isadmin = (req, res, next) => {
  return flag === req.cookies?.FLAG
    ? next()
    : res.status(403).send("Forbidden");
};

app.use(cookieparser());

app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  const { name, value } = (console.log(req.query), req.query);
  if (!name || !value) return next();
  Array.isArray(name)
    ? name.forEach((n, i) => value[i] && res.set(clean(n), clean(value[i])))
    : res.set(clean(name), clean(value));
  next();
});

app.use((err, _, res, __) =>
  res.status(500).json({ err: (console.error(err.stack), err.stack) })
);

app.get("/admin", isadmin, (req, res) => {
  res.send(req.cookies?.FLAG ?? "flag{something something}");
});

app.get("/bot", async (req, res) => {
  if (req.query?.url) await visit(req.query.url);
  res.send("<h1>If it's done it's done 👍</h1>");
});

app.get("/", (_, res) => {
  res.send("<h1>Welcome to HaaS service (Header as a Server) 🥳</h1>");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
