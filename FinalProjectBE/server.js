require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const app = express();
const port = 3002;

const db = require("./Database/connection");
const bcrypt = require("bcrypt");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

console.log("🌱 Loaded DB URL:", process.env.DATABASE_URL);

// ✅ Allow both localhost (for development) and Vercel (for production)
const allowedOrigins = [
  "http://localhost:3000",
  "https://art-planet.vercel.app"
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
}));

app.use(cookieParser());
app.use(express.json());



app.listen(port, () => {
  console.log(`Server runing on port ${port}`);
});
app.get("/", (req, res) => {
  res.status(200).send(`<h1>Hello world</h1>`);
});

app.get("/checkAuth", (req, res) => {
  const userId = req.cookies.userid?.[0];

  if (!userId) {
    return res.status(200).json({ isLoggedIn: false });
  }

  res.status(200).json({ isLoggedIn: true });
});

app.post("/logout", (req, res) => {
  res.clearCookie("userid");
  res.status(200).json({ message: "Logged out" });
});

app.get("/signup", async (req, res) => {
  let users = await db.query("SELECT * FROM users");
  console.log("from GetSignup" + users.rowCount);
  res.json(users);
});

app.get("/login", async (req, res) => {
  let users = await db.query("SELECT * FROM users");
  console.log("from GetLogin " + users.rowCount);
  res.json(users.rowCount);
});
app.post("/signup", async (req, res) => {
  try {
    const { username, password, email, address, postalcode } = req.body;
    console.log(username);
    const saltRounds = 10;
    bcrypt.hash(password, saltRounds);
    const salt = bcrypt.genSaltSync(saltRounds);
    const hash = bcrypt.hashSync(password, salt);

    let newuser = await db.query(
      `INSERT INTO users (username, userPassword, email, address, postalcode) VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [username, hash, email, address, postalcode]
    );
    console.log("after adding new User");

    res.cookie("userid", newuser.rows[0].id, { maxAge: 18000000 });

    let users = await db.query("SELECT * FROM users");
    count = users.rowCount;
    res.json({
      status: 200,
      message: "User successfully created",
      count: users.rowCount,
    });
  } catch (err) {
    console.log(err);
    res.status(500).send(`not found`);
  }
});

app.get("/candels", async (req, res) => {
  let products = await db.query("SELECT * FROM products where category_id = 1");
  res.json(products.rows);
});
app.get("/Courses", async (req, res) => {
  console.log("HEY");
  let courses = await db.query("SELECT * FROM courses");
  console.log("fromCourses " + courses.rowCount);
  res.json(courses);
});

app.get("/GetProduct", async (req, res) => {
  //  let products = await db.query("SELECT * FROM products");
  let product = await db.query(
    "SELECT c.id as categoryid ,c.name as categoryname, p.id,p.name as productname, p.description , p.price  FROM category as c INNER JOIN products as p on c.id = p.category_id "
  );
  res.json(product.rows);
});

app.get("/GetOrder", async (req, res) => {
  let orders = await db.query(
    "SELECT o.id as orderid, o.status as status , p.name as productname , od.quantity FROM orders as o INNER JOIN orderDetails as od on o.id = od.order_id inner join products as p on p.id = o.id   "
  );
  res.json(product.rows);
});

app.get("/category", async (req, res) => {
  let category = await db.query("SELECT * FROM category");
  res.json(category.rows);
});
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if both fields are provided
    if (!email || !password) {
      return res.status(400).json({ status: false, message: "Email and password are required." });
    }

    // Fetch user by email
    const userResult = await db.query("SELECT id, email, userpassword FROM users WHERE email = $1", [email]);

    if (userResult.rowCount === 0) {
      return res.status(401).json({ status: false, message: "Invalid email or password." });
    }

    const user = userResult.rows[0];

    // Compare password securely
    const isMatch = await bcrypt.compare(password, user.userpassword);
    if (!isMatch) {
      return res.status(401).json({ status: false, message: "Invalid email or password." });
    }

    // Set a cookie with user ID
    res.cookie("userid", user.id, { maxAge: 18000000, httpOnly: true });
    return res.status(200).json({ status: true, message: "Login successful." });

  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ status: false, message: "Server error. Please try again later." });
  }
});


// function deleteCookie(name) {
//   if (
//     document.cookie
//       .split(";")
//       .some((item) => item.trim().startsWith(name + "="))
//   ) {
//     // Set the cookie to expire in the past, effectively deleting it
//     document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
//     console.log(`${name} cookie has been deleted.`);
//   } else {
//     console.log(`${name} cookie does not exist.`);
//   }
// }

app.get("/images", async (req, res) => {
  let images = await db.query("SELECT * FROM images");
  console.log(images.rowCount);
  res.json(images);
});

app.get("/cart", async (req, res) => {
  const cookies = req.cookies || {};
  const userId = cookies.userid ? cookies.userid[0] : null;

  if (!userId) {
    return res.status(401).json({
      status: false,
      message: "You must be logged in to view your cart.",
    });
  }

  try {
    const product = await db.query(
      "SELECT * FROM cart AS c INNER JOIN products AS p ON p.id = c.product_id WHERE c.user_id = $1",
      [userId]
    );
    res.json({ status: true, products: product.rows });
  } catch (error) {
    console.error("Cart query error:", error);
    res.status(500).json({ status: false, message: "Server error." });
  }
});

app.get("/allOrders", async (req, res) => {
  let orders = await db.query("SELECT * FROM orders");
  res.json(orders);
});

app.post("/cart", async (req, res) => {
  const cookies = req.cookies || {};
  const userId = cookies.userid ? cookies.userid[0] : null;

  if (!userId) {
    return res.status(401).json({
      status: false,
      message: "Please log in to update your cart.",
    });
  }

  const { key, quantity, flag } = req.body;

  try {
    if (flag === "update") {
      if (quantity > 0) {
        await db.query(
          `UPDATE cart SET quantity = $1 WHERE user_id = $2 AND product_id = $3`,
          [quantity, userId, key]
        );
      } else {
        await db.query(
          `DELETE FROM cart WHERE user_id = $1 AND product_id = $2`,
          [userId, key]
        );
      }
    }

    res.json({ status: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: false, message: "Failed to update cart" });
  }
});


app.post("/cartToOrder", async (req, res) => {
  const cookies = req.cookies || {};
  const userId = cookies.userid ? cookies.userid[0] : null;

  if (!userId) {
    return res.status(401).json({
      status: false,
      message: "Please log in to place your order.",
    });
  }

  try {
    const cartItems = await db.query(
      "SELECT * FROM cart AS c INNER JOIN products AS p ON p.id = c.product_id WHERE c.user_id = $1",
      [userId]
    );

    const orderRes = await db.query(
      "INSERT INTO orders (user_id, status) VALUES ($1, $2) RETURNING id",
      [userId, "pending"]
    );

    const orderId = orderRes.rows[0].id;

    for (let item of cartItems.rows) {
      await db.query(
        "INSERT INTO orderDetails (order_id, product_id, quantity) VALUES ($1, $2, $3)",
        [orderId, item.product_id, item.quantity]
      );
    }

    await db.query("DELETE FROM cart WHERE user_id = $1", [userId]);

    res.json({ status: true });
  } catch (error) {
    console.error("Order error:", error);
    res.status(500).json({ status: false, message: "Failed to place order" });
  }
});

app.put("/UpdateProducts/:id", async (req, res) => {
  const { id } = req.params; // Get the course ID from the URL
  const { name, description, price, category } = req.body;
  let result = await db.query(
    ` SELECT category.id FROM category where category.name = $1`,
    [category]
  );
  console.log(result);
  console.log(category);
  console.log(result.rows[0]);
  let idCategory = result.rows[0].id;
  try {
    const updateQuery = `
      UPDATE products
      SET name = $1, description = $2, price = $3, category_id = $4
      WHERE id = $5
    `;

    const result = await db.query(updateQuery, [
      productname,
      description,
      price,
      idCategory,
      id,
    ]);

    // Check if the update was successful
    if (result.rowCount === 0) {
      // No rows updated, send a 404 response
      return res.status(404).json({ message: "product not found" });
    }

    // Send a success response. You can also retrieve and send the updated course if needed
    res.status(200).json({ message: "product updated successfully" });
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ message: "Error updating product" });
  }
});
app.post("/AddProduct", async (req, res) => {
  let name = req.body.name;
  let description = req.body.description;
  let price = req.body.price;
  let category = req.body.category;
  console.log([name] + "+" + [description] + "+" + [price] + "+" + [category]);
  let result = await db.query(
    ` SELECT category.id FROM category where category.name = $1`,
    [category]
  );
  if (result.rows.length > 0) {
    let idCategory = result.rows[0].id;
    let newProduct = await db.query(
      `INSERT INTO products (name , description , price , category_id) VALUES ($1, $2, $3 , $4) RETURNING *`,
      [name, description, price, idCategory]
    );
    let productID = newProduct.rows[0].id;
    let newimage = await db.query(
      ` INSERT INTO images (product_id) VALUES ($1)`,
      [productID]
    );
    const query = db.query(`SELECT MAX(id) as maxid FROM products`);
    const maxid = (await query).rows[0].maxid;
    res.json({ status: "true", id: maxid });
  } else {
    console.log("No category found with the given name.");
    res.json({ status: "false" });
  }
});
app.post("/AddProductToCart", async (req, res) => {
  const cookies = req.cookies || {};
  const userId = cookies.userid;
  const product = req.body.item;

  if (!userId) {
    return res.json({
      status: false,
      message: "Please login to add products to the cart.",
    });
  }

  try {
    const existing = await db.query(
      `SELECT * FROM cart WHERE product_id = $1 AND user_id = $2`,
      [product.id, userId]
    );

    if (existing.rows.length === 0) {
      await db.query(
        `INSERT INTO cart (user_id, product_id, quantity) VALUES ($1, $2, $3)`,
        [userId, product.id, 1]
      );
      return res.json({ status: true, message: "Product added to cart." });
    } else {
      const currentQuantity = existing.rows[0].quantity;
      const updatedQuantity = currentQuantity + 1;

      await db.query(
        `UPDATE cart SET quantity = $1 WHERE user_id = $2 AND product_id = $3`,
        [updatedQuantity, userId, product.id]
      );
      return res.json({ status: true, message: "Product quantity updated." });
    }
  } catch (err) {
    console.error("Error in AddProductToCart:", err);
    return res.status(500).json({ status: false, message: "Server error." });
  }
});

app.get("/Getorder'sProduct/:id", async (req, res) => {
  const { id } = req.params;
  console.log("from server: " + id);
  // Check if the id is not undefined and is an integer
  if (!id || isNaN(parseInt(id))) {
    return res.status(400).json({ error: "Invalid order ID." });
  }

  try {
    let orderProduct = await db.query(
      `
                              SELECT o.id as orderid, p.* , od.quantity as quantity , c.name as category
                              FROM orders as o 
                              INNER JOIN orderDetails as od on o.id = od.order_id 
                              inner join products as p on p.id = od.product_id
                              inner join category as c on p.category_id=c.id
                              WHERE o.id = $1`,
      [id]
    );
    res.json(orderProduct.rows); // Make sure to send the rows if that's what you intend to send.
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

app.delete("/DeleteCourses/:id", async (req, res) => {
  const { id } = req.params; // Get the course ID from the URL
  try {
    // Construct the SQL query. Use parameterized queries to avoid SQL injection
    const deleteQuery = `
      DELETE FROM courses
      WHERE id = $1
    `;

    // Execute the query
    const result = await db.query(deleteQuery, [id]);

    // Check if the delete was successful
    if (result.rowCount === 0) {
      // No rows deleted, send a 404 response
      return res.status(404).json({ message: "Course not found" });
    }

    // Send a success response
    res.status(200).json({ message: "Course deleted successfully" });
  } catch (error) {
    console.error("Error deleting course:", error);
    res.status(500).json({ message: "Error deleting course" });
  }
});
app.delete("/DeleteProducts/:id", async (req, res) => {
  const { id } = req.params; // Get the course ID from the URL
  try {
    const deleteIMG = `DELETE FROM images WHERE product_id = $1`;
    const resultIMG = await db.query(deleteIMG, [id]);
    // Construct the SQL query. Use parameterized queries to avoid SQL injection
    const deleteQuery = `
      DELETE FROM products
      WHERE id = $1
    `;

    // Execute the query
    const result = await db.query(deleteQuery, [id]);

    // Check if the delete was successful
    if (result.rowCount === 0) {
      // No rows deleted, send a 404 response
      return res.status(404).json({ message: "product not found" });
    }

    // Send a success response
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ message: "Error deleting product" });
  }
});
// Multer configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = path.join(__dirname, "../Admin/_admin/public/Imgs/corsesImg");
    const frontendpath = path.join(
      __dirname,
      "../FinalProject/public/Imgs/corsesImg"
    );

    // Create directory if it does not exist
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    if (!fs.existsSync(frontendpath)) {
      fs.mkdirSync(frontendpath, { recursive: true });
    }
    cb(null, dir);
    cb(null, frontendpath);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

app.put("/updateOrderStatus/:id", async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  try {
    console.log(status + "1123");
    const updateQuery = `
      UPDATE orders
      SET status = $1
      WHERE id = $2
    `;
    const result = await db.query(updateQuery, [status, id]);
    if (result.rowCount === 0) {
      // No rows updated, send a 404 response
      return res.status(404).json({ message: "order not found" });
    }

    // Send a success response. You can also retrieve and send the updated course if needed
    res.status(200).json({ message: "order status updated successfully" });
  } catch (error) {
    console.error("Error updating course:", error);
    res.status(500).json({ message: "Error updating status" });
  }
});
// Initialize multer with the storage configuration
const upload = multer({ storage: storage });
app.put("/UpdateCourses/:id", upload.single("photo"), async (req, res) => {
  const { id } = req.params; // Get the course ID from the URL
  const { name, description, price, participantsnumber, age, date } = req.body; // Extract fields except 'photo'
  const photo = req.file
    ? `/Imgs/corsesImg/${req.file.filename}`
    : req.body.photo;

  try {
    const updateQuery = `
      UPDATE courses
      SET name = $1, description = $2, price = $3, participantsnumber = $4, age = $5, date = $6, photo = $7
      WHERE id = $8
    `;

    const result = await db.query(updateQuery, [
      name,
      description,
      price,
      participantsnumber,
      age,
      date,
      photo,
      id,
    ]);

    // Check if the update was successful
    if (result.rowCount === 0) {
      // No rows updated, send a 404 response
      return res.status(404).json({ message: "Course not found" });
    }

    // Send a success response. You can also retrieve and send the updated course if needed
    res.status(200).json({ message: "Course updated successfully" });
  } catch (error) {
    console.error("Error updating course:", error);
    res.status(500).json({ message: "Error updating course" });
  }
});

app.post("/AddCourses", upload.single("photo"), async (req, res) => {
  const { name, description, price, participantsnumber, age, date } = req.body;
  const photo = `/Imgs/corsesImg/${req.file.filename}`;
  try {
    // Construct the SQL query to insert a new course.
    // Ensure that these field names match your database schema
    const insertQuery = `
      INSERT INTO courses (name, description, price, participantsnumber, age, date, photo)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *; 
    `;

    // Execute the query
    const result = await db.query(insertQuery, [
      name,
      description,
      price,
      participantsnumber,
      age,
      date,
      photo,
    ]);

    // If the result is not present or the array is empty, throw an error
    if (!result.rows || result.rows.length === 0) {
      throw new Error("Insert failed");
    }

    // Send back the new course data, including the id
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error adding new course:", error);
    res.status(500).json({ message: "Error adding new course" });
  }
});

app.get("/paints", async (req, res) => {
  //  let products = await db.query("SELECT * FROM products");
  let product = await db.query("select * from products where category_id = 2");
  res.json(product.rows);
});

app.get("/GetProduct", async (req, res) => {
  //  let products = await db.query("SELECT * FROM products");
  let product = await db.query(
    "SELECT c.id as categoryid ,c.name as categoryname, p.id,p.name as productname, p.description , p.price  FROM category as c INNER JOIN products as p on c.id = p.category_id "
  );
  res.json(product.rows);
});

app.get("/orders", async (req, res) => {
  const cookies = req.cookies || {};
  const userId = cookies.userid ? cookies.userid[0] : null;

  if (!userId) {
    return res.status(401).json({
      status: false,
      message: "Please log in to view your orders.",
    });
  }

  try {
    const orders = await db.query("SELECT * FROM orders WHERE user_id = $1", [userId]);
    console.log(`Orders fetched for user ${userId}: ${orders.rowCount}`);
    res.json({ status: true, orders: orders.rows });
  } catch (error) {
    console.error(`Error fetching orders for user ${userId}:`, error);
    res.status(500).json({
      status: false,
      message: "An error occurred while fetching orders.",
    });
  }
});

app.get("/userdetails", async (req, res) => {
  const cookies = req.cookies || {};
  const userId = cookies.userid ? cookies.userid[0] : null;

  if (!userId) {
    return res.status(401).json({
      status: false,
      message: "Please log in to view your profile details.",
    });
  }

  try {
    const users = await db.query("SELECT * FROM users WHERE id = $1", [userId]);
    console.log(`Details fetched for user ${userId}: ${users.rowCount}`);
    res.json({ status: true, user: users.rows[0] });
  } catch (error) {
    console.error(`Error fetching details for user ${userId}: `, error);
    res.status(500).json({ status: false, message: "Failed to fetch user details." });
  }
});

app.put("/userdetails", async (req, res) => {
  const cookies = req.cookies || {};
  const userId = cookies.userid ? cookies.userid[0] : null;
  const { userName, email } = req.body;

  if (!userId) {
    return res.status(401).json({
      status: false,
      message: "Please log in to update your details.",
    });
  }

  try {
    const updateQuery = `
      UPDATE users
      SET userName = $1, email = $2
      WHERE id = $3
    `;

    const result = await db.query(updateQuery, [userName, email, userId]);

    if (result.rowCount === 0) {
      return res.status(404).json({ status: false, message: "User not found" });
    }

    res.status(200).json({ status: true, message: "User details updated successfully" });
  } catch (error) {
    console.error("Error updating user details:", error);
    res.status(500).json({ status: false, message: "Error updating user details" });
  }
});

app.put("/userAddress", async (req, res) => {
  const cookies = req.cookies || {};
  const userId = cookies.userid ? cookies.userid[0] : null;
  const { address, postalcode } = req.body;

  if (!userId) {
    return res.status(401).json({
      status: false,
      message: "Please log in to update your address.",
    });
  }

  try {
    const result = await db.query(
      `UPDATE users SET address = $1, postalcode = $2 WHERE id = $3`,
      [address, postalcode, userId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ status: false, message: "User not found" });
    }

    res.status(200).json({ status: true, message: "User details updated successfully" });
  } catch (error) {
    console.error("Error updating user address:", error);
    res.status(500).json({ status: false, message: "Error updating user details" });
  }
});

app.put("/userAddress", async (req, res) => {
  const cookies = req.cookies || {};
  const userId = cookies.userid ? cookies.userid[0] : null;
  const { address, postalcode } = req.body;

  if (!userId) {
    return res.status(401).json({
      status: false,
      message: "Please log in to update your address.",
    });
  }

  try {
    const result = await db.query(
      `UPDATE users SET address = $1, postalcode = $2 WHERE id = $3`,
      [address, postalcode, userId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ status: false, message: "User not found" });
    }

    res.status(200).json({ status: true, message: "User details updated successfully" });
  } catch (error) {
    console.error("Error updating user address:", error);
    res.status(500).json({ status: false, message: "Error updating user details" });
  }
});
app.put("/userpassword", async (req, res) => {
  const userId = req.cookies.userid[0];
  const { oldPassword, newPassword } = req.body;

  if (!userId || !oldPassword || !newPassword) {
    return res.status(400).json({ message: "Missing fields" });
  }

  try {
    const userQueryResult = await db.query(
      `SELECT userPassword FROM users WHERE id = $1`,
      [userId]
    );
    console.log("Database query result:", userQueryResult.rows);

    // Fetch the user's current hashed password from the database
    const userPasswordHash = userQueryResult.rows[0].userpassword; // Use the correct case as it is in the database
    console.log("Hashed password from database:", userPasswordHash);

    // Continue with your logic...

    console.log("Old password from request:", oldPassword);
    console.log("Hashed password from database:", userPasswordHash);

    // Compare the provided old password with the hashed password from the database
    const match = await bcrypt.compare(oldPassword, userPasswordHash);

    if (match) {
      // If the passwords match, hash the new password
      const hashedNewPassword = await bcrypt.hash(newPassword, 10); // Adjust the salt rounds as necessary

      // Update the user's password in the database
      const updateResult = await db.query(
        `UPDATE users SET userPassword = $1 WHERE id = $2`,
        [hashedNewPassword, userId]
      );

      if (updateResult.rowCount === 0) {
        return res.status(404).json({ message: "Failed to update password" });
      }

      res.status(200).json({ message: "User password updated successfully" });
    } else {
      res.status(401).json({ message: "Old password is incorrect" });
    }
  } catch (error) {
    console.error("Error updating user password:", error);
    res.status(500).json({ message: "Error updating user password" });
  }
});
