const ENV = {
    BASE_URL: String(import.meta.env.VITE_SERVER_URL),
    STREAM_API_KEY: String(import.meta.env.VITE_STREAM_API_KEY),
}

export default ENV;