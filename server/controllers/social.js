import { ApiResponse } from "../utils/apiResponse.js"
import { OK } from "../utils/apiResponseCode.js"
import SocialServices from "../services/social.js"
import i18n from "../utils/i18n.js"
import SocialValidation from "../validations/social.js"

const LinkedInAuthentication = async (req, res, next) => {
  try {
    let result = SocialServices.linkedInAuthentication(req.user)
    return res.status(200).json(new ApiResponse(OK, result, i18n.__("LINKEDIN_AUTHENTICATION")))
  } catch (error) {
    next(error)
  }

}

const LinkedInCallback = async (req, res, next) => {
  try {
    const result = await SocialServices.linkedInCallback(req.query);

    const script = `
      <html>
        <body>
          <p>Authentication successful. This window should close automatically. If not, please close it manually.</p>
          <script>
            (function() {
              setTimeout(() => {
                console.log('Closing popup window...');
                try {
                  window.close();
                } catch (closeErr) {
                  console.error('Error closing window:', closeErr);
                }
              }, 5000);
            })();
          </script>
        </body>
      </html>
    `;
    // socket
    res.set('Content-Type', 'text/html');
    return res.status(200).send(script);

  } catch (error) {
    console.error('LinkedIn authentication error:', error);

    const errorScript = `
      <html>
        <body>
          <p>Authentication failed. This window should close automatically. If not, please close it manually.</p>
          <p>Error: ${error.message}</p>
          <script>
            (function() {
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

const GetSocialAuthDetail = async (req, res, next) => {
  try {
    let result = await SocialServices.getSocialAuthDetail(req.user)
    return res.status(OK).json(new ApiResponse(OK, result, i18n.__("SOCIAL_AUTH_DETAIL_FETCHED")))
  } catch (error) {
    next(error)
  }
}


const LinkedInPost = async (req, res, next) => {
  try {
    let result = await SocialServices.scheduledLinkedPosts(req.body, req.user)
    return res.status(OK).json(new ApiResponse(OK, result, i18n.__("LINKED_POST_SUCCESS")))
  } catch (error) {
    next(error)
  }

}

const FacebookAuthentication = async (req, res, next) => {
  try {
    let result = SocialServices.facebookAuthentication(req.user)
    return res.status(200).json(new ApiResponse(OK, result, "Facebook Authentication URL generated successfully"))
  } catch (error) {
    next(error)
  }

}

const FacebookCallback = async (req, res, next) => {
  try {
    let result = await SocialServices.facebookCallback(req.query)
    const script = `
      <html>
        <body>
          <p>Authentication successful. This window should close automatically. If not, please close it manually.</p>
          <script>
            (function() {
              setTimeout(() => {
                console.log('Closing popup window...');
                try {
                  window.close();
                } catch (closeErr) {
                  console.error('Error closing window:', closeErr);
                }
              }, 5000);
            })();
          </script>
        </body>
      </html>
    `;
    // socket
    res.set('Content-Type', 'text/html');
    return res.status(200).send(script);

  } catch (error) {
    console.error('Facebook authentication error:', error);

    const errorScript = `
      <html>
        <body>
          <p>Authentication failed. This window should close automatically. If not, please close it manually.</p>
          <p>Error: ${error.message}</p>
          <script>
            (function() {
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

}


const FacebookPost = async (req, res, next) => {
  try {
    await SocialValidation.validateFacebookPostOnPage(req.body)
    let result = await SocialServices.scheduledFacebookPosts(req.body, req.user)
    return res.status(OK).json(new ApiResponse(OK, result, "Facebook Post URL generated successfully"))
  } catch (error) {
    next(error)
  }

}

const InstagramAuthentication = async (req, res, next) => {
  try {
    let result = await SocialServices.instagramAuthentication(req.user)
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
    let result = await SocialServices.scheduledInstagramPosts(req.body, req.user)
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
  FacebookCallback, FacebookPost, GetIGAccount, InstagramCreateMedia, InstagramPublishMedia, GetSocialAuthDetail
}
export default SocailMediaControllers;