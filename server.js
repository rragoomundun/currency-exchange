import express from 'express';
import axios from 'axios';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: './config/config.env' });

const app = express();

// Use environmental variables to keep sensitive data private
const PORT = process.env.PORT || 3000;
const API_KEY = process.env.API_KEY;
const API_BASE_URL = process.env.API_BASE_URL;
const API_URL = `${API_BASE_URL}/${API_KEY}`;

app.use(express.static('public'));

app.get('/', async (req, res) => {
  const { initialCurrency, amount, endCurrency } = req.query;
  const ejsVars = { initialCurrency, amount, endCurrency };

  // If inititialCurrency, amount, and endCurrency have a value we can make the API call
  if (initialCurrency && amount && endCurrency) {
    try {
      const response = await axios.get(`${API_URL}/pair/${initialCurrency}/${endCurrency}/${amount}`);
      const result = response.data;

      ejsVars.endAmount = result.conversion_result;
      ejsVars.rate = result.conversion_rate;

      res.render('index.ejs', ejsVars);
    } catch {
      ejsVars.error = true;
      res.render('index.ejs', ejsVars);
    }
  } else {
    res.render('index.ejs', ejsVars);
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
