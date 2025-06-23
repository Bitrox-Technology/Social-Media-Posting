import { Env, StandardCheckoutClient } from "pg-sdk-node";

const PhonePeClient = () => {
    const phonePeClient = StandardCheckoutClient.getInstance(
        process.env.PHONEPE_CLIENT_ID,
        process.env.PHONEPE_CLIENT_SECRET,
        1, // Client version
        process.env.PHONEPE_ENV === 'SANDBOX' ? Env.SANDBOX : Env.PRODUCTION
    );

    return phonePeClient
}



export default PhonePeClient