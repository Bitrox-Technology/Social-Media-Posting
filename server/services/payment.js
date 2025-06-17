import PaytmChecksum from 'paytm-pg-node-sdk';
import axios from 'axios';
import { ApiError } from '../utils/ApiError.js';
import { BAD_REQUEST, INTERNAL_SERVER_ERROR } from '../utils/apiResponseCode.js';
import { v4 as uuidv4 } from 'uuid';
import crypto from 'crypto';

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

const generateChecksum = (payload, endpoint) => {
    if (!payload || !endpoint) {
        throw new Error('Payload and endpoint are required for checksum generation');
    }
    const stringToHash = payload + endpoint + process.env.PHONEPE_SALT_KEY;
    console.log("String Hash", stringToHash)
    const sha256 = crypto.createHash('sha256').update(stringToHash).digest('hex');
    console.log("Sha256", sha256)
    return `${sha256}###${process.env.PHONEPE_SALT_INDEX}`;
};

const phonePePaymentInitiate = async (inputs, user) => {
    if (!inputs.phone || !inputs.amount || !inputs.name || !inputs.email) {
        throw new ApiError(BAD_REQUEST, 'Missing required fields');
    }

    const transactionId = `TXN_${uuidv4()}`;

    const paymentPayload = {
        merchantId: process.env.PHONEPE_MERCHANT_ID,
        merchantUserId: `MUID_${uuidv4()}`,
        mobileNumber: inputs.phone,
        amount: Number(inputs.amount) * 100, // Convert to paise
        merchantTransactionId: transactionId,
        redirectUrl: `${process.env.REDIRECT_URL}?transactionId=${transactionId}`,
        redirectMode: 'POST',
        paymentInstrument: { type: 'PAY_PAGE' },
    };

    console.log("Payment Payload", paymentPayload)

    try {
        const payload = Buffer.from(JSON.stringify(paymentPayload)).toString('base64');
        const checksum = generateChecksum(payload, '/pg/v1/pay');

        const response = await axios.post(
            process.env.PHONEPE_API_URL,
            { request: payload },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'X-VERIFY': checksum,
                },
            }
        );

        if (!response.data.success || !response.data.data?.instrumentResponse?.redirectInfo?.url) {
            throw new ApiError(INTERNAL_SERVER_ERROR, 'Invalid response from PhonePe API');
        }

        return {
            success: true,
            message: 'Payment initiated successfully',
            redirectUrl: response.data.data.instrumentResponse.redirectInfo.url,
            transactionId,
        };
    } catch (error) {
        if (error.response) {
            // Handle specific PhonePe API errors
            const { code, message } = error.response.data;
            throw new ApiError(
                error.response.status,
                `PhonePe API Error: ${code || 'UNKNOWN'} - ${message || 'Unknown error'}`
            );
        }
        throw new ApiError(INTERNAL_SERVER_ERROR, `Payment initiation failed: ${error.message}`);
    }
}

const phonePeStatus = async (query) => {
    if (!query.transactionId) {
        throw new ApiError(BAD_REQUEST, 'Transaction ID required');
    }

    const stringToHash = `/pg/v1/status/${process.env.PHONEPE_MERCHANT_ID}/${query.transactionId}${process.env.PHONEPE_SALT_KEY}`;
    const checksum = generateChecksum(stringToHash, '');

    try {
        const response = await axios.get(
            `${process.env.PHONEPE_STATUS_URL}/${process.env.PHONEPE_MERCHANT_ID}/${transactionId}`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'X-VERIFY': checksum,
                    'X-MERCHANT-ID': process.env.PHONEPE_MERCHANT_ID,
                },
            }
        );

        const { success, data } = response.data;
        return {
            success,
            status: data.responseCode,
            transactionId,
            redirectUrl: success && data.responseCode === 'SUCCESS'
                ? process.env.FRONTEND_SUCCESS_URL
                : process.env.FRONTEND_FAILURE_URL,
        };
    } catch (error) {
        if (error.response) {
            const { code, message } = error.response.data;
            throw new ApiError(
                error.response.status,
                `PhonePe Status Error: ${code || 'UNKNOWN'} - ${message || 'Unknown error'}`
            );
        }
        throw new ApiError(INTERNAL_SERVER_ERROR, `Status check failed: ${error.message}`);
    }
}
const PaymentServices = {
    paymentInitiate,
    paymentCallback,
    phonePePaymentInitiate,
    phonePeStatus

}

export default PaymentServices;