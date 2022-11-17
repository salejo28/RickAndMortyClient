import { api } from 'app/services/api/Api'
import { ICharacter } from 'app/types'
import Card from 'app/components/molecules/Card/Card'
import { Fragment, useCallback, useEffect, useState } from 'react'
import { TextField, Typography } from '@mui/material'
import { Point } from 'app/components/atoms/Point/Point'
import { Pagination } from 'app/components/molecules/Pagination/Pagination'

export const Characters = () => {
  const [characters, setCharacters] = useState<ICharacter[]>([])
  const [page, setPage] = useState<number>(1)
  const [lastPage, setLastPage] = useState<number>(1)
  const [search, setSearch] = useState<string>('')
  const [totalCharacters, setTotalCharacters] = useState<number>(0)

  const handleSearch = (value: string) => {
    setPage(1)
    setSearch(value)
  }

  const getCharacters = useCallback(async () => {
    const response = await api.getCharacters(page, search)
    setTotalCharacters(response.total)
    setPage(response.current_page)
    setLastPage(response.last_page)
    setCharacters(response.data)
  }, [page, search])

  useEffect(() => {
    getCharacters()
  }, [getCharacters])

  return (
    <Fragment>
      <Typography variant="h4" color={'#777'} mb={1}>
        Characters <small>({totalCharacters})</small>
      </Typography>
      <TextField
        type={'search'}
        label="Character Name"
        sx={{ width: '100%', mb: 3 }}
        value={search}
        onChange={({ target }) => handleSearch(target.value)}
      />
      <div className="content-cards">
        {characters.map((character) => (
          <Card key={character.id}>
            <Card.Image image={character.image} height="250" />
            <Card.Content>
              <Typography
                gutterBottom
                variant="h5"
                component="div"
                color={'peru'}
              >
                {character.name}
              </Typography>
              <Typography
                sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
              >
                <Point status={character.status} />
                {character.status} - {character.species}
              </Typography>
              <Typography
                sx={{
                  color: '#666',
                  fontSize: '14px',
                  textTransform: 'capitalize',
                }}
              >
                {character?.location?.name ?? 'Última ubicación desconocida'}
              </Typography>
              <Typography
                sx={{
                  color: 'peru',
                  textTransform: 'capitalize',
                  fontSize: '14px',
                }}
              >
                {character?.origin?.name ?? 'Origen desconocido'}
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
