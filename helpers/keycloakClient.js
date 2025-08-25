// keycloakClient.js
const { Issuer } = require("openid-client");

let client;

async function getClient() {
  if (client) return client;

  const keycloakIssuer = await Issuer.discover(
    `http://localhost:8080/realms/master/.well-known/openid-configuration`
  );

  client = new keycloakIssuer.Client({
    client_id: process.env.KEYCLOAK_CLIENT_ID,
    client_secret: process.env.KEYCLOAK_CLIENT_SECRET,
    redirect_uris: [`${process.env.BASE_URL}/api/v1/auth/callback/keycloak`],
    response_types: ["code"]
  });

  return client;
}

module.exports = { getClient };
