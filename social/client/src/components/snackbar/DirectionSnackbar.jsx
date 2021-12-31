import * as React from 'react';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});


export default function DirectionSnackbar(props) {
  const [open, setOpen] = React.useState(false);
  const [message, setMessage] = React.useState('');
  const vertical= 'bottom';
  const horizontal= 'right';

  const handleClose = () => {
    setOpen(false);
  };

  React.useEffect(()=>{
    setMessage(props.message);
    setOpen(props.open);
  },[props])

  return (
    <Snackbar
      onClose={handleClose}
      open={open}
      autoHideDuration={props.autoHideDuration?props.autoHideDuration:5000}
      anchorOrigin={{ vertical, horizontal }}
      key={vertical + horizontal}
    >
      <Alert onClose={handleClose} severity={props.status} sx={{ width: '100%' }}>
        {message}
      </Alert>
    </Snackbar>
  );
}