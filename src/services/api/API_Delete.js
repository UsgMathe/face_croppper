import { api } from ".";

export async function API_Delete(route, param) {
  return (
    await api.delete(route, {
      headers: {
        'Content-Type': 'application/json'
      },
      data: param
    })
      .then((response) => {
        return {
          ok: true,
          title: "Success",
          status: response.status,
          body: response.body,
          data: response.data
        }
      })
      .catch(error => {
        return {
          ok: false,
          error: error.message,
          title: error.message ?? "Error",
          subtitle: error?.response?.status,
          body: null
        }
      })
  )
}