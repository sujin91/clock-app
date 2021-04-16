export const fetchData = async (path) => {
    try {
        const res = await fetch(path)
        const data = await res.json()

        return data
    }

    catch (err) {
        console.log(err)
        return null
    }
}

