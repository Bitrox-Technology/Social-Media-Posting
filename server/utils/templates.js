export const userTemplate = (code) => { 
  return `
    <div style="font-family: 'Poppins', 'Arial', sans-serif; line-height: 1.6; color: #333; background-color: #f4f7fa; padding: 20px;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 15px; overflow: hidden; box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);">
        
        <!-- Header with Gradient -->
        <div style="background: linear-gradient(135deg, #4f46e5 0%, #a855f7 100%); padding: 30px 20px; text-align: center;">
          <img src="https://res.cloudinary.com/deuvfylc5/image/upload/v1746011885/qubuptite8g43g35fmnn.png" alt="SocialAI Logo" style="max-width: 150px; margin-bottom: 10px;" />
          <h1 style="color: #ffffff; font-size: 28px; margin: 0; font-weight: 600;">Transform Your Social Media</h1>
          <p style="color: #e0e7ff; font-size: 16px; margin: 5px 0 0;">AI-Powered Content Creation</p>
        </div>

        <!-- Body -->
        <div style="padding: 30px 20px; text-align: center;">
          <p style="font-size: 16px; color: #4b5563; margin: 0 0 15px;">Hello Valued User,</p>
          <p style="font-size: 16px; color: #4b5563; margin: 0 0 20px;">
            Thank you for joining our platform! Verify your account to unlock the power of AI-driven content creation for your social media. Use the OTP below:
          </p>

          <!-- OTP Box -->
          <div style="display: inline-block; padding: 15px 30px; background-color: #eff6ff; border-radius: 10px; border: 1px solid #dbeafe; margin: 20px 0;">
            <span style="font-size: 24px; font-weight: 700; color: #4f46e5; letter-spacing: 3px;">${code}</span>
          </div>

          <p style="font-size: 14px; color: #6b7280; margin: 0 0 20px;">
            This OTP is valid for <strong>10 minutes</strong>. Please do not share it with anyone.
          </p>
          <p style="font-size: 14px; color: #6b7280; margin: 0 0 20px;">
            If you didn’t request this email, you can safely ignore it.
          </p>
          <p style="font-size: 16px; color: #4b5563; margin: 0;">
            Ready to elevate your social media game? Let’s get started!
          </p>
        </div>

        <!-- Footer -->
        <div style="background-color: #f9fafb; padding: 20px; text-align: center; border-top: 1px solid #e5e7eb;">
          <p style="font-size: 14px; color: #6b7280; margin: 0 0 5px;">
            Best Regards,<br>The SocialAI Team
          </p>
          <p style="font-size: 12px; color: #9ca3af; margin: 10px 0 0;">
            Need help? Reach out at 
            <a href="mailto:support@socialai.com" style="color: #4f46e5; text-decoration: none; font-weight: 500;">support@socialai.com</a>
          </p>
        </div>
      </div>
    </div>
  `
}

export const adminTemplate =  (code) => { 
  return `
    <div style="font-family: 'Poppins', Arial, sans-serif; line-height: 1.6; color: #333; background-color: #f4f7fa; padding: 20px;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 15px; overflow: hidden; box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);">
        <!-- Header with Gradient -->
        <div style="background: linear-gradient(135deg, #4f46e5 0%, #a855f7 100%); padding: 30px 20px; text-align: center;">
          <img src="https://res.cloudinary.com/deuvfylc5/image/upload/v1746011885/qubuptite8g43g35fmnn.png" alt="SocialAI Admin Logo" style="max-width: 150px; margin-bottom: 10px;" />
          <h1 style="color: #ffffff; font-size: 28px; margin: 0; font-weight: 600;">SocialAI Admin Panel</h1>
          <p style="color: #e0e7ff; font-size: 16px; margin: 5px 0 0;">Secure Access for Administrators</p>
        </div>

        <!-- Body -->
        <div style="padding: 30px 20px; text-align: center;">
          <p style="font-size: 16px; color: #4b5563; margin: 0 0 15px;">Dear Admin,</p>
          <p style="font-size: 16px; color: #4b5563; margin: 0 0 20px;">
            Secure your access to the SocialAI Admin Panel by verifying your account. Use the OTP below to complete the verification process:
          </p>

          <!-- OTP Box -->
          <div style="display: inline-block; padding: 15px 30px; background-color: #eff6ff; border-radius: 10px; border: 1px solid #dbeafe; margin: 20px 0;">
            <span style="font-size: 24px; font-weight: 700; color: #4f46e5; letter-spacing: 3px;">${code}</span>
          </div>

          <p style="font-size: 14px; color: #6b7280; margin: 0 0 20px;">
            This OTP is valid for <strong>10 minutes</strong>. Do not share it with anyone.
          </p>
          <p style="font-size: 14px; color: #6b7280; margin: 0 0 20px;">
            If you didn’t initiate this request, please contact support immediately.
          </p>
          <p style="font-size: 16px; color: #4b5563; margin: 0;">
            Thank you for managing the SocialAI platform!
          </p>
        </div>

        <!-- Footer -->
        <div style="background-color: #f9fafb; padding: 20px; text-align: center; border-top: 1px solid #e5e7eb;">
          <p style="font-size: 14px; color: #6b7280; margin: 0 0 5px;">
            Best Regards,<br>SocialAI Admin Team
          </p>
          <p style="font-size: 12px; color: #9ca3af; margin: 10px 0 0;">
            For assistance, reach out at 
            <a href="mailto:admin-support@socialai.com" style="color: #4f46e5; text-decoration: none; font-weight: 500;">admin-support@socialai.com</a>
          </p>
        </div>
      </div>
    </div>
  `
}