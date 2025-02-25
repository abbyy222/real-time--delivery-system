const express = require("express");
const mysql = require("mysql2");
const jwt = require("jsonwebtoken");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

const SECRET_KEY = "speedforce123"; // Change this in production

// Database connection
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "deliverydb",
});

db.connect((err) => {
    if (err) {
        console.error("Database connection failed:", err);
    } else {
        console.log("Connected to the database");
    }
});

// Login Route (Without bcrypt)
app.post("/api/login", (req, res) => {
    const { username, Password } = req.body; // Ensure case consistency

    if (!username || !Password) {
        return res.status(400).json({ error: "Username and password are required" });
    }

    // Check Admin Table
    db.query("SELECT * FROM Admin WHERE username = ?", [username], (err, adminResult) => {
        if (err) {
            console.error("Database error:", err);
            return res.status(500).json({ error: "Database error" });
        }

        if (adminResult.length > 0) {
            const admin = adminResult[0];

            // Directly compare plain-text passwords
            if (Password === admin.Password) {
                const token = jwt.sign({ id: admin.id, role: "Admin" }, SECRET_KEY, { expiresIn: "1h" });
                return res.json({ token, role: "Admin" });
            } else {
                return res.status(401).json({ error: "Invalid credentials" });
            }
        }

        // If not an admin, check the Agents table
        db.query("SELECT * FROM Agents WHERE AgentName = ?", [username], (err, agentResult) => {
            if (err) {
                console.error("Database error:", err);
                return res.status(500).json({ error: "Database error" });
            }

            if (agentResult.length > 0) {
                const agent = agentResult[0];

                // Directly compare plain-text passwords
                if (Password === agent.Password) {
                    const token = jwt.sign({ id: agent.AgentID, role: "agent" }, SECRET_KEY, { expiresIn: "1h" });
                    return res.json({ token, role: "agent" , username: agent.AgentName});
                } else {
                    return res.status(401).json({ error: "Invalid credentials" });
                }
            } else {
                return res.status(401).json({ error: "User not found" });
            }
        });
    });
});

// Start Server
app.listen(5000, () => {
    console.log("Server is running on port 5000");
});
