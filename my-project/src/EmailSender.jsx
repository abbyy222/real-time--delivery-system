import{useState} from "react";
function App() {
  const [emailData, setEmailData] = useState({
    to: "",
    subject: "",
    text: "",
  });
  const handleChange = (e) => {
    setEmailData({...emailData, [e.target.name]: e.target.value});
  };

  const sendEmail = async () => {
    try{
      const response = await fetch("http://localhost:5000/send-email",{
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body:JSON.stringify(emailData),
      });
      const result = await response.json();
      alert(result.message || "Email sent successfully!")
    } catch(error){
     alert("Error sending message " + error.message)
    }
  };
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
      <h1 className="text-3xl font-bold mb-4">Send Email</h1>
      <input type="email" name="to" placeholder="Recipient Email" className="border p-2 rounded mb-2 w-full max-w-md"
      value={emailData.to}
      onChange={handleChange}
      />
      <input type="text" name="subject" placeholder="subject" className="border p-2 rounded mb-2 w-full max-w-md" value={emailData.subject}
      onChange={handleChange}/>
      <textarea name="text" placeholder="message" className="border p-2 rounded mb-2 w-full max-w-md" value={emailData.text} onChange={handleChange}/>
      <button 
      onClick={sendEmail} className="w-full bg-blue-500 text-white py-3 rounded hover:bg-red-400">Send Email

      </button>
      
    </div> 
  );
}
export default App;