import { api } from 'app/services/api/Api'
import { ICharacter, ILocation } from 'app/types'
import Card from 'app/components/molecules/Card/Card'
import React, { Fragment, useCallback, useEffect, useState } from 'react'
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
import resource from 'app/resources/resources.json'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { handleError } from 'app/common/errors'
import { Delete, Edit } from '@mui/icons-material'

interface IValues {
  name: string
  type: string
  dimension: string
  residents: ICharacter[]
}

const INITIAL_VALUES: IValues = {
  name: '',
  type: '',
  dimension: '',
  residents: [],
}
const MySwal = withReactContent(Swal)

const TYPES = resource.locations.type
const DIMENSIONS = resource.locations.dimensions

export const Locations = () => {
  const [locations, setLocations] = useState<ILocation[]>([])
  const [page, setPage] = useState<number>(1)
  const [lastPage, setLastPage] = useState<number>(1)
  const [search, setSearch] = useState<string>('')
  const [totalLocations, setTotalLocations] = useState<number>(0)
  const [openModal, setOpenModal] = useState<boolean>(false)
  const [values, setValues] = useState<IValues>(INITIAL_VALUES)
  const [characterValue, setCharacterValue] = useState<string>('')
  const [characters, setCharacters] = useState<ICharacter[]>([])
  const [edit, setEdit] = useState<boolean>(false)
  const [locationId, setLocationId] = useState<number>(0)

  const handleSearch = (value: string) => {
    setPage(1)
    setSearch(value)
  }

  const handleChange = (name: string, value: string | ICharacter[]) => {
    setValues((prev) => ({
      ...prev,
      [name]: value,
    }))
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const data = {
      ...values,
      residents: values.residents.map((resident) => resident.url),
    }

    try {
      if (edit) {
        const response = await api.editLocation(locationId, data)
        if (!response.success) {
          handleError(response.errors)
          return
        }

        getLocations()
        handleClose()

        MySwal.fire({
          position: 'top-end',
          icon: 'success',
          title: 'Location Edited',
          showConfirmButton: false,
          timer: 1500,
        })
        return
      }
      const response = await api.createLocation(data)
      if (!response.success) {
        handleError(response.errors)
        return
      }

      getLocations()
      handleClose()

      MySwal.fire({
        position: 'top-end',
        icon: 'success',
        title: 'Location Created',
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

  const handleClose = () => {
    setOpenModal(false)
    setValues(INITIAL_VALUES)
  }

  const handleDelete = async (id: number) => {
    try {
      const response = await api.deleteLocation(id)
      await getLocations()
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

  const handleEdit = async (location: ILocation) => {
    setEdit(true)
    setLocationId(location.id)
    const residents = await Promise.all(
      location.residents.map(async (resident) => {
        const response = await fetch(resident)
        return await response.json()
      })
    )

    setValues({
      name: location.name,
      dimension: location.dimension,
      residents,
      type: location.type,
    })
    setOpenModal(true)
  }

  const getCharacters = useCallback(async () => {
    const response = await api.getCharacters(1, characterValue)
    setCharacters(response.data)
  }, [characterValue])

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
      label: 'Type',
      name: 'type',
      type: 'autocomplete',
      options: TYPES,
    },
    {
      label: 'Dimension',
      name: 'dimension',
      type: 'autocomplete',
      options: DIMENSIONS,
    },
    {
      label: 'Residents',
      name: 'residents',
      type: 'multiple-autocomplete',
      options: characters,
    },
  ]

  return (
    <Fragment>
      <Modal open={openModal} close={handleClose}>
        <form onSubmit={handleSubmit}>
          <div className="grid-responsive">
            {form.map((field) => {
              const { label, name, type, options } = field
              const value = values[name as keyof IValues]

              if (type === 'autocomplete') {
                return (
                  <Autocomplete
                    key={name}
                    options={(options as string[]) ?? []}
                    onChange={(_, v) => handleChange(name, v ?? '')}
                    getOptionLabel={(option) => option}
                    value={value as string}
                    filterSelectedOptions
                    renderInput={(params) => (
                      <TextField {...params} label={label} name={name} />
                    )}
                  />
                )
              }

              if (type === 'multiple-autocomplete') {
                return (
                  <Autocomplete
                    key={name}
                    multiple
                    options={(options as ICharacter[]) ?? []}
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
      </Modal>
      <Box
        mb={1}
        display={'flex'}
        justifyContent={'space-between'}
        alignItems={'center'}
      >
        <Typography variant="h4" color={'#777'} mb={1}>
          Locations <small>({totalLocations})</small>
        </Typography>
        <Button variant="contained" onClick={() => setOpenModal(true)}>
          New
        </Button>
      </Box>
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
            <CardActions disableSpacing>
              <IconButton
                onClick={() => handleDelete(location.id)}
                color={'error'}
              >
                <Delete />
              </IconButton>
              <IconButton
                color={'primary'}
                onClick={() => handleEdit(location)}
              >
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
