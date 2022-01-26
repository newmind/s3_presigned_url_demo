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
  const getURL = require('./getPostSignedURL');
  getURL.generatePresignedURL(req, res)
});

app.get("/callback", async (req, res) => {
  // kakao callback
  // code 넘어옴
  console.log("query ", req.query);
  console.log("param ", req.params);
  res.status(200).send({ok: 'hi'});
});

/**
 * 해당 요청건에 대해서는 5초 이내로 응답을 해야하며 
 * 결제진행은 HTTP_STATUS 200, 결제거절은 그 외의 응답을 해주면 되고, 
 * 5초 이내로 응답이 없을 시 Timeout이 발생하고 500응답을 받은 것으로 간주하고 결제는 중단된다.
 */
app.post("/payments/confirm", async (req, res) => {  
  console.log('/payments/confirm');
  console.log(req.body);
  // res.send({ status: "success", message: "일반 결제 성공" });

  // TODO: 다음에 대해 검증
  // 1. confirm_url에서 결제금액이 불일치 한 경우(PG사 요청한 금액 != DB에 저장된 주문서의 금액)
  // 2. confirm_url에서 상품의 재고가 부족한 경우

  // 실패 응답시 본문에 "reason" 이라는 필드가 있으면 
  // 해당 정보를 결제 실패 사유로 기록하고 callback함수의 rsp object에도 값을 확인 할 수 있다.
  const msg = '테스트로 실패시킴';
  // const reason = `가맹점 요청에 의해 결제를 중단합니다 (사유: ${msg})`; // 프론트에서 메시지 정제
  res.status(400).send({ status: "error", reason: msg });
});

// app.post("/payments/complete", async (req, res) => {
app.post("/payments/notify", async (req, res) => {  
  console.log('/payments/notify');
  console.log(req.body);

  // platform@wired
  // const IMP_API_KEY = '2369777178768647';
  // const IMP_SECRET_KEY = 'a79ed17548cde603374225a7172d137efd4010a3cf235e161b99dd2f27b12b243f665c34935bd83d';
  
  const IMP_API_KEY = "4708350361436322";
  const IMP_SECRET_KEY =
    "92c4ae08962b442acaa8e9f75a6dbf013e519a69b11353633c578ac4675bb3a7308c3df4ca549834";

  try {
    console.log(req.body);
    const { imp_uid, merchant_uid } = req.body; // req의 body에서 imp_uid, merchant_uid 추출

    // 액세스 토큰(access token) 발급 받기
    const getToken = await axios({
      url: "https://api.iamport.kr/users/getToken",
      method: "post", // POST method
      headers: { "Content-Type": "application/json" }, // "Content-Type": "application/json"
      data: {
        imp_key: IMP_API_KEY, // REST API 키
        imp_secret: IMP_SECRET_KEY, // REST API Secret
      },
    });
    const { access_token } = getToken.data.response; // 인증 토큰
    console.log("access_token", access_token);

    // imp_uid로 아임포트 서버에서 결제 정보 조회
    const getPaymentData = await axios({
      url: `https://api.iamport.kr/payments/${imp_uid}`, // imp_uid 전달
      method: "get", // GET method
      headers: { Authorization: access_token }, // 인증 토큰 Authorization header에 추가
    });
    const paymentData = getPaymentData.data.response; // 조회한 결제 정보
    console.log("paymentData", paymentData);

    //TODO: DB에서 결제되어야 하는 금액 조회
    //TODO: 결제 금액 검증하기

    res.send({ status: "success", message: "일반 결제 성공" });
  } catch (e) {
    console.error('error', e);
    res.status(400).send(e);
  }
});

// "/subscription/issue-billing"에 대한 POST 요청을 처리
app.post("/subscriptions/issue-billing", async (req, res) => {
  try {
    const {
      card_number, // 카드 번호
      expiry, // 카드 유효기간
      birth, // 생년월일
      pwd_2digit, // 카드 비밀번호 앞 두자리,
      customer_uid, // 카드(빌링키)와 1:1로 대응하는 값
    } = req.body; // req의 body에서 카드정보 추출
    console.log(card_number, expiry, birth, pwd_2digit, customer_uid);

    // 인증 토큰 발급 받기
    const getToken = await axios({
      url: "https://api.iamport.kr/users/getToken",
      method: "post", // POST method
      headers: { "Content-Type": "application/json" }, // "Content-Type": "application/json"
      data: {
        imp_key: "imp_apikey", // REST API 키
        imp_secret:
          "ekKoeW8RyKuT0zgaZsUtXXTLQ4AhPFW3ZGseDA6bkA5lamv9OqDMnxyeB9wqOsuO9W3Mx9YSJ4dTqJ3f", // REST API Secret
      },
    });
    const { access_token } = getToken.data.response; // 인증 토큰
    console.log("access_token", access_token);

    // 빌링키 발급 요청
    const issueBilling = await axios({
      url: `https://api.iamport.kr/subscribe/customers/${customer_uid}`,
      method: "post",
      headers: { Authorization: access_token }, // 인증 토큰 Authorization header에 추가
      data: {
        card_number, // 카드 번호
        expiry, // 카드 유효기간
        birth, // 생년월일
        pwd_2digit, // 카드 비밀번호 앞 두자리
      },
    });

    const { code, message } = issueBilling.data;
    if (code === 0) {
      // 빌링키 발급 성공
      res.send({
        status: "success",
        message: "Billing has successfully issued",
      });
    } else {
      // 빌링키 발급 실패
      res.send({ status: "failed", message });
    }
  } catch (e) {
    res.status(400).send(e);
  }
});

// "/billings" 에 대한 POST 요청을 처리
app.post("/billings", async (req, res) => {
  try {
    const { customer_uid } = req.body; // req body에서 customer_uid 추출
    console.log(customer_uid);
    console.log(req.body);
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
