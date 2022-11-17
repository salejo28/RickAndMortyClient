import { MONTHS } from 'app/constants'

export const formatDate = (d: string | Date | number): string => {
  const date = new Date(d)
  return `${MONTHS[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`
}
