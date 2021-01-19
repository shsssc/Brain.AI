import React from "react";
import Snackbar from "@material-ui/core/Snackbar";
import Alert from "@material-ui/lab/Alert";

export const Message = React.forwardRef((props, ref) => {
  const [open, setOpen] = React.useState(false);

  React.useImperativeHandle(ref, () => ({
    setOpen(open) {
      setOpen(open)
    }
  }));
  const handleClose = (event, reason) => {
    setOpen(false);
  };
  return (
    <Snackbar open={open} autoHideDuration={7000} onClose={handleClose}>
      <Alert onClose={handleClose} severity={props.severity}>{props.value}</Alert>
    </Snackbar>
  )
});
