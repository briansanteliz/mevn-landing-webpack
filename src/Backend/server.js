const express = require("express");
const morgan = require("morgan");
const path = require("path");
const cors = require("cors");
const session = require("express-session");
const database = require("./config/database");
const sessionOptions = require("./config/session");
const MysqlSession = require("express-mysql-session")(session);
const newsletterRouter = require("./router/newsletterRouter");
const contactRouter = require("./router/contactRouter");
const adminRouter = require("./router/adminRouter");
const panelRouter = require("./router/panelRouter");
const suscriptionsRouter = require("./router/suscriptionsRouter");
const servicesRouter = require("./router/servicesRouter");
const messageRouter = require("./router/messageRouter");
const logoutRouter = require("./router/logoutRouter");
const authRouter = require("./router/authRouter");
const { vetificarAuth } = require("./middleware/auth");
const app = express();

app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));
const store = new MysqlSession(sessionOptions);
app.set("port", process.env.PUERTO || 4000);
app.use(
  session({
    secret: process.env.SECRET,
    saveUninitialized: true,
    resave: true,
    cookie: {
      maxAge: 86400 * 1000,
    },
    store,
  })
);
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(express.static(path.join(__dirname, "public")));

app.use("/newsletter", newsletterRouter);
app.use("/contact", contactRouter);
app.use("/services/backend", servicesRouter);
app.use("/admin", adminRouter);
app.use("/admin/auth", authRouter);
app.use("/panel", vetificarAuth, panelRouter);
app.use("/suscriptions", vetificarAuth, suscriptionsRouter);
app.use("/message", vetificarAuth, messageRouter);
app.use("/logout", logoutRouter);
app.listen(app.get("port"), async () => {
  try {
    await database.authenticate();
    console.log("Base de datos Connectada");
    console.log(`Servidor en el puerto: ${app.get("port")}`);
  } catch (error) {
    console.log(error);
  }
});
