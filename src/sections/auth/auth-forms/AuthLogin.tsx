import React, { useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';

// material-ui
import {
  Button,
  Checkbox,
  FormControlLabel,
  FormHelperText,
  Grid,
  InputAdornment,
  InputLabel,
  Link,
  OutlinedInput,
  Stack,
  Typography
} from '@mui/material';

// third party
import { Formik } from 'formik';
import * as Yup from 'yup';

// project import
import AnimateButton from 'components/@extended/AnimateButton';
import IconButton from 'components/@extended/IconButton';

import useAuth from 'hooks/useAuth';
import useScriptRef from 'hooks/useScriptRef';

// assets
import { EyeInvisibleOutlined, EyeOutlined } from '@ant-design/icons';
import AlertUserRequest from './AlertUserRequest';
import { useDispatch, useSelector } from 'store';
import { openSnackbar } from 'store/reducers/snackbar';
import { toInitialState } from 'store/reducers/user-request';

// regex
const nicRegex = /^[0-9]{9}(V|X)?|[0-9]{12}$/i;

// ============================|| JWT - LOGIN ||============================ //

const AuthLogin = ({ isDemo = false }: { isDemo?: boolean }) => {
  const [checked, setChecked] = React.useState(false);

  const { signIn } = useAuth();
  const scriptedRef = useScriptRef();

  const [showPassword, setShowPassword] = React.useState(false);
  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event: React.SyntheticEvent) => {
    event.preventDefault();
  };

  //alert model
  const [openAlert, setOpenAlert] = useState(false);
  const [userRequestNIC, setUserRequestNIC] = useState<string | undefined>()

  const handleAlertClose = () => {
    setOpenAlert(!openAlert);
  };

  const dispatch = useDispatch();
  const { error, success } = useSelector(state => state.userRequest);


  //  handel error 
  useEffect(() => {
    if (error != null) {       
      dispatch(
        openSnackbar({
          open: true,
          //@ts-ignore
          message: error ? error.message : "Something went wrong ...",
          variant: 'alert',
          alert: {
            color: 'error'
          },
          close: true
        })
      );
      dispatch(toInitialState())
    }
  }, [error])

  //  handel success
  useEffect(() => {
    if (success != null) {
      dispatch(
        openSnackbar({
          open: true,
          message: success,
          variant: 'alert',
          alert: {
            color: 'success'
          },
          close: true
        })
      );
      dispatch(toInitialState())
    }
  }, [success])

  return (
    <>
      <Formik
        initialValues={{
          nic: '200102402806',
          password: 'janith',
          submit: null
        }}
        validationSchema={Yup.object().shape({
          nic: Yup.string()
            .matches(nicRegex, 'NIC must be 9 or 12 digits and may end with V or X (case insensitive)')
            .required('NIC is required'),
          password: Yup.string().max(255).required('Password is required')
        })}
        onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
          try {
            await signIn(values.nic, values.password);
            if (scriptedRef.current) {
              setStatus({ success: true });
              setSubmitting(false);
            }
          } catch (err: any) {
            console.error(err);
            if (err.message == "User Is In-Active") {
              setOpenAlert(true)
              setUserRequestNIC(values.nic)
            }
            if (scriptedRef.current) {
              setStatus({ success: false });
              setErrors({ submit: err.message });
              setSubmitting(false);
            }
          }
        }}
      >
        {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
          <form noValidate onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="nic-login">NIC</InputLabel>
                  <OutlinedInput
                    id="nic-login"
                    type="nic"
                    value={values.nic}
                    name="nic"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    placeholder="Enter nic address"
                    fullWidth
                    error={Boolean(touched.nic && errors.nic)}
                  />
                  {touched.nic && errors.nic && (
                    <FormHelperText error id="standard-weight-helper-text-nic-login">
                      {errors.nic}
                    </FormHelperText>
                  )}
                </Stack>
              </Grid>
              <Grid item xs={12}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="password-login">Password</InputLabel>
                  <OutlinedInput
                    fullWidth
                    error={Boolean(touched.password && errors.password)}
                    id="-password-login"
                    type={showPassword ? 'text' : 'password'}
                    value={values.password}
                    name="password"
                    onBlur={handleBlur}
                    onChange={handleChange}
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
                    placeholder="Enter password"
                  />
                  {touched.password && errors.password && (
                    <FormHelperText error id="standard-weight-helper-text-password-login">
                      {errors.password}
                    </FormHelperText>
                  )}
                </Stack>
              </Grid>

              <Grid item xs={12} sx={{ mt: -1 }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={checked}
                        onChange={(event) => setChecked(event.target.checked)}
                        name="checked"
                        color="primary"
                        size="small"
                      />
                    }
                    label={<Typography variant="h6">Keep me sign in</Typography>}
                  />
                  <Link variant="h6" component={RouterLink} to={isDemo ? '/auth/forgot-password' : '/forgot-password'} color="text.primary">
                    Forgot Password?
                  </Link>
                </Stack>
              </Grid>
              {errors.submit && (
                <Grid item xs={12}>
                  <FormHelperText error>{errors.submit}</FormHelperText>
                </Grid>
              )}
              <Grid item xs={12}>
                <AnimateButton>
                  <Button disableElevation disabled={isSubmitting} fullWidth size="large" type="submit" variant="contained" color="primary">
                    Login
                  </Button>
                </AnimateButton>
              </Grid>
            </Grid>
          </form>
        )}
      </Formik>
      {/* alert model */}
      {userRequestNIC && <AlertUserRequest title={""} open={openAlert} handleClose={handleAlertClose} nic={userRequestNIC} />}
    </>
  );
};

export default AuthLogin;
