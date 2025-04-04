require('dotenv').config()
const app = require("./app");
const connectDataBase = require("./config/db");

connectDataBase()

const PORT = process.env.PORT || 5000

const server = app.listen(PORT, () => console.log(`Server is running on port ${PORT}`))

// Unhandled Promise Rejection
process.on("unhandledRejection", (err) =>{
    console.log(`Error: ${err.message}`)
    console.log(`Shutting down the server due to unhandled promise Rejection`)
  
    server.close(() => {
      process.exit(1);
    })
  })