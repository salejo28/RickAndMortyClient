import { api } from 'app/services/api/Api'
import { ILocation } from 'app/types'
import Card from 'app/components/molecules/Card/Card'
import { Fragment, useCallback, useEffect, useState } from 'react'
import { TextField, Typography } from '@mui/material'
import { Pagination } from 'app/components/molecules/Pagination/Pagination'

export const Locations = () => {
  const [locations, setLocations] = useState<ILocation[]>([])
  const [page, setPage] = useState<number>(1)
  const [lastPage, setLastPage] = useState<number>(1)
  const [search, setSearch] = useState<string>('')
  const [totalLocations, setTotalLocations] = useState<number>(0)

  const handleSearch = (value: string) => {
    setPage(1)
    setSearch(value)
  }

  const getResidentImages = (location: ILocation): JSX.Element => {
    const images = location.residents.slice(0, 4).map((url) => {
      const id = url.split('/').slice(-1)[0]
      if (url.includes('rickandmortyapi')) {
        return `https://rickandmortyapi.com/api/character/avatar/${id}.jpeg`
      }

      return 'http://localhost:8000/storage'
    })

    if (images.length < 4) {
      Array(4 - images.length)
        .fill('')
        .forEach((_, i) => {
          images.push('dont-avatar.jpeg')
        })
    }

    return (
      <div className="content-images-grid">
        {images.map((image, i) => {
          return <Card.Image image={image} key={i} />
        })}
      </div>
    )
  }

  const getLocations = useCallback(async () => {
    const response = await api.getLocations(page, search)
    setTotalLocations(response.total)
    setPage(response.current_page)
    setLastPage(response.last_page)
    setLocations(response.data)
  }, [page, search])

  useEffect(() => {
    getLocations()
  }, [getLocations])

  return (
    <Fragment>
      <Typography variant="h4" color={'#777'} mb={1}>
        Locations <small>({totalLocations})</small>
      </Typography>
      <TextField
        type={'search'}
        label="Location Name"
        sx={{ width: '100%', mb: 3 }}
        value={search}
        onChange={({ target }) => handleSearch(target.value)}
      />
      <div className="content-cards">
        {locations.map((location) => (
          <Card key={location.id}>
            {getResidentImages && getResidentImages(location)}
            <Card.Content>
              <Typography
                gutterBottom
                variant="h5"
                component="div"
                color={'peru'}
              >
                {location.name}
              </Typography>
              <Typography
                sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
              >
                {location.type}
              </Typography>
              <Typography
                sx={{
                  color: '#666',
                  fontSize: '14px',
                  textTransform: 'capitalize',
                }}
              >
                Dimensión
              </Typography>
              <Typography
                sx={{
                  color: 'peru',
                  textTransform: 'capitalize',
                  fontSize: '14px',
                }}
              >
                {location.dimension}
              </Typography>
            </Card.Content>
          </Card>
        ))}
      </div>
      <Pagination
        page={page}
        count={lastPage}
        handleChange={(page) => setPage(page)}
      />
    </Fragment>
  )
}
