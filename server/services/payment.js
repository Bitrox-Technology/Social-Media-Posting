import PaytmChecksum from 'paytm-pg-node-sdk';
import axios from 'axios';
import { ApiError } from '../utils/apiError.js';
import { BAD_REQUEST, INTERNAL_SERVER_ERROR } from '../utils/apiResponseCode.js';

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

const PaymentServices = {
    paymentInitiate,
    paymentCallback
}

export default PaymentServices;