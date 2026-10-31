import fetch from "node-fetch";

const result = await fetch("http://localhost:4000/api/auth/register", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    username: "testuser",
    email: "test@example.com",
    phone: "0788000000",
    password: "password123",
  }),
});

const data = await result.json();
console.log("Status:", result.status);
console.log("Response:", JSON.stringify(data, null, 2));