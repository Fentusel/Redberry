import axios from 'axios'

export const getSessions = (params, signal) =>
    axios.get('https://api.kinoxii.redberryinternship.ge/api/sessions', { params, signal }).then((res) => res.data)

export const getFilterOptions = () =>
    axios.get('https://api.kinoxii.redberryinternship.ge/api/filter-options').then((res) => res.data)


