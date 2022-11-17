import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'

export default class Base {
  private url: string
  private service: AxiosInstance
  private config: AxiosRequestConfig | undefined

  constructor(config?: AxiosRequestConfig) {
    this.url = 'http://localhost:8000/api'
    this.config = config
    this.service = axios.create({
      baseURL: this.url,
    })
  }

  async apiCall(request: () => Promise<AxiosResponse>) {
    try {
      return (await request()).data
    } catch (error: any) {
      return error?.response?.data
    }
  }

  async get(to: string) {
    return await this.apiCall(() => this.service.get(to, this.config ?? {}))
  }

  async post(to: string, data: unknown) {
    return await this.apiCall(() =>
      this.service.post(to, data, this.config ?? {})
    )
  }

  async put(to: string, data: unknown) {
    return await this.apiCall(() =>
      this.service.put(to, data, this.config ?? {})
    )
  }

  async delete(to: string) {
    return await this.apiCall(() => this.service.delete(to, this.config ?? {}))
  }
}
