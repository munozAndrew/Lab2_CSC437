export default {
  server: {
    port: 5173,
    proxy: {
      "/api":      "http://localhost:3000",
      "/auth":     "http://localhost:3000",
      "/images":   "http://localhost:3000",
      //"/login":    "http://localhost:3000",
      "/register": "http://localhost:3000"
    }
  }
};
