require("dotenv").load();
require("dotenv").config();

const axios = require("axios");

var express = require("express");
var app = express();

// express > 4.16
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// var getURL = require('./getPostSignedURL');
app.set("port", process.env.PORT || 5000);

app.use(express.static(__dirname + "/public"));

app.get("/geturl", function (req, res) {
  // getURL.generatePresignedURL(req, res)
});

app.get("/callback", async (req, res) => {
  // kakao callback
  // code 넘어옴
  console.log("query ", req.query);
  console.log("param ", req.params);
});

app.post("/payments/complete", async (req, res) => {
  console.log(req.body);
  const REST_KEY = '4708350361436322';
  const REST_SECRET = '92c4ae08962b442acaa8e9f75a6dbf013e519a69b11353633c578ac4675bb3a7308c3df4ca549834';

  try {
    console.log(req.body);
    const { imp_uid, merchant_uid } = req.body; // req의 body에서 imp_uid, merchant_uid 추출

    // 액세스 토큰(access token) 발급 받기
    const getToken = await axios({
      url: "https://api.iamport.kr/users/getToken",
      method: "post", // POST method
      headers: { "Content-Type": "application/json" }, // "Content-Type": "application/json"
      data: {
        imp_key: REST_KEY, // REST API 키
        imp_secret: REST_SECRET, // REST API Secret
      }
    });
    const { access_token } = getToken.data.response; // 인증 토큰
    console.log('access_token', access_token);

    // imp_uid로 아임포트 서버에서 결제 정보 조회
    const getPaymentData = await axios({
      url: `https://api.iamport.kr/payments/${imp_uid}`, // imp_uid 전달
      method: "get", // GET method
      headers: { "Authorization": access_token } // 인증 토큰 Authorization header에 추가
    });
    const paymentData = getPaymentData.data.response; // 조회한 결제 정보
    console.log('paymentData', paymentData);

    //TODO: DB에서 결제되어야 하는 금액 조회
    //TODO: 결제 금액 검증하기

  } catch (e) {
    res.status(400).send(e);
  }
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
