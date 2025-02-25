require("dotenv").config();
const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");
const mysql = require("mysql2/promise");
const app = express();
const port =  5001;
app.use(cors());
app.use(express.json());
const dbConfig = {
   host: "localhost",
   user:"root",
   password: "",
   database: "deliverydb",
}

let db;
async function connectDb() {
  if(!db) {
    db= await mysql.createConnection(dbConfig);
    console.log("Connected to the Database");
  }
  return db;
}
app.post("/send-email", async (req, res)=>{
    const {order_details, CustomerEmail}=req.body;
    console.log("Received Data:", req.body);
    if (!order_details || !CustomerEmail) {
      return res.status(400).json({ error: "Missing order details or Customer email" });
    }
    const orderId = order_details.id|| null;
    
    if (!orderId) {
        console.error("Order ID is undefined");
        return res.status(400).json({ error: "Order ID is undefined" });
    }
  
   
   try {
      const transporter = nodemailer.createTransport({
         host: "smtp.gmail.com",
         port: 587,
         secure: false,
        auth: {
            user: "csharpdevelopers334@gmail.com",
            pass: "cwkwtqfrpnaussnv",
        },
      }); 
     

      const yesUrl = `http://192.168.148.127:5001/confirm-receipt/${orderId}/Yes`;
      const noUrl =`http://localhost:5001/confirm-receipt/${orderId}/No`;
      const mailOptions = {
        from: "csharpdevelopers334@gmail.com",
        to: CustomerEmail,
        subject: "Delivery Notification",
        text: `Dear Customer,\n\nYour order details:\n\n${JSON.stringify(order_details, null, 2)}\n\nYour order is scheduled for delivery within 3 days. Please confirm receipt: \n\nYes: ${yesUrl}\nNo: ${noUrl}`,
      };
      await transporter.sendMail(mailOptions);
      res.status(200).json({message: "Email sent successfully!"});
      
 }catch(error) {
    console.error("Error sending email:", error);
    res.status(500).json({error: error.message});
 }

 });
 // Handle Yes/No Confirmation
app.get("/confirm-receipt/:orderId/:status", async (req, res) => {
   const { orderId, status } = req.params;
 
   if (!["Yes", "No"].includes(status)) {
     return res.status(400).json({ error: "Invalid status" });
   }
 
   try {
     const db = await connectDb();
 
     await db.execute(
       "UPDATE orders SET confirmation_status = ?, confirmed_at = NOW() WHERE id = ?",
       [status, orderId]
     );
 
     res.send(`Thank you! Confirmation status updated to "${status}" for Order ID: ${orderId})`);
   } catch (error) {
     console.error("Error updating confirmation:", error);
     res.status(500).json({ error: error.message });
   }
 });
 
 // CRUD API Routes
 app.post("/create-order", async (req, res) => {
   const { customer_name, delivery_address, order_details, assigned_agent, recipient_email } = req.body;

   if (!customer_name || !delivery_address || !order_details || !recipient_email) {
    return res.status(400).json({ error: "All required fields must be provided" });
  }


   try {
     const db = await connectDb();
 
     const [result] = await db.execute(
       "INSERT INTO orders (customer_name, delivery_address, order_details, assigned_agent) VALUES (?, ?, ?, ?)",
       [customer_name, delivery_address, order_details, assigned_agent || null]
     );
 
     await db.execute(
       "INSERT INTO email_confirmations (order_id, recipient_email) VALUES (?, ?)",
       [result.insertId,recipient_email]
     );
 
     res.status(201).json({ message: "Order created successfully!", orderId: result.insertId });
   } catch (error) {
     console.error("Error creating order:", error);
     res.status(500).json({ error: error.message });
   }
 });
 
 app.get("/orders", async (req, res) => {
   try {
     const db = await connectDb();
     const [orders] = await db.execute("SELECT * FROM orders");
     res.json(orders);
   } catch (error) {
     console.error("Error fetching orders:", error);
     res.status(500).json({ error: error.message });
   }
 });
 //View data on dashboard(frontend)
 app.get("/dashboard-metrics", async (req, res) => {
  try {
    const db = await connectDb();
    
    const [[{ total_orders }]] = await db.execute(
      "SELECT COUNT(*) as total_orders FROM orders "
    );

    const [[{ pending_orders }]] = await db.execute(
      "SELECT COUNT(*) as pending_orders FROM orders WHERE status = 'Pending'"
    );

    const [[{ delivered_orders }]] = await db.execute(
      "SELECT COUNT(*) as delivered_orders FROM orders WHERE status = 'Delivered'"
    );

    const [[{ unassigned_orders }]] = await db.execute(
      "SELECT COUNT(*) as unassigned_orders FROM orders WHERE status = 'Unassigned'"
    );

    res.status(200).json({
      totalOrders: total_orders,
      pendingOrders: pending_orders,
      deliveredOrders: delivered_orders,
      unassignedOrders: unassigned_orders,
    });
  } catch (error) {
    console.error("Error fetching metrics:", error);
    res.status(500).json({ error: error.message });
  }
});
app.get("/api/agents", async (req, res)=>{
  try{
    const db = await connectDb()
    const [agents] = await db.execute("SELECT AgentID, AgentName FROM agents");
    console.log("Agents fetched:", agents);
   res.json(agents);
  } catch(error) {
    console.error("Error fetchig agents",error.message, error.stack);
    res.status(500).send(`error fetching agents:  ${error.message}`)
  }
})
 app.get("/pending-orders", async (req, res)=> {
  try{
    const db = await connectDb()
    const[rows] = await db.execute("SELECT * FROM Orders WHERE Status = 'Pending'");
    res.json(rows);
    
  }catch(error) {
    console.error("Error fetching pending orders", error);
    res.status
  }
 })
    
 app.post("/api/assign-agent", async (req, res) => {
 
  const { orderId, AgentName } = req.body;
  try {
    const db = await connectDb()
    await db.execute("UPDATE orders SET assigned_agent = ? WHERE id = ?", [AgentName, orderId]);
    res.send("Agent assigned successfully");
  } catch (error) {
    console.error("Error assigning agent:", error);
    res.status(500).send("Error assigning agent");
  }
});
app.get("/api/agent-pending-orders/:AgentName", async(req, res)=>{
  const {AgentName}= req.params;
  if(!AgentName ) {
    return res.status(400).json({ error: "AgentName is required" });
  }

  //Query to count the numer of pending orders Assigned to the the particular agent 
  try {
    const db = await connectDb();

    // Get Count of Pending Orders for Agent
    const countQuery = "SELECT COUNT(*) AS unreadCount FROM orders WHERE assigned_agent = ? AND status = 'Pending'";
    const [countResult] = await db.execute(countQuery, [AgentName]);
    const unreadCount = countResult[0].unreadCount;

    //  Get Pending Order Details for Agent
    const orderQuery = "SELECT * FROM orders WHERE assigned_agent = ? AND status = 'Pending'";
    const [orders] = await db.execute(orderQuery, [AgentName]);

    res.json({ unreadCount, orders }); // 🔹 Return both count and order details
  } catch (err) {
    console.error("Database error:", err);
    res.status(500).json({ error: "Database error" });
  }
});

  
 


 app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
 });
