const express = require("express");
const db = require("../config/database");
const authModel = require("../models/auth");
const profileModel = require("../models/profile");
const uploadFile = require("../services/upload.services");
require("dotenv").config();
const app = express();
app.use(express.json());

exports.getUserData = async (req, res) => {
  try {
    const result = await profileModel.findOne({
      where: {
        id: req.params.id,
      },
      raw: true,
      include: [
        {
          model: authModel,
          attributes: ["email"],
        },
      ],
    });
    return res.status(200).json(result);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.deleteUserData = async (req, res) => {
  try {
    const userId = req.params.id;
    const result = await authModel.destroy({
      where: {
        id: userId,
      },
      include: [
        {
          model: profileModel,
          cascade: true,
        },
      ],
    });
    return res.json(result);
  } catch (e) {
    console.log("error deleting user:", e);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
exports.updateUserData = async (req, res) => {
  const authData = {
    email: req.body.email,
  };

  const profileData = {
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    nid: req.body.nid,
    profilePhoto: req.body.profilePhoto,
    isMarried: req.body.isMarried,
    age: req.body.age,
  };
  try {
    const userId = req.params.id;
    const profResult = await profileModel.update(profileData, {
      where: {
        id: userId,
      },
    });

    const authResult = await authModel.update(authData, {
      where: {
        id: userId,
      },
    });

    result = { profResult, authResult };

    return res.json(result);
  } catch (e) {
    console.log("error deleting user:", e);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.addImage = async (req, res) => {
  try {
    await uploadFile(req, res);

    if (req.file == undefined) {
      return res.status(400).send({ message: "Please upload a file!" });
    }
    const userId = req.params.id;
    const imgDir = process.cwd() + "/uploads/images/" + req.file.originalname;

    const profResult = await profileModel.update(
      { profilePhoto: imgDir },
      {
        where: {
          id: userId,
        },
      }
    );
    res.status(200).send({
      message: "Uploaded the file successfully: " + req.file.originalname,
    });
  } catch (err) {
    res.status(500).send({
      message: `Could not upload the file because ${err}`,
    });
  }
};
