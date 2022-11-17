import { Box, Modal as ModalMui, SxProps, Theme } from '@mui/material'

interface IProps {
  open: boolean
  children: JSX.Element | JSX.Element[]
  close: () => unknown
}

const style: SxProps<Theme> = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  borderRadius: 5,
}

export const Modal = ({ open, close, children }: IProps) => {
  return (
    <ModalMui open={open} onClose={close}>
      <Box sx={style}>{children}</Box>
    </ModalMui>
  )
}
