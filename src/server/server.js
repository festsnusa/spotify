const express = require('express')
const path = require('path')

const app = express()
const port = process.env.PORT || 3000

// Serve static files from the 'dist' directory
app.use(express.static(path.join(__dirname, 'dist')))

// Redirect all requests to 'index.html'
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'))
})

// Start the server
app.listen(port, () => {
  console.log(`Server listening on port ${port}`)
})
