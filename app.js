const express = require('express');

const cors = require('cors');
const mongoose = require('mongoose');
const helmet = require('helmet');

const app = express();

app.use(cors());

const PORT = process.env.PORT || 3000;
const MONGODB_URI = 'mongodb://127.0.0.1:27017/mestodb';

app.use(helmet());

mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
app.use(express.json());

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});