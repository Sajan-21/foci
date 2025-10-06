const http = require('http');
const dotenv = require('dotenv');
dotenv.config();
const app = require('./src/app');
const mongoConnect = require('./src/config/db');
const authRoutes = require('./src/routes/authRoutes');

mongoConnect();

const PORT = process.env.PORT || 5000
const server = http.createServer(app);

app.use(authRoutes);

server.listen(PORT, () => {
    console.log(`server listening on port: ${PORT}`);
});