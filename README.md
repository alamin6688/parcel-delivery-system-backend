<h1>📦 Parcel Delivery System - Backend </h1>

<p>A secure, modular and role-based backend API for managing **parcel delivery operations** (inspired by Pathao Courier / Sundarban).  
Built with Express.js + TypeScript + MongoDB (Mongoose), featuring JWT authentication, Zod validation and full role-based control.</p>

---

## ✨ Key Features

<ul>
<li>🔐 <b>Authentication</b> – JWT-based login system with <code>ADMIN</code>, <code>SENDER</code>, <code>RECEIVER</code> roles</li>
<li>🛡️ <b>Role-Based Authorization</b> – Secure endpoints with middleware for each role</li>
<li>📦 <b>Parcel Management</b> – Create, cancel, update, and track parcels</li>
<li>📜 <b>Status Logs</b> – Embedded history for every status change (Requested → Approved → Dispatched → In Transit → Delivered)</li>
<li>🚫 <b>User & Parcel Block/Unblock</b> – Admin can block users/parcels</li>
<li>✅ <b>Validation</b> – Request payloads validated with Zod</li>
<li>⚡ <b>Error Handling</b> – Global error handler with custom, Mongoose, and Zod error management</li>
<li>🔁 <b>Transactional Logic</b> – Controlled flow for cancel/delivery confirmation</li>
<li>🛠️ <b>Future Scope</b> – Delivery Agent module, Fee calculation, Coupons/Discounts</li>
</ul>

---

## 📂 Folder Structure

<pre>
src/
├── modules/
│   ├── auth/        # Signup, login, JWT refresh
│   ├── user/        # User model, roles, block/unblock
│   ├── parcel/      # Parcel schema + status log handling
├── middlewares/     # Auth, validateRequest, error handler
├── config/          # Env vars, DB config
├── utils/           # JWT helpers, token manager
├── app.ts           # Express bootstrap
└── server.ts        # Server launcher
</pre>

---

## 🔐 Authentication & Authorization Flow

<ul>
<li>🔑 <b>Register / Login</b> with hashed password (<code>bcrypt.js</code>)</li>
<li>📜 JWT includes: <code>{ userId, email, role }</code></li>
<li>🛡️ Middleware <code>authGuard</code> checks roles: <code>ADMIN</code>, <code>SENDER</code>, <code>RECEIVER</code></li>
<li>🚫 Blocked users cannot access protected endpoints</li>
<li>♻️ Refresh tokens supported for session renewal</li>
</ul>

---

## 👤 Sender Features

<ul>
<li>➕ Create new parcel request</li>
<li>📄 View all parcels created by sender</li>
<li>🚫 Cancel parcel (if not dispatched)</li>
<li>🕒 View parcel history + status log</li>
</ul>

---

## 📥 Receiver Features

<ul>
<li>📦 View incoming parcels</li>
<li>✅ Confirm parcel delivery (mark as delivered)</li>
<li>📄 View delivery history</li>
</ul>

---

## 🛠️ Admin Features

<ul>
<li>👥 Manage all users (view, block/unblock)</li>
<li>📦 Manage all parcels (approve, dispatch, mark in-transit, delivered)</li>
<li>🔍 Search/filter by status, tracking ID</li>
<li>🚫 Block/unblock parcels</li>
<li>🗑️ Delete parcel (hard remove)</li>
</ul>

---

## 🚚 Agent (Future Work)

<ul>
<li>👨‍💼 Assign delivery agents to parcels</li>
<li>🏢 Hub-based dispatch and tracking</li>
<li>📊 Agent performance metrics</li>
</ul>

---

## 📑 Parcel API Endpoints

<table>
<thead>
<tr>
<th>#</th>
<th>Method</th>
<th>Endpoint</th>
<th>Role</th>
<th>Description</th>
<th>Body Example</th>
</tr>
</thead>
<tbody>
<tr>
<td>1</td>
<td>POST</td>
<td><code>/parcel</code></td>
<td>SENDER</td>
<td>Create a new parcel</td>
<td><pre>{
  "receiverId": "*****************c1333",
  "parcelType": "Panjabi",
  "weight": 3.5,
  "pickupAddress": "123 Sender Street, Dhaka, Bangladesh",
  "deliveryAddress": "456 Receiver Avenue, Chattogram, Bangladesh",
  "fee": 200
}</pre></td>
</tr>

<tr>
<td>2</td>
<td>PATCH</td>
<td><code>/parcel/cancel/:id</code></td>
<td>SENDER</td>
<td>Cancel a parcel if not dispatched</td>
<td><i>None</i> (URL param: <code>:id</code> → parcel <code>_id</code>)</td>
</tr>

<tr>
<td>3</td>
<td>GET</td>
<td><code>/parcel/me</code></td>
<td>SENDER</td>
<td>List sender’s own parcel with status logs</td>
<td><i>None</i></td>
</tr>

<tr>
<td>4</td>
<td>GET</td>
<td><code>/parcel/incoming</code></td>
<td>RECEIVER</td>
<td>List incoming parcels for receiver</td>
<td><i>None</i></td>
</tr>

<tr>
<td>5</td>
<td>PATCH</td>
<td><code>/parcel/confirm/:id</code></td>
<td>RECEIVER</td>
<td>Confirm delivery of a parcel</td>
<td><i>None</i> (URL param: <code>:id</code> → parcel <code>_id</code>)</td>
</tr>

<tr>
<td>6</td>
<td>GET</td>
<td><code>/parcel/:id/status-log</code></td>
<td>ALL</td>
<td>View parcel status log</td>
<td><i>None</i> (URL param: <code>:id</code> → parcel <code>_id</code>)</td>
</tr>

<tr>
<td>7</td>
<td>GET</td>
<td><code>/parcel</code></td>
<td>ADMIN</td>
<td>List all parcel in the system</td>
<td><i>None</i></td>
</tr>

<tr>
<td>8</td>
<td>PATCH</td>
<td><code>/parcel/block/:id</code></td>
<td>ADMIN</td>
<td>Block a parcel</td>
<td><i>None</i> (URL param: <code>:id</code> → parcel <code>_id</code>)</td>
</tr>

<tr>
<td>9</td>
<td>PATCH</td>
<td><code>/parcel/unblock/:id</code></td>
<td>ADMIN</td>
<td>Unblock a parcel</td>
<td><i>None</i> (URL param: <code>:id</code> → parcel <code>_id</code>)</td>
</tr>

<tr>
<td>10</td>
<td>PATCH</td>
<td><code>/parcel/status/:id</code></td>
<td>ADMIN</td>
<td>Update parcel status</td>
<td><pre>{ "status": "DISPATCHED" }</pre></td>
</tr>

<tr>
<td>11</td>
<td>DELETE</td>
<td><code>/parcel/delete/:id</code></td>
<td>ADMIN</td>
<td>Delete a parcel</td>
<td><i>None</i> (URL param: <code>:id</code> → parcel <code>_id</code>)</td>
</tr>
</tbody>
</table>

---

## 🛡️ Validation

Most endpoints use **Zod schemas** in `*.validation.ts`.  
Middleware: `validateRequest` → returns `400 Bad Request` with structured errors.

---

## ⚙️ Development Tips

- 🟦 **TypeScript Check**:  
  <pre><code>npx tsc --noEmit</code></pre>

- ✅ **Tests**: Use `mongodb-memory-server` for integration tests.

- 🎨 **Lint & Prettier**: Maintain consistent formatting. Pre-commit hooks recommended.

---

## 🚀 Quick Start

<pre>
# 1. Install dependencies
npm install

# 2. Start MongoDB (local or Atlas)

# 3. Run server in dev mode
npm run dev

# 4. Build & run production
npm run build
npm run start
</pre>

---

## 📝 Scripts

<ul>
<li><code>npm run dev</code> – Start development server with nodemon</li>
<li><code>npm run build</code> – Compile TypeScript</li>
<li><code>npm run start</code> – Run compiled JS</li>
</ul>

---

## 📜 License

MIT License © 2025 – Parcel Delivery System Backend
