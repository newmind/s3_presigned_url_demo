# s3_presigned_url_demo

https://medium.com/@aidan.hallett/securing-aws-s3-uploads-using-presigned-urls-aa821c13ae8d


http://localhost:5000/kakao.html

# test start 
```sh
npm run start
```

# kakao/naver login test

http://localhost:5000/kakao.html

http://localhost:5000/naver.html


# iamport test

webhook callback localhost 에서 받기

```sh
ngrok http localhost:5000
```

카카오 페이 결제시 callback 값
```json
{
  imp_uid: 'imp_056607798398',
  merchant_uid: 'merchant_test_1639020607210:jg',
  status: 'paid'
}
access_token f6c62ab633e0e5dd634e2bf7de7162547f877cfa
paymentData {
  amount: 1000,
  apply_num: '49573845',
  bank_code: null,
  bank_name: null,
  buyer_addr: '서울특별시 강남구 삼성동',
  buyer_email: 'iamport@siot.do',
  buyer_name: '구매자이름',
  buyer_postcode: '123-456',
  buyer_tel: '010-1234-5678',
  cancel_amount: 0,
  cancel_history: [],
  cancel_reason: null,
  cancel_receipt_urls: [],
  cancelled_at: 0,
  card_code: '361',
  card_name: 'BC카드',
  card_number: '*********',
  card_quota: 0,
  card_type: 0,
  cash_receipt_issued: false,
  channel: 'pc',
  currency: 'KRW',
  custom_data: null,
  customer_uid: null,
  customer_uid_usage: null,
  emb_pg_provider: 'kakaopay',
  escrow: false,
  fail_reason: null,
  failed_at: 0,
  imp_uid: 'imp_056607798398',
  merchant_uid: 'merchant_test_1639020607210:jg',
  name: '주문명:jg결제테스트',
  paid_at: 1639020656,
  pay_method: 'card',
  pg_id: 'INIpayTest',
  pg_provider: 'html5_inicis',
  pg_tid: 'StdpayCARDINIpayTest20211209123056320233',
  receipt_url: 'https://iniweb.inicis.com/DefaultWebApp/mall/cr/cm/mCmReceipt_head.jsp?noTid=StdpayCARDINIpayTest20211209123056320233&noMethod=1',
  started_at: 1639020607,
  status: 'paid',
  user_agent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.55 Safari/537.36',
  vbank_code: null,
  vbank_date: 0,
  vbank_holder: null,
  vbank_issued_at: 0,
  vbank_name: null,
  vbank_num: null
}

```