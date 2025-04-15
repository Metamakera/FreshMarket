const express = require("express");
const mongoose = require("mongoose");
const { GridFSBucket } = require("mongodb");

const router = express.Router();
const conn = mongoose.connection;
let gridFSBucket;

// Ensure GridFSBucket is initialized after MongoDB connection is established
conn.once("open", () => {
  gridFSBucket = new GridFSBucket(conn.db, { bucketName: "uploads" });
  console.log("✅ GridFSBucket initialized for image storage");
});

// ✅ Fetch Image by Image ID
router.get("/image/:id", async (req, res) => {
  try {
    const fileId = new mongoose.Types.ObjectId(req.params.id);

    // Check if file exists in GridFS
    const files = await conn.db.collection("uploads.files").findOne({ _id: fileId });
    if (!files) {
      return res.status(404).json({ error: "Image not found" });
    }

    // Set correct content type
    res.setHeader("Content-Type", files.metadata.contentType || "image/jpeg");

    // Stream image to response
    const downloadStream = gridFSBucket.openDownloadStream(fileId);
    downloadStream.pipe(res);

    downloadStream.on("error", () => res.status(404).json({ error: "Image not found" }));

  } catch (error) {
    res.status(500).json({ error: "Invalid image ID" });
  }
});

module.exports = router;
