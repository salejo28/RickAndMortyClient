import { Link as LinkRouter } from 'react-router-dom'

interface IProps {
  to: string
  children: JSX.Element | JSX.Element[] | string
}

export const Link = ({ to, children }: IProps) => {
  return (
    <li>
      <LinkRouter to={to}>{children}</LinkRouter>
    </li>
  )
}
