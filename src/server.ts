const express = require('express');
const app = express();
const bodyParser = require('body-parser');

app.use(bodyParser.json());

app.post('/generate-captcha', (req: any, res: any) => {
    // Simulate CAPTCHA generation
    const captchaToken = 'valid-captcha-token';
    res.json({ captchaToken });
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
