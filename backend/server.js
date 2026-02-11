const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// Utility function to read JSON file
const getData = () => {
    const filePath = path.join(__dirname, 'data.json');
    const rawData = fs.readFileSync(filePath);
    return JSON.parse(rawData);
};

/*
----------------------------------------
GET All Students
Optional Query Params:
?course=DevOps
?sort=marks
----------------------------------------
*/
app.get('/api/students', (req, res) => {
    let data = getData();

    // Filtering
    if (req.query.course) {
        data = data.filter(student =>
            student.course.toLowerCase() === req.query.course.toLowerCase()
        );
    }

    // Sorting
    if (req.query.sort) {
        const field = req.query.sort;
        data.sort((a, b) => a[field] - b[field]);
    }

    res.json({
        success: true,
        count: data.length,
        data: data
    });
});

/*
----------------------------------------
GET Single Student by ID
----------------------------------------
*/
app.get('/api/students/:id', (req, res) => {
    const data = getData();
    const student = data.find(s => s.id === parseInt(req.params.id));

    if (!student) {
        return res.status(404).json({
            success: false,
            message: "Student not found"
        });
    }

    res.json({
        success: true,
        data: student
    });
});

app.listen(PORT, () => {
    console.log(`API running on http://localhost:${PORT}`);
});
