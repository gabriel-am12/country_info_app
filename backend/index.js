const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());

app.use(
  cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  }),
);

// Get available countries endpoint
app.get('/countries', async (req, res) => {
  try {
    const response = await axios.get(
      `${process.env.BASE_URL_NAGER}/AvailableCountries`,
    );
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching available countries:', error.message);
    res.status(500).json({ error: 'Failed to fetch available countries' });
  }
});

// Get country info endpoint
app.get('/country/:code', async (req, res) => {
  const countryCode = req.params.code;

  try {
    // a. get borders data
    const borderResponse = await axios.get(
      `${process.env.BASE_URL_NAGER}/CountryInfo/${countryCode}`,
    );
    const borderCountries = borderResponse.data.borders || [];

    // b. get population data
    const populationResponse = await axios.post(
      `${process.env.BASE_URL_COUNTRIES}/countries/population`,
      { country: borderResponse.data.commonName },
    );
    const populationData = populationResponse.data.data.populationCounts || [];

    // c. get flag url data
    const flagResponse = await axios.post(
      `${process.env.BASE_URL_COUNTRIES}/countries/flag/images`,
      { iso2: countryCode },
    );
    const flagUrl = flagResponse.data.data.flag || '';

    res.json({
      commonName: borderResponse.data.commonName,
      officialName: borderResponse.data.officialName,
      countryCode: borderResponse.data.countryCode,
      region: borderResponse.data.region,
      borders: borderCountries,
      population: populationData,
      flag: flagUrl,
    });
  } catch (error) {
    console.error('Error fetching country information:', error.message);
    res.status(500).json({ error: 'Failed to fetch country information' });
  }
});

// Server running in PORT
app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
