const mongoose = require("mongoose");
const Grid = require("gridfs-stream");

let gfs, gridfsBucket;

const conn = mongoose.connection;
conn.once("open", () => {
  gridfsBucket = new mongoose.mongo.GridFSBucket(conn.db, { bucketName: "uploads" });
  gfs = Grid(conn.db, mongoose.mongo);
  gfs.collection("uploads");
});

module.exports = { gfs, gridfsBucket };
