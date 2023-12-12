import httpRequestAxiosQueueUtility from "./HttpRequestAxiosQueueUtility"


const getNotesPage = async (pageParam = 0, options = {}) => {

    const response = await httpRequestAxiosQueueUtility.get(`${import.meta.env.VITE_Paged_URL}?page=${pageParam}`, options)
    return response.data

}

export default getNotesPage