const express = require("express");
const router = express.Router();
const client = require("../elasticsearch/client");
require("log-timestamp");
const fs = require("fs");

router.get("/poems", async function (req, res) {
  console.log("Loading Application...");
  res.json("Running Application...");

  const indexData = async () => {
    try {
      console.log("Retrieving data");

      const data = fs.readFileSync(
        __dirname + "/../../corpus/poems.json",
        "utf8"
      );
      const POEMS = JSON.parse(data);

      console.log("Data retrieved!");

      results = POEMS;
      //   console.log('Indexing data...');
      results.map(
        async (results) => (
          (poemObject = {
            PoemBook: results.PoemBook,
            Year: results.Year,
            Poet: results.Poet,
            PoemName: results.PoemName,
            Line: results.Line,
            MetaphorPresentOrNot: results.MetaphorPresentOrNot,
            CountOfTheMetaphor: results.CountOfTheMetaphor,
            MetaphoricalTerms: results.MetaphoricalTerms,
            Source: results.Source,
            Target: results.Target,
            Interpretation: results.Interpretation,
          }),
          await client.index({
            index: "poems",
            body: poemObject,
          })
        )
      );

      if (POEMS.length) {
        indexData();
      } else {
        console.log("Data has been indexed successfully!");
      }
    } catch (err) {
      console.log(err);
    }

    console.log("Preparing for the next round of indexing...");
  };
  // const indexData = async () => {
  //   try {
  //     console.log("Retrieving data");
  //     const data = fs.readFileSync(
  //       __dirname + "/../../corpus/poems.json",
  //       "utf8"
  //     );
  //     const POEMS = JSON.parse(data);
  //     console.log("Data retrieved!");

  //     const batchSize = 100; // Adjust this as needed
  //     for (let i = 0; i < POEMS.length; i += batchSize) {
  //       const batch = POEMS.slice(i, i + batchSize);
  //       await Promise.all(
  //         batch.map(async (results) => {
  //           const poemObject = {
  //             PoemBook: results.PoemBook,
  //             Year: results.Year,
  //             Poet: results.Poet,
  //             PoemName: results.PoemName,
  //             Line: results.Line,
  //             MetaphorPresentOrNot: results.MetaphorPresentOrNot,
  //             CountOfTheMetaphor: results.CountOfTheMetaphor,
  //             MetaphoricalTerms: results.MetaphoricalTerms,
  //             Source: results.Source,
  //             Target: results.Target,
  //             Interpretation: results.Interpretation,
  //           };
  //           await client.index({
  //             index: "poems",
  //             body: poemObject,
  //           });
  //         })
  //       );
  //     }

  //     console.log("Data has been indexed successfully!");
  //   } catch (err) {
  //     console.error(err);
  //   }

  //   console.log("Preparing for the next round of indexing...");
  // };

  indexData();
});

module.exports = router;
