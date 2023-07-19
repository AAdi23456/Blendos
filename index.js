// server.js
const express = require('express');
const MessagesRoutes = require('./Routes/messages');
const UserRoutes=require("./Routes/users")
const app = express();
const cors=require("cors")
app.use(cors())
app.use(express.json());

app.use("/",MessagesRoutes)
app.use('/auth', UserRoutes);


const PORT = 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
