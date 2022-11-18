import { api } from 'app/services/api/Api'
import { ICharacter, IEpisode } from 'app/types'
import Card from 'app/components/molecules/Card/Card'
import React, {
  Fragment,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react'
import {
  Autocomplete,
  Box,
  Button,
  CardActions,
  IconButton,
  TextField,
  Typography,
} from '@mui/material'
import { Pagination } from 'app/components/molecules/Pagination/Pagination'
import { Modal } from 'app/components/molecules/Modal/Modal'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { formatDate } from 'app/utils'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { handleError } from 'app/common/errors'
import { Delete, Edit } from '@mui/icons-material'

interface IValues {
  name: string
  air_date: Date
  episode: string
  characters: ICharacter[]
}

const INITIAL_VALUES: IValues = {
  name: '',
  air_date: new Date(),
  episode: '',
  characters: [],
}
const MySwal = withReactContent(Swal)

export const Episodes = () => {
  const [episodes, setEpisodes] = useState<IEpisode[]>([])
  const [page, setPage] = useState<number>(1)
  const [lastPage, setLastPage] = useState<number>(1)
  const [search, setSearch] = useState<string>('')
  const [totalEpisodes, setTotalEpisodes] = useState<number>(0)
  const [openModal, setOpenModal] = useState<boolean>(false)
  const [values, setValues] = useState<IValues>(INITIAL_VALUES)
  const [characterValue, setCharacterValue] = useState<string>('')
  const [characters, setCharacters] = useState<ICharacter[]>([])
  const [edit, setEdit] = useState<boolean>(false)
  const [episodeId, setEpisodeId] = useState<number>(0)

  const handleSearch = (value: string) => {
    setPage(1)
    setSearch(value)
  }

  const getResidentImages = (location: IEpisode): JSX.Element => {
    const images = location.characters.slice(0, 4).map((url) => {
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

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const data = {
      ...values,
      air_date: formatDate(values.air_date),
      characters: values.characters.map((character) => character.url),
    }
    try {
      if (!edit) {
        const response = await api.saveEpisode(data)
        if (!response.success) {
          handleError(response.errors)
          return
        }
        getEpisodes()
        handleCloseModal()

        MySwal.fire({
          position: 'top-end',
          icon: 'success',
          title: 'Episode Created',
          showConfirmButton: false,
          timer: 1500,
        })

        return
      }

      const response = await api.editEpisode(episodeId, data)
      if (!response.success) {
        handleError(response.errors)
        return
      }

      getEpisodes()
      handleCloseModal()

      MySwal.fire({
        position: 'top-end',
        icon: 'success',
        title: 'Episode Edited',
        showConfirmButton: false,
        timer: 1500,
      })
    } catch (error) {
      MySwal.fire({
        icon: 'error',
        title: 'Ops..., something is wrong',
      })
    }
  }

  const handleEdit = async (episode: IEpisode) => {
    setEdit(true)
    setEpisodeId(episode.id)
    const characters = await Promise.all(
      episode.characters.map(async (url) => {
        const response = await fetch(url)
        return await response.json()
      })
    )

    setValues({
      episode: episode.episode,
      name: episode.name,
      air_date: new Date(episode.air_date),
      characters,
    })
    setOpenModal(true)
  }

  const handleCloseModal = () => {
    setOpenModal(false)
    setValues(INITIAL_VALUES)
  }

  const handleDelete = async (id: number) => {
    try {
      const response = await api.deleteEpisode(id)
      await getEpisodes()
      MySwal.fire({
        position: 'top-end',
        icon: 'success',
        title: response.message,
        showConfirmButton: false,
        timer: 1500,
      })
    } catch (error) {
      MySwal.fire({
        icon: 'error',
        title: 'Ops..., something is wrong',
      })
    }
  }

  const handleChange = (name: string, value: Date | string | ICharacter[]) => {
    setValues((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const getCharacters = useCallback(async () => {
    const response = await api.getCharacters(1, characterValue)
    setCharacters(response.data)
  }, [characterValue])

  const getEpisodes = useCallback(async () => {
    const response = await api.getEpisodes(page, search)
    setTotalEpisodes(response.total)
    setPage(response.current_page)
    setLastPage(response.last_page)
    setEpisodes(response.data)
  }, [page, search])

  useEffect(() => {
    getEpisodes()
  }, [getEpisodes])

  useEffect(() => {
    getCharacters()
  }, [getCharacters])

  const form = [
    {
      label: 'Name',
      name: 'name',
      type: 'text',
    },
    {
      label: 'Air Date',
      name: 'air_date',
      type: 'date',
    },
    {
      label: 'Episode',
      name: 'episode',
      type: 'text',
    },
    {
      label: 'Characters',
      name: 'characters',
      type: 'multiple-autocomplete',
      options: characters,
    },
  ]

  return (
    <Fragment>
      <Modal open={openModal} close={handleCloseModal}>
        <>
          <form onSubmit={onSubmit}>
            <div className="grid-responsive">
              {form.map((field) => {
                const { label, name, type, options } = field
                const value = values[name as keyof IValues]
                if (type === 'date') {
                  return (
                    <LocalizationProvider dateAdapter={AdapterDayjs} key={name}>
                      <DatePicker
                        label={label}
                        value={value}
                        onChange={(newValue) => {
                          handleChange(name, newValue ?? new Date())
                        }}
                        renderInput={(params) => <TextField {...params} />}
                        maxDate={new Date()}
                      />
                    </LocalizationProvider>
                  )
                }

                if (type === 'multiple-autocomplete') {
                  return (
                    <Autocomplete
                      key={name}
                      multiple
                      options={options ?? []}
                      onChange={(_, v) => handleChange(name, v)}
                      getOptionLabel={(option) => option.name}
                      value={value as ICharacter[]}
                      filterSelectedOptions
                      inputValue={characterValue}
                      onInputChange={(_, v) => setCharacterValue(v)}
                      renderInput={(params) => (
                        <TextField {...params} label={label} name={name} />
                      )}
                    />
                  )
                }

                return (
                  <TextField
                    key={name}
                    label={label}
                    name={name}
                    value={value}
                    onChange={({ target }) => handleChange(name, target.value)}
                  />
                )
              })}
            </div>
            <Button
              variant={'contained'}
              sx={{ mt: 2, width: '100%' }}
              type={'submit'}
            >
              Save
            </Button>
          </form>
        </>
      </Modal>
      <Box
        mb={1}
        display={'flex'}
        justifyContent={'space-between'}
        alignItems={'center'}
      >
        <Typography variant="h4" color={'#777'}>
          Episodes <small>({totalEpisodes})</small>
        </Typography>
        <Button variant="contained" onClick={() => setOpenModal(true)}>
          New
        </Button>
      </Box>
      <TextField
        type={'search'}
        label="Episode Name"
        sx={{ width: '100%', mb: 3 }}
        value={search}
        onChange={({ target }) => handleSearch(target.value)}
      />
      <div className="content-cards">
        {episodes.map((episode) => (
          <Card key={episode.id}>
            {getResidentImages && getResidentImages(episode)}
            <Card.Content>
              <Typography
                gutterBottom
                variant="h5"
                component="div"
                color={'peru'}
              >
                {episode.name}
              </Typography>
              <Typography
                sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
              >
                {episode.episode}
              </Typography>
              <Typography
                sx={{
                  color: '#666',
                  fontSize: '14px',
                  textTransform: 'capitalize',
                }}
              >
                Fecha de emisión
              </Typography>
              <Typography
                sx={{
                  color: 'peru',
                  textTransform: 'capitalize',
                  fontSize: '14px',
                }}
              >
                {episode.air_date}
              </Typography>
            </Card.Content>
            <CardActions disableSpacing>
              <IconButton
                onClick={() => handleDelete(episode.id)}
                color={'error'}
              >
                <Delete />
              </IconButton>
              <IconButton color={'primary'} onClick={() => handleEdit(episode)}>
                <Edit />
              </IconButton>
            </CardActions>
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
