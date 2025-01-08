const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000; // Default to port 3000 if not set

// Example route
app.get('/', (req, res) => {
    res.send('Server is running!');
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
