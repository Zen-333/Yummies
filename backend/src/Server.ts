import app from "./App.js"

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`📍 Local: http://localhost:${PORT}`);
});