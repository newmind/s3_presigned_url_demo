var AWS = require("aws-sdk");
var mime = require("mime-types");

var credentials = {
  accessKeyId: process.env.S3_ACCESS_KEY,
  secretAccessKey: process.env.S3_SECRET_KEY,
};
AWS.config.update({
  credentials: credentials,
  region: process.env.S3_REGION,
});

var s3 = new AWS.S3();

// public-read 로 업로드하기
// https://stackoverflow.com/questions/59484157/how-to-make-an-aws-s3-file-public-accessible-using-aw-s3-sdks-createpresignedpo
const params = {
  Bucket: process.env.S3_BUCKET,
  Expires: 10000000, //time to expire in seconds

  Fields: {
    key: "test",
    acl: "public-read", // 파일 보다 먼저 이 필드가 추가가 되어야 함
  },
  conditions: [
    { acl: "public-read" },
    { success_action_status: "201" },
    //   ["starts-with", "$key", ""][("content-length-range", 0, 100000)],
    ["content-length-range", 100, 10000000], // 100Byte - 10MB
    { "x-amz-algorithm": "AWS4-HMAC-SHA256" },
  ],
};

exports.generatePresignedURL = function (req, res) {
  params.Fields.key = req.query.filename || "filename";
  params.Fields["Content-Type"] = mime.lookup(params.Fields.key);
  s3.createPresignedPost(params, function (err, data) {
    if (err) {
      console.log("Error", err);
      res.status(500).json({
        msg: "Error",
        Error: "Error creating presigned URL",
      });
    } else {
      res.status(200).json(data);
    }
  });
};
