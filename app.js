require("dotenv").load();
require("dotenv").config();

const axios = require("axios");

var express = require("express");
var app = express();
// var getURL = require('./getPostSignedURL');
app.set("port", process.env.PORT || 5000);

app.use(express.static(__dirname + "/public"));

app.get("/geturl", function (req, res) {
  // getURL.generatePresignedURL(req, res)
});

app.get("/callback", function (req, res) {
  // kakao callback
  // code 넘어옴
  console.log("query ", req.query);
  console.log("param ", req.params);
});

async function getKakaoProfile(token) {
  const url = "https://kapi.kakao.com/v2/user/me";
  const option = {
    headers: {
      Authorization: "Bearer " + token,
    },
  };

  try {
    const result = await axios.get(url, option);
    return result.data;
  } catch (err) {
    console.error(err);
    const errData = JSON.stringify(err.response.data);
    return err.response.data;
  }
}

app.get("/kakao_profile", async function (req, res) {
  console.log("query = ", req.query);
  console.log("query.token = ", req.query.token);
  console.log("param ", req.params);

  const token = req.query.token;

  const result = await getKakaoProfile(token);
  return res.status(200).json(result.data);

  //TODO : get profile
  // const url = "https://kapi.kakao.com/v2/user/me";
  // const option = {
  //   headers: {
  //     Authorization: "Bearer " + token,
  //   },
  // };

  // try {
  //   const result = await axios.get(url, option);
  //   return res.status(200).json(result.data);
  // } catch (err) {
  //   return res.status(400).json(err.response.data);
  // }

  // axios
  //   .get(url, option)
  //   .then((res2) => {
  //     console.log("res = ", res2);
  //     console.log("res.data = ", res2.data);
  //     res.status(200).json(res2.data);
  //   })
  //   .catch((err) => {
  //     console.error("err.data = ", err.data);
  //     console.error("err = ", err);
  //   });
  // console.log('------------------');
});

app.listen(app.get("port"), function () {
  console.log("Node app is running on http://localhost:" + app.get("port"));
});
