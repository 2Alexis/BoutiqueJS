// // services/paymentAPI.js

// const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// exports.processPayment = (paymentDetails, callback) => {
//     const { cardNumber, cardExpiry, cardCVC, amount } = paymentDetails;

//     stripe.paymentIntents.create({
//         amount: amount * 100, // Stripe works with the smallest currency unit
//         currency: 'usd',
//         payment_method_data: {
//             type: 'card',
//             card: {
//                 number: cardNumber,
//                 exp_month: parseInt(cardExpiry.split('/')[0]),
//                 exp_year: parseInt(cardExpiry.split('/')[1]),
//                 cvc: cardCVC,
//             },
//         },
//         confirm: true,
//     })
//     .then(paymentIntent => {
//         callback(null, paymentIntent);
//     })
//     .catch(error => {
//         callback(error);
//     });
// };
const axios = require('axios');

exports.processPayment = (paymentDetails, callback) => {
    const { cardNumber, cardExpiry, cardCVC, amount } = paymentDetails;

    axios.post('https://challenge-js.ynovaix.com/payment', {
        cardNumber,
        cardExpiry,
        cardCVC,
        amount
    })
    .then(response => {
        callback(null, response.data);
    })
    .catch(error => {
        callback(error);
    });
};
