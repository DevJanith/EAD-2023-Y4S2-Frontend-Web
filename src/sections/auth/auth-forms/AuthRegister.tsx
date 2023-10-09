import { SyntheticEvent, useEffect, useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';

// material-ui
import {
  Autocomplete,
  Box,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Grid,
  InputAdornment,
  InputLabel,
  Link,
  OutlinedInput,
  Stack,
  TextField,
  Typography
} from '@mui/material';
import { useTheme } from '@mui/material/styles';

// third party
import { Formik } from 'formik';
import * as Yup from 'yup';

// project import
import AnimateButton from 'components/@extended/AnimateButton';
import IconButton from 'components/@extended/IconButton';

import useAuth from 'hooks/useAuth';
import useScriptRef from 'hooks/useScriptRef';
import { dispatch } from 'store';
import { openSnackbar } from 'store/reducers/snackbar';
import { strengthColor, strengthIndicator } from 'utils/password-strength';

// types
import { StringColorProps } from 'types/password';

// assets
import { EyeInvisibleOutlined, EyeOutlined } from '@ant-design/icons';
import { Divider } from '@mui/material';
import salutations, { SalutationsType } from 'data/salutations';

// ============================|| JWT - REGISTER ||============================ //

const AuthRegister = () => {
  const theme = useTheme();
  const { signUp } = useAuth();
  const scriptedRef = useScriptRef();
  const navigate = useNavigate();

  const [level, setLevel] = useState<StringColorProps>();
  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event: SyntheticEvent) => {
    event.preventDefault();
  };

  const changePassword = (value: string) => {
    const temp = strengthIndicator(value);
    setLevel(strengthColor(temp));
  };

  useEffect(() => {
    changePassword('');
  }, []);

  return (
    <>
      <Formik
        initialValues={{
          id: undefined,
          salutation: undefined,
          firstName: "",
          lastName: "",
          contactNumber: "",
          email: "",
          nic: "",
          userType: undefined,
          password: "",
          confirmPassword: "",
          isTravelAgent: false,
          submit: null
        }}
        validationSchema={Yup.object().shape({
          salutation: Yup.number().required("Salutation is required"),
          firstName: Yup.string().required("First name is required"),
          lastName: Yup.string().required("Last name is required"),
          contactNumber: Yup.string()
            .matches(/^(?:\+94|0)[1-9][0-9]{8}$/, "Invalid Sri Lankan phone number")
            .required("Contact Number is required"),
          email: Yup.string().email("Invalid email address").required("Email is required"),
          nic: Yup.string()
            .matches(/^[0-9]{9}[vVxX]?$|^[0-9]{12}$/i, "Invalid NIC format")
            .required("NIC is required"), 
        })}
        onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
          console.log("here");

          try {
            if (values.isTravelAgent) {
              await signUp(values.nic, values.email, values.password, 2, values.salutation!, values.firstName, values.lastName, values.contactNumber, values.confirmPassword);
            } else {
              await signUp(values.nic, values.email, values.password, 3, values.salutation!, values.firstName, values.lastName, values.contactNumber, values.confirmPassword);
            }
            if (scriptedRef.current) {
              setStatus({ success: true });
              setSubmitting(false);
              dispatch(
                openSnackbar({
                  open: true,
                  message: 'Your registration has been successfully completed.',
                  variant: 'alert',
                  alert: {
                    color: 'success'
                  },
                  close: false
                })
              );

              setTimeout(() => {
                navigate('/login', { replace: true });
              }, 1500);
            }
          } catch (err: any) {
            console.error(err);
            if (scriptedRef.current) {
              setStatus({ success: false });
              setErrors({ submit: err.message });
              setSubmitting(false);
            }
          }
        }}
      >
        {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values, getFieldProps, setFieldValue }) => (
          <form noValidate onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Divider sx={{ my: 1 }} />
                <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                  <Stack spacing={0.5}>
                    <Typography variant="subtitle1">Travel  Agent</Typography>
                    <Typography variant="caption" color="textSecondary">
                      If you are a travel agent, check this box to create a travel agent account. Your account will be approved by our back office.
                    </Typography>
                  </Stack>
                  <FormControlLabel
                    control={
                      <Checkbox
                        {...getFieldProps('isTravelAgent')}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        checked={values.isTravelAgent}
                        sx={{ mt: 0 }}
                      />
                    }
                    label=""
                    labelPlacement="start"
                  />
                </Stack>
                <Divider sx={{ my: 0 }} />
              </Grid>
              <Grid item xs={12} md={12}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="nic-signup">NIC *</InputLabel>
                  <OutlinedInput
                    id="nic-login"
                    type="nic"
                    value={values.nic}
                    name="nic"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    placeholder="Enter NIC"
                    fullWidth
                    error={Boolean(touched.nic && errors.nic)}
                  />
                  {touched.nic && errors.nic && (
                    <FormHelperText error id="helper-text-nic-signup">
                      {errors.nic}
                    </FormHelperText>
                  )}
                </Stack>
              </Grid>
              <Grid item xs={12} md={4}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="salutation-signup">Salutation *</InputLabel>
                  <Autocomplete
                    fullWidth
                    id="salutation"
                    value={salutations.find((option) => option.id === values.salutation) || null}
                    onChange={(event: any, newValue: SalutationsType | null) => {
                      setFieldValue('salutation', newValue?.id);
                    }}
                    options={salutations}
                    getOptionLabel={(item) => `${item.description}`}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        placeholder="Select Salutation"
                        sx={{ '& .MuiAutocomplete-input.Mui-disabled': { WebkitTextFillColor: theme.palette.text.primary } }}
                      />
                    )}
                  />
                  {touched.salutation && errors.salutation && (
                    <FormHelperText error id="helper-text-salutation">
                      {errors.salutation}
                    </FormHelperText>
                  )}
                </Stack>
              </Grid>
              <Grid item xs={12} md={8}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="firstName-signup">First Name*</InputLabel>
                  <OutlinedInput
                    id="firstName-login"
                    type="firstName"
                    value={values.firstName}
                    name="firstName"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    placeholder="Enter First Name"
                    fullWidth
                    error={Boolean(touched.firstName && errors.firstName)}
                  />
                  {touched.firstName && errors.firstName && (
                    <FormHelperText error id="helper-text-firstName-signup">
                      {errors.firstName}
                    </FormHelperText>
                  )}
                </Stack>
              </Grid>
              <Grid item xs={12} md={12}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="lastName-signup">Last Name*</InputLabel>
                  <OutlinedInput
                    fullWidth
                    error={Boolean(touched.lastName && errors.lastName)}
                    id="lastName-signup"
                    type="lastName"
                    value={values.lastName}
                    name="lastName"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    placeholder="Enter Last Name"
                    inputProps={{}}
                  />
                  {touched.lastName && errors.lastName && (
                    <FormHelperText error id="helper-text-lastName-signup">
                      {errors.lastName}
                    </FormHelperText>
                  )}
                </Stack>
              </Grid>
              <Grid item xs={12}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="contactNumber-signup">Contact Number</InputLabel>
                  <OutlinedInput
                    fullWidth
                    error={Boolean(touched.contactNumber && errors.contactNumber)}
                    id="contactNumber-signup"
                    value={values.contactNumber}
                    name="contactNumber"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    placeholder="Enter Contact Number"
                    inputProps={{}}
                  />
                  {touched.contactNumber && errors.contactNumber && (
                    <FormHelperText error id="helper-text-contactNumber-signup">
                      {errors.contactNumber}
                    </FormHelperText>
                  )}
                </Stack>
              </Grid>
              <Grid item xs={12}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="email-signup">Email Address*</InputLabel>
                  <OutlinedInput
                    fullWidth
                    error={Boolean(touched.email && errors.email)}
                    id="email-login"
                    type="email"
                    value={values.email}
                    name="email"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    placeholder="Enter Email Address"
                    inputProps={{}}
                  />
                  {touched.email && errors.email && (
                    <FormHelperText error id="helper-text-email-signup">
                      {errors.email}
                    </FormHelperText>
                  )}
                </Stack>
              </Grid>
              <Grid item xs={12}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="password-signup">Password</InputLabel>
                  <OutlinedInput
                    fullWidth
                    error={Boolean(touched.password && errors.password)}
                    id="password-signup"
                    type={showPassword ? 'text' : 'password'}
                    value={values.password}
                    name="password"
                    onBlur={handleBlur}
                    onChange={(e) => {
                      handleChange(e);
                      changePassword(e.target.value);
                    }}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowPassword}
                          onMouseDown={handleMouseDownPassword}
                          edge="end"
                          color="secondary"
                        >
                          {showPassword ? <EyeOutlined /> : <EyeInvisibleOutlined />}
                        </IconButton>
                      </InputAdornment>
                    }
                    placeholder="******"
                    inputProps={{}}
                  />
                  {touched.password && errors.password && (
                    <FormHelperText error id="helper-text-password-signup">
                      {errors.password}
                    </FormHelperText>
                  )}
                </Stack>
                <FormControl fullWidth sx={{ mt: 2 }}>
                  <Grid container spacing={2} alignItems="center">
                    <Grid item>
                      <Box sx={{ bgcolor: level?.color, width: 85, height: 8, borderRadius: '7px' }} />
                    </Grid>
                    <Grid item>
                      <Typography variant="subtitle1" fontSize="0.75rem">
                        {level?.label}
                      </Typography>
                    </Grid>
                  </Grid>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="body2">
                  By Signing up, you agree to our &nbsp;
                  <Link variant="subtitle2" component={RouterLink} to="#">
                    Terms of Service
                  </Link>
                  &nbsp; and &nbsp;
                  <Link variant="subtitle2" component={RouterLink} to="#">
                    Privacy Policy
                  </Link>
                </Typography>
              </Grid>
              {errors.submit && (
                <Grid item xs={12}>
                  <FormHelperText error>{errors.submit}</FormHelperText>
                </Grid>
              )}
              <Grid item xs={12}>
                <AnimateButton>
                  <Button disableElevation disabled={isSubmitting} fullWidth size="large" type="submit" variant="contained" color="primary">
                    Create Account
                  </Button>
                </AnimateButton>
              </Grid>
            </Grid>
          </form>
        )}
      </Formik>
    </>
  );
};

export default AuthRegister;
