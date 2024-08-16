import { useState } from "react";

const useOpen = () => {
  const [open, setOpen] = useState(false);
  const handleOepn = () => setOpen(true);
  const handleClose = () => setOpen(false);
  return [open, handleOepn, handleClose];
};

export default useOpen;
