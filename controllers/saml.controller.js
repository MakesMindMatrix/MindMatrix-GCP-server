const fs = require('fs');
const path = require('path');
const passport = require('passport');
const { Strategy: SamlStrategy } = require('passport-saml');
const User = require('../models/user.model');

function readFileTextSafe(filePath) {
    try {
        return fs.readFileSync(filePath, 'utf8');
    } catch (_e) {
        return '';
    }
}

function extractFirstCertFromMetadata(xmlText) {
    const match = xmlText.match(/<ds:X509Certificate>([^<]+)<\/ds:X509Certificate>/);
    return match ? match[1].replace(/\s+/g, '') : '';
}

function extractEntityIdFromSpMetadata(xmlText) {
    const match = xmlText.match(/entityID=\"([^\"]+)\"/);
    return match ? match[1] : undefined;
}

const idpMetadataPath = path.resolve(process.cwd(), 'beta-idp-metadata.xml');
const spMetadataPath = path.resolve(process.cwd(), 'sp-metadata.xml');

const idpMetadataXml = readFileTextSafe(idpMetadataPath);
const spMetadataXml = readFileTextSafe(spMetadataPath);

const idpCert = process.env.SAML_IDP_CERT || extractFirstCertFromMetadata(idpMetadataXml);
const entryPoint = process.env.SAML_IDP_SSO_URL || 'https://betaonline.vtu.ac.in/saml/login';
const callbackUrl = `${process.env.BASE_URL}/api/v1/saml/acs`;
const issuer = process.env.SAML_SP_ENTITY_ID || extractEntityIdFromSpMetadata(spMetadataXml) || `${process.env.BASE_URL}/api/v1/saml`;

console.log("idpcert\n",idpCert,"\nentrypoint\n",entryPoint, "\ncallbackurl\n",callbackUrl,"\nissuer\n",issuer)
passport.use(new SamlStrategy({
    entryPoint,
    issuer,
    callbackUrl,
    cert: idpCert,
    identifierFormat: 'urn:oasis:names:tc:SAML:1.1:nameid-format:emailAddress',
    disableRequestedAuthnContext: true,
    acceptedClockSkewMs: 5000,
}, async (profile, done) => {
    try {
        const email = profile.emailId || profile.mail || profile.nameID || profile['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'];
        if (!email) {
            return done(new Error('SAML response missing email'));
        }

        let user = await User.findOne({ email });
        if (!user) {
            user = await User.create({
                name: `${profile.firstName || ''} ${profile.lastName || ''}`.trim(),
                email,
                isverified: true,
                password: 'SAML_PLACEHOLDER_!23',
                avatar: { public_id: 'public_id', url: 'secure_url' }
            });
            user._needsOnboarding = true; 
        }

        // Attach course/batch info for later use
        user._courseId = profile.course_id;
        user._batchId = profile.batch_id;
        return done(null, user);
    } catch (err) {
        return done(err);
    }
}));

exports.initPassport = (app) => {
    app.use(passport.initialize());
};

exports.samlLogin = passport.authenticate('saml', { session: false });

exports.samlAcs = (req, res, next) => {
    passport.authenticate('saml', { session: false }, (err, user) => {
        if (err || !user) {
            return res.redirect(`${process.env.CLIENT_BASE_URL}/login?error=saml_auth_failed`);
        }

        const token = user.getJWTToken(user._id);
        const options = {
            expires: new Date(
                Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
            ),
            secure: true,
            httpOnly: true,
            sameSite: 'None'
        };
        res.cookie('token', token, options);

        // 👇 Decide redirect path based on user state
        if (user._needsOnboarding) {
            // Redirect to onboarding with course details
            // return res.redirect(`${process.env.CLIENT_BASE_URL}/onboarding?course=${user._courseId}&batch=${user._batchId}`);
            return res.redirect(`${process.env.CLIENT_BASE_URL}`);
        } else {
            // Redirect to course landing page directly
            // return res.redirect(`${process.env.CLIENT_BASE_URL}/courses/${user._courseId}?batch=${user._batchId}`);
            return res.redirect(`${process.env.CLIENT_BASE_URL}`);
        }
    })(req, res, next); 
};

exports.samlMetadata = (_req, res) => {
    if (spMetadataXml) {
        res.type('application/xml');
        return res.send(spMetadataXml);
    }
    return res.status(404).send('SP metadata not found');
};


