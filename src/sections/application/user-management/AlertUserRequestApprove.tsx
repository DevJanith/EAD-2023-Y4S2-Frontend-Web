// material-ui
import { Button, Dialog, DialogContent, Stack, Typography } from '@mui/material';

// project import
import Avatar from 'components/@extended/Avatar';
import { PopupTransition } from 'components/@extended/Transitions';

// assets
import { InfoCircleOutlined } from '@ant-design/icons';
import { dispatch } from 'store';
import { updateUserRequest } from 'store/reducers/user-request';
import { UserRequest } from 'types/user-request';

// types
interface Props {
  title: string;
  open: boolean;
  handleClose: (status: boolean) => void;
  userRequest?: UserRequest;
}

// ==============================|| User Request - APPROVE ||============================== //

export default function AlertUserRequestApprove({ title, open, handleClose, userRequest }: Props) {

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
          <Avatar color="info" sx={{ width: 72, height: 72, fontSize: '1.75rem' }}>
            <InfoCircleOutlined />
          </Avatar>
          <Stack spacing={2}>
            <Typography variant="h4" align="center">
              Are you sure you want to Approve?
            </Typography>
          </Stack>

          <Stack direction="row" spacing={2} sx={{ width: 1 }}>
            <Button fullWidth onClick={() => handleClose(false)} color="secondary" variant="outlined">
              Cancel
            </Button>
            <Button fullWidth color="info" variant="contained" onClick={() => {
              //PUT API call
              dispatch(updateUserRequest({
                ...userRequest,
                id: userRequest?.id,
                nic: userRequest?.nic,
                remark: userRequest?.remark,
                status: "APPROVED"
              }))
              handleClose(true)
            }} autoFocus>
              Approve
            </Button>
          </Stack>
        </Stack>
      </DialogContent>
    </Dialog >
  );
}
