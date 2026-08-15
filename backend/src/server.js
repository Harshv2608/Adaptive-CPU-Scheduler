const express = require('express');
const cors = require('cors');
const simulationRoutes = require('./routes/simulation.routes');

const app = express();
const PORT = process.env.PORT || 3001;
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || 'http://localhost:3000';

app.use(cors({
    origin: CLIENT_ORIGIN
}));
app.use(express.json());

app.use('/api', simulationRoutes);

app.listen(PORT, () => {
    console.log(`Express server running on port ${PORT}`);
});
