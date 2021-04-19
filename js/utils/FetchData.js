/**
 * 비동기 데이터 호출
 * @param {String} path : fetch 받을 파일 경로
 */
export const fetchData = async (path) => {
    try {
        const res = await fetch(path)
        const data = await res.json()

        return data
    } catch (err) {
        console.log(err)
        return null
    }
}
