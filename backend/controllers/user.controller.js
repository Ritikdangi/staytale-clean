import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";

// Update user details
export const updateUser = async (req, res) => {
  try {
    if (req.user.id !== req.params.id) {
      return res.status(401).send({
        success: false,
        message: "You can only update your own account. Please log in again!",
      });
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          username: req.body.username,
          email: req.body.email,
          address: req.body.address,
          phone: req.body.phone,
          // role: req.body.role // Uncomment if you want to allow role updates
        },
      },
      { new: true }
    );

    const { password, ...rest } = updatedUser._doc;

    res.status(200).send({
      success: true,
      message: "User details updated successfully",
      user: rest,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).send({
        success: false,
        message: "Email already taken, please login!",
      });
    }
    return res.status(500).send({
      success: false,
      message: "Server error",
    });
  }
};

// Update user profile photo
export const updateProfilePhoto = async (req, res) => {
  try {
    if (req.user.id !== req.params.id) {
      return res.status(401).send({
        success: false,
        message: "You can only update your own profile photo. Please log in again!",
      });
    }

    const updatedProfilePhoto = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: { avatar: req.body.avatar },
      },
      { new: true }
    );

    const { password, ...rest } = updatedProfilePhoto._doc;

    res.status(200).send({
      success: true,
      message: "Profile photo updated successfully",
      user: rest,
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: "Error updating profile photo",
    });
  }
};

// Update user password
export const updateUserPassword = async (req, res) => {
  try {
    if (req.user.id !== req.params.id) {
      return res.status(401).send({
        success: false,
        message: "You can only update your own account password. Please log in again!",
      });
    }

    const validUser = await User.findById(req.params.id);

    if (!validUser) {
      return res.status(404).send({
        success: false,
        message: "User not found!",
      });
    }

    const validPassword = bcryptjs.compareSync(req.body.oldpassword, validUser.password);
    if (!validPassword) {
      return res.status(400).send({
        success: false,
        message: "Invalid current password",
      });
    }

    const hashedNewPassword = bcryptjs.hashSync(req.body.newpassword, 10);
    await User.findByIdAndUpdate(req.params.id, { password: hashedNewPassword });

    res.status(200).send({
      success: true,
      message: "Password updated successfully",
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: "Server error updating password",
    });
  }
};

// Delete user account
export const deleteUserAccount = async (req, res) => {
  try {
    if (req.user.id !== req.params.id) {
      return res.status(401).send({
        success: false,
        message: "You can only delete your own account!",
      });
    }

    await User.findByIdAndDelete(req.params.id);
    res.clearCookie("X_TTMS_access_token");
    res.status(200).send({
      success: true,
      message: "User account deleted successfully",
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: "Error deleting user account",
    });
  }
};

// Get all users (admin only)
export const getAllUsers = async (req, res) => {
  try {
    const searchTerm = req.query.searchTerm || "";
    const users = await User.find({
      role: 'user', // Fetching users with role 'user'
      $or: [
        { username: { $regex: searchTerm, $options: "i" } },
        { email: { $regex: searchTerm, $options: "i" } },
        { phone: { $regex: searchTerm, $options: "i" } },
      ],
    });

    if (users.length > 0) {
      res.status(200).send(users);
    } else {
      res.status(404).send({
        success: false,
        message: "No users found",
      });
    }
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: "Error fetching users",
    });
  }
};

// Delete user account (admin only)
export const deleteUserAccountAdmin = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).send({
        success: false,
        message: "User not found",
      });
    }

    if (user.role === 'admin') {
      return res.status(403).send({
        success: false,
        message: "Cannot delete an admin account",
      });
    }

    await User.findByIdAndDelete(req.params.id);
    res.status(200).send({
      success: true,
      message: "User account deleted successfully",
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: "Error deleting user account",
    });
  }
};
