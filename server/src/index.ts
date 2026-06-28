import express from "express";

const app = express();
const PORT  = process.env.PORT || 4000;

app.use(express.json());

app.get("/api/health", (req, res) => {
    res.json({ status: "ok", message: "Slotline server is running"});
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});