import React, { useState, useEffect } from "react";
import qs from "query-string";
import * as Yup from "yup";
import { useHistory } from "react-router-dom";
import { Link as RouterLink } from "react-router-dom";
import { toast } from "react-toastify";
import { Formik, Form, Field } from "formik";
import {
  Avatar,
  Button,
  CssBaseline,
  TextField,
  Link,
  Grid,
  Box,
  Container,
  Typography,
  MenuItem,
  InputLabel,
  Select,
  makeStyles,
} from "@material-ui/core";
import InputMask from "react-input-mask";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import logo from "../../assets/logo.png";
import { i18n } from "../../translate/i18n";
import { openApi } from "../../services/api";
import toastError from "../../errors/toastError";
import usePlans from "../../hooks/usePlans";
import moment from "moment";

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: "100%",
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  logo: {
    margin: "0 auto",
    height: "80px",
    width: "100%",
  },
}));

const Copyright = () => (
  <Typography variant="body2" color="textSecondary" align="center">
    {"Copyright © "}
    <Link color="inherit" href="#">
      PLW
    </Link>{" "}
    {new Date().getFullYear()}
    {"."}
  </Typography>
);

const UserSchema = Yup.object().shape({
  name: Yup.string().min(2, "Muito curto!").max(50, "Muito longo!").required("Obrigatório"),
  password: Yup.string().min(5, "Muito curto!").max(50, "Muito longo!").required("Obrigatório"),
  email: Yup.string().email("E-mail inválido").required("Obrigatório"),
});

const SignUp = () => {
  const classes = useStyles();
  const history = useHistory();
  const [plans, setPlans] = useState([]);
  const { list: listPlans } = usePlans();
  const dueDate = moment().add(3, "days").format();

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const plans = await listPlans();
        setPlans(plans);
      } catch (error) {
        toastError(error);
      }
    };
    fetchPlans();
  }, [listPlans]);

  const handleSignUp = async (values) => {
    const payload = {
      ...values,
      recurrence: "MENSAL",
      dueDate,
      status: "t",
      campaignsEnabled: true,
    };

    try {
      await openApi.post("/companies/cadastro", payload);
      toast.success(i18n.t("signup.toasts.success"));
      history.push("/login");
    } catch (error) {
      toastError(error);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <img className={classes.logo} src={logo} alt="Logo" />
        <Formik
          initialValues={{ name: "", email: "", phone: "", password: "", planId: "" }}
          validationSchema={UserSchema}
          onSubmit={(values, actions) => {
            handleSignUp(values);
            actions.setSubmitting(false);
          }}
        >
          {({ touched, errors }) => (
            <Form className={classes.form}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Field
                    as={TextField}
                    name="name"
                    variant="outlined"
                    fullWidth
                    id="name"
                    label="Nome da Empresa"
                    error={touched.name && Boolean(errors.name)}
                    helperText={touched.name && errors.name}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Field
                    as={TextField}
                    name="email"
                    variant="outlined"
                    fullWidth
                    id="email"
                    label="E-mail"
                    error={touched.email && Boolean(errors.email)}
                    helperText={touched.email && errors.email}
                  />
                </Grid>
                <Grid item xs={12}>
                  <InputMask mask="(99) 99999-9999">
                    {() => (
                      <Field
                        as={TextField}
                        name="phone"
                        variant="outlined"
                        fullWidth
                        id="phone"
                        label="Telefone"
                      />
                    )}
                  </InputMask>
                </Grid>
                <Grid item xs={12}>
                  <Field
                    as={TextField}
                    name="password"
                    variant="outlined"
                    fullWidth
                    id="password"
                    label="Senha"
                    type="password"
                    error={touched.password && Boolean(errors.password)}
                    helperText={touched.password && errors.password}
                  />
                </Grid>
                <Grid item xs={12}>
                  <InputLabel htmlFor="plan-selection">Plano</InputLabel>
                  <Field
                    as={Select}
                    name="planId"
                    variant="outlined"
                    fullWidth
                    id="plan-selection"
                  >
                    {plans.map((plan) => (
                      <MenuItem key={plan.id} value={plan.id}>
                        {`${plan.name} - Atendentes: ${plan.users} - WhatsApp: ${plan.connections} - Filas: ${plan.queues} - R$ ${plan.value}`}
                      </MenuItem>
                    ))}
                  </Field>
                </Grid>
              </Grid>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
              >
                {i18n.t("signup.buttons.submit")}
              </Button>
              <Grid container justify="flex-end">
                <Grid item>
                  <Link component={RouterLink} to="/login" variant="body2">
                    {i18n.t("signup.buttons.login")}
                  </Link>
                </Grid>
              </Grid>
            </Form>
          )}
        </Formik>
      </div>
      <Box mt={5}>
        <Copyright />
      </Box>
    </Container>
  );
};

export default SignUp;
