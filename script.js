const API_KEY = 'YOUR_API_KEY'; // Replace with your actual API key
const SHEET_ID = '1BxqGVqzZBdkbW0H8M_3wgyyL6egwol9n1XVRuJTymjU'; // Google Sheet ID

// Function to fetch data from Google Sheets
async function fetchData() {
    const response = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/Sheet1?key=${API_KEY}`);
    const data = await response.json();
    return data.values;
}

// Function to add a new task to Google Sheets
async function addTask(task, deadline, note, done) {
    const response = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/Sheet1:append?valueInputOption=RAW&key=${API_KEY}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            values: [[task, deadline, note, done]],
        }),
    });
    return response.json();
}

// Populate the table with fetched data
async function populateTable() {
    const tasks = await fetchData();
    const tableBody = document.querySelector('.table tbody');
    tableBody.innerHTML = ''; // Clear existing rows

    tasks.forEach(task => {
        const row = document.createElement('tr');
        row.innerHTML = `<td>${task[0]}</td><td>${task[1]}</td><td>${task[2]}</td><td>${task[3]}</td>`;
        tableBody.appendChild(row);
    });
}

// Event listener for adding a new task
document.getElementById('taskInput').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        const task = e.target.value;
        const deadline = ''; // Placeholder for deadline input
        const note = ''; // Placeholder for note input
        const done = false; // Default value for done
        addTask(task, deadline, note, done).then(() => {
            e.target.value = ''; // Clear input
            populateTable(); // Refresh table
        });
    }
});

// Initial population of the table
populateTable();
