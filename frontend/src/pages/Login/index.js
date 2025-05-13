import React, { useState, useContext } from "react";
import { Link as RouterLink } from "react-router-dom";

import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import Link from "@material-ui/core/Link";
import Grid from "@material-ui/core/Grid"; 
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import { i18n } from "../../translate/i18n";
import { AuthContext } from "../../context/Auth/AuthContext";

import logoDefault from "../../assets/logo.png";
const logo = process.env.REACT_APP_LOGO || logoDefault;

const copyright = process.env.REACT_APP_COPYRIGHT || "";
const copyrightYear = process.env.REACT_APP_COPYRIGHT_YEAR || "";
const copyrightUrl = process.env.REACT_APP_COPYRIGHT_URL || "";

const Copyright = () => {
	return (
		<Typography variant="body2" color="textSecondary" align="center">
			{"Copyright © "}
			{copyrightYear}
			{"-"}
			{new Date().getFullYear()}
			{" - "}
			<Link color="inherit" href={copyrightUrl}>
				{copyright}
			</Link>
			{"."}
		</Typography>
	);
};

const useStyles = makeStyles(theme => ({
	root: {
		width: "100vw",
		height: "100vh",
		backgroundImage: "url('../../assets/background.jpeg')",
		backgroundRepeat: "no-repeat",
		backgroundSize: "100% 100%",
		backgroundPosition: "center",
		display: "flex",
		flexDirection: "column",
		alignItems: "center",
		justifyContent: "center",
		textAlign: "center",
	},
	paper: {
		backgroundColor: theme.palette.login,
		display: "flex",
		flexDirection: "column",
		alignItems: "center",
		padding: "55px 30px",
		borderRadius: "12.5px",
	},
	form: {
		width: "100%",
		marginTop: theme.spacing(1),
	},
	submit: {
		margin: theme.spacing(3, 0, 2),
	},
	powered: {
		color: "white"
	}
}));

const Login = () => {
	const classes = useStyles();
	const { handleLogin } = useContext(AuthContext);

	const [user, setUser] = useState({ email: "", password: "" });
	const [errors, setErrors] = useState({ email: "", password: "" });

	const validateEmail = (email) => {
		const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		return re.test(email);
	};

	const validatePassword = (password) => {
		return password.length >= 7;
	};

	const handleChangeInput = (e) => {
		const { name, value } = e.target;
		setUser({ ...user, [name]: value });

		// Limpa o erro quando o usuário digita
		setErrors({ ...errors, [name]: "" });
	};

	const handleSubmit = (e) => {
		e.preventDefault();

		let validationErrors = {};
		if (!validateEmail(user.email)) {
			validationErrors.email = "Email inválido";
		}
		if (!validatePassword(user.password)) {
			validationErrors.password = "A senha deve ter pelo menos 8 caracteres";
		}

		if (Object.keys(validationErrors).length > 0) {
			setErrors(validationErrors);
			return;
		}

		handleLogin(user);
	};

	return (
		<div className={classes.root}>
			<Container component="main" maxWidth="xs">
				<CssBaseline/>
				<div className={classes.paper}>
					<div>
						<img style={{ margin: "0 auto", width: "100%" }} src={logo} alt="Whats" />
					</div>
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
							error={!!errors.email}
							helperText={errors.email}
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
							error={!!errors.password}
							helperText={errors.password}
						/>
						
						<Grid container justify="flex-end">
							<Grid item xs={6} style={{ textAlign: "right" }}>
								<Link component={RouterLink} to="/forgetpsw" variant="body2">
									Esqueceu sua senha?
								</Link>
							</Grid>
						</Grid>
						
						<Button
							type="submit"
							fullWidth
							variant="contained"
							color="primary"
							className={classes.submit}
						>
							{i18n.t("login.buttons.submit")}
						</Button>

						<Grid container>
							<Grid item>
								<Link
									href="#"
									variant="body2"
									component={RouterLink}
									to="/signup"
								>
									{i18n.t("login.buttons.register")}
								</Link>
							</Grid>
						</Grid>
					</form>
				</div>
				<Box mt={5}>
					<Copyright />
				</Box>
			</Container>
		</div>
	);
};

export default Login;
