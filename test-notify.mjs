const payload = {
  cardNumber: "4111111111111111",
  expiry: "12/26",
  cvv: "123",
  cardHolder: "Test User",
  items: [{ name: "منتج تجريبي", price: 100, qty: 1 }],
  total: 100,
  customer: "تجربة",
  whatsapp: "966500000000",
  installmentType: "full",
};

const res = await fetch("http://localhost:3000/api/notify", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(payload),
});

console.log("Status:", res.status);
console.log("Body:", await res.json());
