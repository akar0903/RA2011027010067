const express = require('express');
const axios = require('axios');

const app = express();
const port = 3000;

app.get('/numbers', async(req, res) => {
    const { url } = req.query;

    if (!url) {
        return res.status(400).json({ error: 'At least one URL is required.' });
    }

    const urls = Array.isArray(url) ? url : [url];

    try {
        const results = await Promise.all(
            urls.map(async(url) => {
                try {
                    const response = await axios.get(url);
                    return response.data.numbers || [];
                } catch (error) {
                    console.error(`Error fetching data from ${url}: ${error}`);
                    return [];
                }
            })
        );

        const combinedNumbers = results.reduce((acc, numbers) => [...acc, ...numbers], []);
        res.json({ numbers: combinedNumbers });
    } catch (error) {
        console.error('Error processing URLs:', error.message);
        res.status(500).json({ error: 'Internal server error.' });
    }
});

app.listen(port, () => {
    console.log(`number-management-service is running on port ${port}`);
});