// material-ui
import { Button, Dialog, DialogContent, Stack, Typography } from '@mui/material';

// project import
import Avatar from 'components/@extended/Avatar';
import { PopupTransition } from 'components/@extended/Transitions';

// assets
import { PullRequestOutlined } from '@ant-design/icons';
import { dispatch } from 'store';
import { addUserRequest } from 'store/reducers/user-request';

// types
interface Props {
  title: string;
  open: boolean;
  handleClose: (status: boolean) => void;
  nic?: string;
}

// ==============================|| User Request ||============================== //

export default function AlertUserRequest({ title, open, handleClose, nic }: Props) {

  return (
    <Dialog
      open={open}
      onClose={() => handleClose(false)}
      keepMounted
      TransitionComponent={PopupTransition}
      maxWidth="xs"
      aria-labelledby="column-delete-title"
      aria-describedby="column-delete-description"
    >
      <DialogContent sx={{ mt: 2, my: 1 }}>
        <Stack alignItems="center" spacing={3.5}>
          <Avatar color="warning" sx={{ width: 72, height: 72, fontSize: '1.75rem' }}>
            <PullRequestOutlined />
          </Avatar>
          <Stack spacing={2}>
            <Typography variant="h4" align="center">
              Place a request to enable you're profile ?
            </Typography>
            <Typography align="center"> 
              you're user profile is in-active state, Please place a request to re activate.
            </Typography>
          </Stack>

          <Stack direction="row" spacing={2} sx={{ width: 1 }}>
            <Button fullWidth onClick={() => handleClose(false)} color="secondary" variant="outlined">
              Cancel
            </Button>
            <Button fullWidth color="warning" variant="contained" onClick={() => {
              //POST API call
              dispatch(addUserRequest({ nic: nic }))
              handleClose(true)
            }} autoFocus>
              Ok
            </Button>
          </Stack>
        </Stack>
      </DialogContent>
    </Dialog >
  );
}
