import { AxiosRequestConfig } from 'axios'
import Base from './base/base'

class Api {
  private config: AxiosRequestConfig = {
    headers: {
      'Content-Type': 'application/json',
    },
  }
  private base: Base

  constructor() {
    this.base = new Base(this.config)
  }

  async getCharacters(page: number, search?: string) {
    return await this.base.get(
      `/characters?page=${page}${
        search && search.trim() ? `&search=${search}` : ''
      }`
    )
  }

  async getEpisodes(page: number, search?: string) {
    return await this.base.get(
      `/episodes?page=${page}${
        search && search.trim() ? `&search=${search}` : ''
      }`
    )
  }

  async getLocations(page: number, search?: string) {
    return await this.base.get(
      `/locations?page=${page}${
        search && search.trim() ? `&search=${search}` : ''
      }`
    )
  }

  async saveEpisode(data: unknown) {
    return await this.base.post('/episodes', data)
  }

  async editEpisode(id: number, data: unknown) {
    return await this.base.put(`/episodes/${id}`, data)
  }

  async deleteEpisode(id: number) {
    return await this.base.delete(`/episodes/${id}`)
  }

  async createLocation(data: unknown) {
    return await this.base.post('/locations', data)
  }

  async editLocation(id: number, data: unknown) {
    return await this.base.put(`/locations/${id}`, data)
  }

  async deleteLocation(id: number) {
    return await this.base.delete(`/locations/${id}`)
  }
}

const api = new Api()

export { api }
