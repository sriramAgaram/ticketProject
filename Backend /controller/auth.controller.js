import pool from "../database/db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const signupController = async (req, res) => {
  const { name, email, password, role } = req.body;
  const query = `INSERT INTO auth (name , email , password ,role) values (? ,? ,?  ,?)`;

  const emailFindQuery = `SELECT * FROM auth WHERE email=?`;
  try {
    const [existingUser] = await pool.promise().query(emailFindQuery, [email]);

    if (existingUser.length > 0) {
      return res.status(400).json({
        success: false,
        message: `${email} is already signed try another email`,
      });
    }

    const saltingroundes = 12;

    const hashedPassword = await bcrypt.hash(password, saltingroundes);

    const [result] = await pool
      .promise()
      .query(query, [name, email, hashedPassword, role]);

    return res
      .status(201)
      .json({ success: true, message: "Sucessfully user Signed", result });
  } catch (error) {
    console.log(`Error from SignUp Controller ${error}`);
    return res.status(500).json({
      success: false,
      message: `Error from SignUp Controller ${error}`,
    });
  }
};

export const loginController = async (req, res) => {
  const { email, password } = req.body;

  const query = `SELECT * FROM auth WHERE email=?`;

  try {
    const [signedUser] = await pool.promise().query(query, [email]);

    if (signedUser.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Email not registered",
      });
    }

    const isPasswordMatch = await bcrypt.compare(
      password,
      signedUser[0]?.password
    );

    if (!isPasswordMatch) {
      return res.status(400).json({
        success: false,
        message: "Incorrect password",
      });
    }

    const userId = signedUser[0].id;
    const userRole = signedUser[0].role;

    const token = jwt.sign({ id: userId, role: userRole }, process.env.SECRET, {
      expiresIn: "1h",
    });

    return res.status(200).json({
      success: true,
      message: `${email} logged in successfully`,
      token,
      result: [
        // send user info along with token
        {
          id: signedUser[0].id,
          name: signedUser[0].name,
          email: signedUser[0].email,
          role: signedUser[0].role,
        },
      ],
    });
  } catch (error) {
    console.error(`Error from Login Controller ${error.message}`);

    return res.status(500).json({
      success: false,
      message: `Error from Login Controller ${error}`,
    });
  }
};

export const deleteUserController = async (req, res) => {
  const id = req.params.id;

  const query = `DELETE FROM auth WHERE id=?`;

  try {
    const [result] = await pool.promise().query(query, [id]);

    return res
      .status(200)
      .json({ success: true, message: "User Deleted Sucessfully ", result });
  } catch (error) {
    console.error(`Error from Delete Controller ${error}`);

    return res.status(500).json({
      success: false,
      message: `Error from Delete Controller ${error}`,
    });
  }
};

export const loggedUser = async (req, res) => {
  const user = req.user;

  const query = `SELECT * FROM auth WHERE id = ? `;

  try {
    const [result] = await pool.promise().query(query, [user.id]);
    return res
      .status(200)
      .json({ success: true, message: `User Fecthed SuccessFully`, result });
  } catch (error) {
    return res.status(404).json({ success: false, message: "User Not Logged" });
  }
};

export const getAllUser = async (req, res) => {
  const query = `SELECT * FROM auth WHERE role = ?`;

  try {
    const [result] = await pool.promise().query(query, ["admin"]);

    if (result.length === 0) {
      return res.status(404).json({
        success: false,
        message: `No admin users found in the database.`,
        result,
      });
    }

    return res.status(200).json({
      success: true,
      message: `All admin users fetched successfully.`,
      result,
    });
  } catch (error) {
    console.error(`Error from Get All User Controller: ${error}`);
    return res.status(500).json({
      success: false,
      message: `Internal server error while fetching users.`,
    });
  }
};
