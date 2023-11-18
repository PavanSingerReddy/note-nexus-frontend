import httpRequestAxiosQueueUtility from "./HttpRequestAxiosQueueUtility"

// This getNotesPage variable contains the notes array which we got from the network request to the backend server.here the default value of pageParam is 0 and options default value is an empty object
const getNotesPage =async (pageParam=0,options={}) => {

    const response = await httpRequestAxiosQueueUtility.get(`${import.meta.env.VITE_Paged_URL}?page=${pageParam}`,options)
    return response.data

}

export default getNotesPage