export const FetchData = async (path) => {
    try {
        const res = await fetch(path)
        const data = await res.json()
        return data
    }

    catch (err) {
        debugger
        return null
    }
}
