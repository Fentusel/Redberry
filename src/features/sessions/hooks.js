import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { getFilterOptions, getSessions } from '../../api/sessionsApi'

export const KEYS = {
    venues: 'venues[]',
    formats: 'formats[]',
    languages: 'languages[]',
    timeBands: 'timeBands[]',
}

export const DEFAULT_SORT = 'time_asc'

export function useFilterOptions() {
    const [options, setOptions] = useState(null)

    useEffect(() => {
        getFilterOptions()
            .then((res) => {
                setOptions(res.data ?? res)
            })
            .catch((error) => {
                console.error(error)
            })
    }, [])

    return options
}

export function useSessions(searchParams) {
    const [data, setData] = useState([])
    const [meta, setMeta] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    const query = searchParams.toString()

    useEffect(() => {
        const controller = new AbortController()

        setLoading(true)
        setError(null)

        getSessions(new URLSearchParams(query), controller.signal)
            .then((res) => {
                setData(res.data)
                setMeta(res.meta)
                setLoading(false)
            })
            .catch((error) => {
                if (error.code === 'ERR_CANCELED') {
                    return
                }

                setError(error)
                setLoading(false)
            })

        return () => {
            controller.abort()
        }
    }, [query])

    return { data, meta, loading, error }
}

export function useSessionFilters(options) {
    const [params, setParams] = useSearchParams()

    const updateParams = (change) => {
        const nextParams = new URLSearchParams(params)

        nextParams.delete('page')
        change(nextParams)

        setParams(nextParams)
    }

    const toggleFilter = (key, value) => {
        updateParams((nextParams) => {
            const selectedValues = nextParams.getAll(key)

            const newValues = selectedValues.includes(value)
                ? selectedValues.filter((item) => item !== value)
                : [...selectedValues, value]

            nextParams.delete(key)

            newValues.forEach((item) => {
                nextParams.append(key, item)
            })

            if (key === KEYS.venues && options?.venues) {
                const selectedVenues = options.venues.filter((venue) =>
                    newValues.includes(venue.slug)
                )

                if (selectedVenues.length > 0) {
                    const allowedFormats = new Set(
                        selectedVenues.flatMap((venue) =>
                            venue.formats.map((format) => format.slug)
                        )
                    )

                    const currentFormats = nextParams
                        .getAll(KEYS.formats)
                        .filter((format) => allowedFormats.has(format))

                    nextParams.delete(KEYS.formats)

                    currentFormats.forEach((format) => {
                        nextParams.append(KEYS.formats, format)
                    })
                }
            }
        })
    }

    const setDate = (date) => {
        updateParams((nextParams) => {
            nextParams.set('date', date)
        })
    }

    const setSort = (sort) => {
        updateParams((nextParams) => {
            nextParams.set('sort', sort)
        })
    }

    const setPage = (page) => {
        const nextParams = new URLSearchParams(params)
        nextParams.set('page', String(page))
        setParams(nextParams)
    }

    const activeCount = Object.values(KEYS).reduce(
        (count, key) => count + params.getAll(key).length,
        0
    )

    const clearAll = () => {
        updateParams((nextParams) => {
            Object.values(KEYS).forEach((key) => {
                nextParams.delete(key)
            })
        })
    }

    return {
        params,
        toggle: toggleFilter,
        setDate,
        setSort,
        setPage,
        clearAll,
        activeCount,
    }
}