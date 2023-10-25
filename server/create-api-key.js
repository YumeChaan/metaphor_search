const client = require("./elasticsearch/client");

async function generateApiKeys(opts) {
  const body = await client.security.createApiKey({
    body: {
      name: "sinhala_poem_search_engine",
      role_descriptors: {
        earthquakes_example_writer: {
          cluster: ["monitor"],
          index: [
            {
              names: ["poems"],
              privileges: ["create_index", "write", "read", "manage"],
            },
          ],
        },
      },
    },
  });
  return Buffer.from(`${body.id}:${body.api_key}`).toString("base64");
}

generateApiKeys()
  .then(console.log)
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
