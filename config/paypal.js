const paypal = require('paypal-rest-sdk');

require('dotenv').config();

const {PAYPAL_MODE,PAYPAL_CLIENT_ID,PAYPAL_CLIENT_SECRET} = process.env;

paypal.configure({
    'mode':PAYPAL_MODE,
    'client_id':PAYPAL_CLIENT_ID,
    'client_secret':PAYPAL_CLIENT_SECRET

})

const Pay = async (req, res) => {

    const create_payment_json = {
        "intent":"sale",
        "payer":{
            "payment_method":"paypal",
        },
        "redirect_urls":{
            "return_url":"http://localhost:3000/paypalsuccess",
            "cancel_url":"http://localhost:3000/paypalcancel",
        },
        "transactions":[{
            "item_list":{
                "items":[{
                    "name":"Book",
                    "sku":"001",
                    "price":"25.00",
                    "currency":"USD",
                    "quantity":1
                }]
            },
            "amount":{
                
            }
        }]
    }

};