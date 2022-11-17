import styles from './styles.module.css'

interface IProps {
  status: 'Alive' | 'Dead' | 'unknown'
}

export const Point = ({ status }: IProps) => {
  return <span className={`${styles.point} ${styles[status]}`} />
}
