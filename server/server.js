const { Client } = require("@elastic/elasticsearch");
const client = require("./elasticsearch/client");
const express = require("express");
const cors = require("cors");

const app = express();

const data = require("./data_management/retrieve_and_ingest_data");

app.use("/ingest_data", data);

app.use(cors());

app.get("/results", (req, res) => {
  const poemName = req.query.PoemName;

  async function sendESRequest() {
    const body = await client.search({
      index: "poems",
      body: {
        query: {
          bool: {
            should: [
              {
                bool: {
                  must: [
                    {
                      multi_match: {
                        query: poemName,
                        fields: [
                          "PoemBook",
                          "PoemName",
                          "Poet",
                          "Line",
                          "MetaphoricalTerms",
                          "Source",
                          "Target",
                          "Interpretation",
                        ],
                      },
                    },
                  ],
                },
              },
              {
                multi_match: {
                  query: poemName,
                  fields: [
                    "PoemBook",
                    "PoemName",
                    "Poet",
                    "Line",
                    "MetaphoricalTerms",
                    "Source",
                    "Target",
                    "Interpretation",
                  ],
                },
              },
            ],
          },
        },
        size: 100,
      },
    });
    res.json(body.hits.hits);
  }
  sendESRequest();
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => console.group(`Server started on ${PORT}`));
