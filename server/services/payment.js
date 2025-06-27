import PaytmChecksum from 'paytm-pg-node-sdk';
import axios from 'axios';
import { ApiError } from '../utils/apiError.js';
import { BAD_REQUEST, INTERNAL_SERVER_ERROR, PAGE_NOT_FOUND } from '../utils/apiResponseCode.js';
import { v4 as uuidv4 } from 'uuid';
import crypto from 'crypto';
import { StandardCheckoutPayRequest } from 'pg-sdk-node';
import PhonePeClient from '../config/phonePe.js';
import Payment from '../models/payment.js';
import Subscription from '../models/subscription.js';

const paymentInitiate = async (inputs, user) => {
    const paytmParams = {
        body: {
            requestType: 'Payment',
            mid: process.env.PAYTM_MID,
            websiteName: process.env.PAYTM_WEBSITE,
            orderId: inputs.orderId,
            callbackUrl: process.env.PAYTM_CALLBACK_URL,
            txnAmount: {
                value: inputs.amount.toString(),
                currency: 'INR',
            },
            userInfo: {
                custId: inputs.customerId,
                email: inputs.email,
                mobile: inputs.mobileNumber,
            },
        },
    };

    console.log("Payment params", paytmParams)

    try {
        // Generate checksum
        const checksum = await PaytmChecksum.generateSignature(
            JSON.stringify(paytmParams.body),
            process.env.PAYTM_MERCHANT_KEY
        );

        paytmParams.head = { signature: checksum };

        // Initiate transaction
        const response = await axios.post(
            `https://securegw-stage.paytm.in/theia/api/v1/initiateTransaction?mid=${process.env.PAYTM_MID}&orderId=${inputs.orderId}`,
            paytmParams,
            {
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        );

        if (!response.data.body.txnToken) {
            throw new ApiError(BAD_REQUEST, 'Failed to generate transaction token');
        }

        return {
            txnToken: response.data.body.txnToken,
            orderId: inputs.orderId,
            mid: process.env.PAYTM_MID,
            amount: inputs.amount,
        };
    } catch (error) {
        throw new ApiError(INTERNAL_SERVER_ERROR, 'Failed to initiate payment');
    }
}

const paymentCallback = async (inputs, user) => {

    const isValidChecksum = PaytmChecksum.verifySignature(
        JSON.stringify(inputs),
        process.env.PAYTM_MERCHANT_KEY,
        inputs.CHECKSUMHASH
    );

    if (!isValidChecksum) {
        throw new ApiError(BAD_REQUEST, 'Checksum verification failed');
    }

    // Verify transaction status
    const paytmParams = {
        body: {
            mid: process.env.PAYTM_MID,
            orderId: inputs.paytmResponse.ORDERID,
        },
    };
    try {
        // Generate checksum for status API
        const checksum = await PaytmChecksum.generateSignature(
            JSON.stringify(paytmParams.body),
            process.env.PAYTM_MERCHANT_KEY
        );
        paytmParams.head = { signature: checksum };

        // Verify transaction status
        const response = await axios.post(
            'https://securegw-stage.paytm.in/v3/order/status',
            paytmParams,
            {
                headers: { 'Content-Type': 'application/json' },
            }
        );

        const { STATUS, TXNAMOUNT, TXNID } = response.data.body;

        if (STATUS === 'TXN_SUCCESS') {
            // TODO: Update database or perform order fulfillment
            return {
                success: true,
                message: 'Transaction successful',
                data: { orderId: inputs.ORDERID, txnId: TXNID, amount: TXNAMOUNT, status: STATUS },
            };
        } else {
            return {
                success: false,
                message: 'Transaction failed or pending',
                data: { orderId: inputs.ORDERID, amount: TXNAMOUNT, status: STATUS },
            };
        }
    } catch (error) {
        throw new ApiError(INTERNAL_SERVER_ERROR, 'Failed to verify transaction status');
    }
}


const phonePePaymentInitiate = async (inputs, user, { updatePaymentStatus }) => {

    let subscription = await Subscription.findById({ _id: inputs.subscriptionId }).lean();
    if (!subscription) {
        throw new ApiError(BAD_REQUEST, 'Invalid subscription');
    }

    const transactionId = inputs.transactionId || `TXN_${uuidv4()}`;
    const request = StandardCheckoutPayRequest.builder()
        .merchantOrderId(transactionId)
        .amount(inputs.amount * 100) // Convert to paise
        .redirectUrl(`${process.env.FRONTEND_URL}/payment-status/${transactionId}`)
        .metaInfo({ planTitle: inputs.planTitle, billing: inputs.billing })
        .expireAfter(1800) // Set to 30 minutes
        .build();


    const phonePeClient = PhonePeClient()

    const response = await phonePeClient.pay(request);
    if (!response) throw new ApiError(INTERNAL_SERVER_ERROR, `Payment initiation failed`);

    const checkoutPageUrl = response.redirectUrl;
    const payment = await Payment.create({
        transactionId,
        merchantOrderId: transactionId,
        userId: user.id,
        subscriptionId: subscription._id,
        amount: inputs.amount,
        planTitle: inputs.planTitle,
        billing: inputs.billing,
        phone: inputs.phone,
        name: inputs.name,
        email: inputs.email,
        status: 'PENDING',
    })

    if (!payment) throw new ApiError(INTERNAL_SERVER_ERROR, 'Failed to create payment')
    await updatePaymentStatus(transactionId, { status: 'PENDING', transactionId });

    subscription = await Subscription.findByIdAndUpdate({ _id: subscription._id }, { transactionId: payment.transactionId });
    if (!subscription) throw new ApiError(INTERNAL_SERVER_ERROR, 'Failed to update subscription')

    return { success: true, paymentUrl: checkoutPageUrl, transactionId };

}

const phonePeStatus = async (inputs, user, { updatePaymentStatus }) => {
  
    let payment = await Payment.findOne({ transactionId: inputs.transactionId, userId: user._id }).lean();
    console.log("Payment: ", payment)
    if (!payment) {
        throw new ApiError(BAD_REQUEST, 'Payment not found');
    }

    const phonePeClient = PhonePeClient()
    const response = await phonePeClient.getOrderStatus(inputs.transactionId);
    if (!response) throw new ApiError(INTERNAL_SERVER_ERROR, `Status check failed`);

    payment = await Payment.findByIdAndUpdate(
        { _id: payment._id },
        { status: response.state, paymentDetails: response, updatedAt: new Date() },
        { new: true }
    );
    let subscription;
    if (response.state === 'COMPLETED') {
        const expiryDate = new Date();
        expiryDate.setDate(
            expiryDate.getDate() + (payment.billing === 'annual' ? 365 : 30)
        );
        subscription = await Subscription.findOneAndUpdate(
            { transactionId: inputs.transactionId },
            {
                status: 'ACTIVE',
                startDate: new Date(),
                expiryDate,
                updatedAt: new Date(),
            }
        );
        response.subscriptionStatus= subscription.status
    }

    await updatePaymentStatus(inputs.transactionId, {
        status: response.state,
        transactionId: inputs.transactionId,
        data: response,
    });

    return  response



}

const phonePePaymentCallback = async (params, inputs, { updatePaymentStatus }) => {
    const status = inputs.state || 'PENDING';

    try {
        const payment = await Payment.findOne({ transactionId: params.transactionId }).lean();
        if (payment) {
            payment.status = status;
            payment.paymentDetails = inputs;
            await payment.save();

            if (status === 'COMPLETED') {
                const subscription = await Subscription.findOne({ transactionId: params.transactionId });
                if (subscription) {
                    const expiryDate = new Date();
                    expiryDate.setDate(
                        expiryDate.getDate() + (subscription.billing === 'annual' ? 365 : 30)
                    );
                    subscription.status = 'ACTIVE';
                    subscription.startDate = new Date();
                    subscription.expiryDate = expiryDate;
                    await subscription.save();
                    console.log('Subscription activated via callback', { transactionId: params.transactionId, expiryDate });
                }
            }

            await updatePaymentStatus(params.transactionId, { status, transactionId: params.transactionId, data: inputs });
            console.log('Payment callback processed', { transactionId: params.transactionId, status });

        } else {
            console.log('Payment not found for callback', { transactionId: params.transactionId });
            throw new ApiError(PAGE_NOT_FOUND, null, 'Payment not found');
        }
    } catch (error) {
        throw new ApiError(INTERNAL_SERVER_ERROR, ('Callback processing failed'));
    }
}

const getPayemntById = async(params, user)=> {
    const payment  = await Payment.findOne({transactionId: params.transactionId, userId: user._id}).lean()
    return payment
}


const PaymentServices = {
    paymentInitiate,
    paymentCallback,
    phonePePaymentInitiate,
    phonePeStatus,
    phonePePaymentCallback,
    getPayemntById
}

export default PaymentServices;