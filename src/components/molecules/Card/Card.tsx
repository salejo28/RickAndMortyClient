import { Card as CardMUI, CardMedia, SxProps, CardContent as CardContentMUI } from '@mui/material'
import { Theme } from '@mui/system'

interface IProps {
  children: JSX.Element | JSX.Element[]
  sx?: SxProps<Theme>
}

export const Card = ({ children, sx }: IProps) => {
  return <CardMUI sx={sx}>{children}</CardMUI>
}

interface IMediaCardProps {
  image: string
  height?: string
  alt?: string
  sx?: SxProps<Theme>
}

export const ImageCard = ({ image, alt, height, sx }: IMediaCardProps) => {
  return (
    <CardMedia
      component="img"
      height={height ?? '140'}
      image={image}
      alt={alt ?? 'Alt image card media'}
      sx={sx}
    />
  )
}

export const CardContent = ({ children, sx }: IProps) => {
  return <CardContentMUI sx={sx}>{children}</CardContentMUI>
}

interface ICardHOCProps {
  ({ children, sx }: IProps): JSX.Element
  Image: ({ image, alt, height, sx }: IMediaCardProps) => JSX.Element
  Content: ({ children, sx }: IProps) => JSX.Element
}

const CardComponent: ICardHOCProps = Object.assign(Card, {
  Image: ImageCard,
  Content: CardContent,
})

export default CardComponent
