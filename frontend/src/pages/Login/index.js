import React, { useState, useContext } from "react";
import { Link as RouterLink } from "react-router-dom";

import {
  Button,
  CssBaseline,
  TextField,
  Link,
  Grid,
  Box,
  Typography,
  makeStyles,
  Container,
  CircularProgress,
} from "@material-ui/core";
import { versionSystem } from "../../../package.json";
import { i18n } from "../../translate/i18n";
import { nomeEmpresa } from "../../../package.json";
import { AuthContext } from "../../context/Auth/AuthContext";
import logo from "../../assets/logo.png";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100vw",
    height: "100vh",
    background: "linear-gradient(to right, #76EE00 , #458B00)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "40px",
    borderRadius: "12px",
    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
  },
  logo: {
    marginBottom: theme.spacing(3),
    width: "150px",
    height: "auto",
  },
  form: {
    width: "100%",
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  link: {
    marginTop: theme.spacing(1),
    color: theme.palette.primary.main,
    textDecoration: "none",
  },
  error: {
    color: theme.palette.error.main,
    marginTop: theme.spacing(1),
  },
}));

const Login = () => {
  const classes = useStyles();

  const [user, setUser] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { handleLogin } = useContext(AuthContext);

  const handleChangeInput = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await handleLogin(user);
    } catch (err) {
      setError("Falha ao realizar o login. Verifique suas credenciais.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={classes.root}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <div className={classes.paper}>
          <img className={classes.logo} src={logo} alt={nomeEmpresa} />
          <Typography component="h1" variant="h5">
            {i18n.t("login.title")}
          </Typography>
          <form className={classes.form} noValidate onSubmit={handleSubmit}>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="email"
              label={i18n.t("login.form.email")}
              name="email"
              value={user.email}
              onChange={handleChangeInput}
              autoComplete="email"
              autoFocus
              aria-label="E-mail"
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="password"
              label={i18n.t("login.form.password")}
              type="password"
              id="password"
              value={user.password}
              onChange={handleChangeInput}
              autoComplete="current-password"
              aria-label="Senha"
            />
            {error && (
              <Typography variant="body2" className={classes.error}>
                {error}
              </Typography>
            )}
            <Grid container justify="space-between">
              <Grid item>
                <Link component={RouterLink} to="/forgetpsw" className={classes.link}>
                  Esqueceu sua senha?
                </Link>
              </Grid>
              <Grid item>
                <Link component={RouterLink} to="/signup" className={classes.link}>
                  {i18n.t("login.buttons.register")}
                </Link>
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
              disabled={loading}
              aria-label="Entrar"
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : i18n.t("login.buttons.submit")}
            </Button>
          </form>
        </div>
        <Box mt={3}>
          <Typography variant="body2" color="textSecondary" align="center">
            {"Copyright "}
            <Link color="inherit" href="#">
              {nomeEmpresa}
            </Link>{" "}
            - v{versionSystem} {new Date().getFullYear()}
          </Typography>
        </Box>
      </Container>
    </div>
  );
};

export default Login;
