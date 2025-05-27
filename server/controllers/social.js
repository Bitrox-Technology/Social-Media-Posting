import { ApiResponse } from "../utils/ApiResponse.js"
import { OK } from "../utils/apiResponseCode.js"
import SocialServices from "../services/social.js"
import i18n from "../utils/i18n.js"

const LinkedInAuthentication = async (req, res, next) => {
    try {
        let result = SocialServices.linkedInAuthentication()
        return res.status(200).json(new ApiResponse(OK, result, i18n.__("LINKEDIN_AUTHENTICATION")))
    } catch (error) {
        next(error)
    }

}

const LinkedInCallback = async (req, res, next) => {
  try {
    const { profileData, accessToken } = await SocialServices.linkedInCallback(req.query);

    const script = `
      <html>
        <body>
          <p>Authentication successful. This window should close automatically. If not, please close it manually.</p>
          <button onclick="window.close()">Close Window</button>
          <script>
            (function() {
              const message = {
                platform: 'linkedin',
                success: true,
                accessToken: '${accessToken}',
                profileData: ${JSON.stringify(profileData)}
              };
              
              console.log('Sending success message to parent window:', message);
              
              try {
                if (window.opener && !window.opener.closed) {
                  console.log('Posting message to opener...');
                  // Use specific origin in production instead of '*'
                  window.opener.postMessage(message, 'http://localhost:5173');
                  
                  // Also dispatch a custom event as a fallback
                  const event = new CustomEvent('socialAuthComplete', { 
                    detail: message 
                  });
                  window.opener.document.dispatchEvent(event);
                  
                  console.log('Message sent successfully');
                } else {
                  console.warn('No valid opener found. Cannot post message.');
                }
              } catch (err) {
                console.error('Error posting message:', err);
              }
              
              // Close the popup after a short delay
              setTimeout(() => {
                console.log('Closing popup window...');
                try {
                  window.close();
                } catch (closeErr) {
                  console.error('Error closing window:', closeErr);
                }
              }, 10000);
            })();
          </script>
        </body>
      </html>
    `;

    res.set('Content-Type', 'text/html');
    return res.status(200).send(script);

  } catch (error) {
    console.error('LinkedIn authentication error:', error);
    
    const errorScript = `
      <html>
        <body>
          <p>Authentication failed. This window should close automatically. If not, please close it manually.</p>
          <button onclick="window.close()">Close Window</button>
          <script>
            (function() {
              const message = {
                platform: 'linkedin',
                success: false,
                error: 'Authentication failed',
                details: '${error.message || 'Unknown error'}'
              };
              
              console.log('Sending error message to parent window:', message);
              
              try {
                if (window.opener && !window.opener.closed) {
                  // Use specific origin in production instead of '*'
                  window.opener.postMessage(message, 'http://localhost:5173');
                  
                  // Also dispatch a custom event as a fallback
                  const event = new CustomEvent('socialAuthComplete', { 
                    detail: message 
                  });
                  window.opener.document.dispatchEvent(event);
                } else {
                  console.warn('No valid opener found for error message.');
                }
              } catch (err) {
                console.error('Error posting error message:', err);
              }
              
              setTimeout(() => {
                try {
                  window.close();
                } catch (closeErr) {
                  console.error('Error closing error window:', closeErr);
                }
              }, 3000);
            })();
          </script>
        </body>
      </html>
    `;

    res.set('Content-Type', 'text/html');
    return res.status(500).send(errorScript);
  }
};


const LinkedInPost = async (req, res, next) => {
    try {
        let result = await SocialServices.linkedInPost(req.body)
        if (req.body.scheduleTime) {
            result = await schedulePost(SocialServices.linkedInPost(req.body), req.body, scheduleTime);
        } else {
            result = await SocialServices.linkedInPost(req.body)
        }
        return res.status(OK).json(new ApiResponse(OK, result, i18n.__("LINKED_POST_SUCCESS")))
    } catch (error) {
        next(error)
    }

}

const FacebookAuthentication = async (req, res, next) => {
    try {
        let result = SocialServices.facebookAuthentication()
        return res.status(200).json(new ApiResponse(OK, result, "Facebook Authentication URL generated successfully"))
    } catch (error) {
        next(error)
    }

}

const FacebookCallback = async (req, res, next) => {
    try {
        let result = await SocialServices.facebookCallback(req.query)
        return res.status(OK).json(new ApiResponse(OK, result, "Facebook Callback URL generated successfully"))
    } catch (error) {
        next(error)
    }

}


const FacebookPost = async (req, res, next) => {
    try {
        let result = await SocialServices.facebookPost(req.body)
        return res.status(OK).json(new ApiResponse(OK, result, "Facebook Post URL generated successfully"))
    } catch (error) {
        next(error)
    }

}

const InstagramAuthentication = async (req, res, next) => {
    try {
        let result = await SocialServices.instagramAuthentication()
        return res.status(200).json(new ApiResponse(OK, result, "Instagram Authentication URL generated successfully"))
    } catch (error) {
        next(error)
    }

}

const InstagramCallback = async (req, res, next) => {

    console.log("Query", req.query)
    try {
        let result = await SocialServices.instagramCallback(req.query)
        return res.status(OK).json(new ApiResponse(OK, result, "Instagram Callback URL generated successfully"))
    } catch (error) {
        next(error)
    }

}

const GetIGAccount = async (req, res, next) => {
    try {
        let result = await SocialServices.getIGAccount(pageId, pageAccessToken)
        return res.status(OK).json(new ApiResponse(OK, result, "Instagram Account fetched successfully"))
    } catch (error) {
        next(error)
    }

}


const InstagramCreateMedia = async (req, res, next) => {
    try {
        let result = await SocialServices.instagramCreateMedia(req.body)
        return res.status(OK).json(new ApiResponse(OK, result, "Instagram Media created successfully"))
    } catch (error) {
        next(error)
    }

}

const InstagramPublishMedia = async (req, res, next) => {
    try {
        let result = await SocialServices.instagramPublishMedia(req.body)
        return res.status(OK).json(new ApiResponse(OK, result, "Instagram Media published successfully"))
    } catch (error) {
        next(error)
    }

}


const SocailMediaControllers = {
    LinkedInAuthentication, LinkedInCallback, LinkedInPost, FacebookAuthentication, InstagramAuthentication, InstagramCallback,
    FacebookCallback, FacebookPost, GetIGAccount, InstagramCreateMedia, InstagramPublishMedia
}
export default SocailMediaControllers;