const express = require('express');
const sql = require('mssql');
const cors = require('cors');
const app=express();
const {route}=require('./Route/routes')
const { syncModels } = require('./models'); 
app.use(express.json())
app.use(cors({
  origin: 'http://localhost:3000' 
}));

syncModels();


app.use('/api',route);




const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
