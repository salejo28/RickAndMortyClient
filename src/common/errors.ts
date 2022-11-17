import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

const MySwal = withReactContent(Swal)

export const handleError = (err: any) => {
  const errors = Object.keys(err)
    .map((key) => {
      return err[key]
    })
    .flat()
  MySwal.fire({
    icon: 'error',
    title: 'Ops...',
    html: `
          <ul>
            ${errors
              .map((error: string) => {
                return `<li>${error}</li>`
              })
              .join('')}
          </ul>
        `,
  })
}
