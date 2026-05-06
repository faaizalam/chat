import apiClient from "../apiClient";


export const fetchBuses = async (from: string, to: string, date: string) => {
    try {
        const { data } = await apiClient.post('/bus/search', {
            from,
            to,
            date
        })
        return data?.data || []

    } catch (error) {
        const errMessage =
            error instanceof Error
                ? (error as any)?.response?.data?.message || error.message || 'Unknown error'
                : 'Unknown error';

        throw new Error(errMessage);
    }

}
export const fetchBuseDetails = async (busId: string) => {
    const { data } = await apiClient.get(`/bus/${busId}`)
    return data?.data || []

}

export const fetchUserTickets = async () => {
    const { data } = await apiClient.get('/ticket/my-tickets')
    return data?.tickets || []
}


export const bookTicket = async (busId: string, seatNumbers: number[], date: string) => {
    const { data } = await apiClient.post('/ticket/book', {
        busId,
        seats: seatNumbers,
        date
    })
    return data?.ticket || []
}