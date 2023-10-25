import * as React from "react";
import axios from "axios";
import { useState } from "react";
import "./App.css";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";

const App = () => {
  const [searchItem, setSearchItem] = useState("");
  const [documents, setDocuments] = useState(null);

  const sendSearchRequest = () => {
    const results = {
      method: "GET",
      url: "http://localhost:3001/results",
      params: {
        PoemName: searchItem,
      },
    };
    axios
      .request(results)
      .then((response) => {
        console.log(response.data);
        setDocuments(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <div className="app">
      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={2}>
          <Grid item xs={11}>
            <TextField
              sx={{ width: "100%" }}
              // id="outlined-basic"
              // label="Outlined"
              // variant="outlined"
              value={searchItem}
              onChange={(e) => setSearchItem(e.target.value)}
            />
          </Grid>
          <Grid item xs={1}>
            <Button
              sx={{ width: "100%", height: "100%" }}
              variant="contained"
              onClick={sendSearchRequest}
            >
              Search
            </Button>
          </Grid>
        </Grid>
      </Box>

      {documents && (
        <div className="search-results">
          {documents.length > 0 ? (
            <p> Number of hits: {documents.length}</p>
          ) : (
            <p> No results found. Try broadening your search criteria.</p>
          )}
          <Box sx={{ flexGrow: 1 }}>
            <Grid container spacing={2}>
              {documents.map((document) => (
                <Grid item xs={6}>
                  <Card variant="outlined" sx={{ background: "#b3e0ff" }}>
                    {
                      <React.Fragment>
                        <CardContent>
                          <Typography
                            sx={{
                              fontSize: 20,
                              textAlign: "center",
                              fontWeight: "bold",
                            }}
                            color="text.primary"
                            gutterBottom
                          >
                            {document._source.PoemBook}
                          </Typography>
                          <Typography component="div">
                            Poet - {document._source.Poet}
                          </Typography>
                          <Typography component="div">
                            Poem Name -{" "}
                            {document._source.PoemName ===
                            "no PoemNames in the book"
                              ? "No Poem Names in the Book"
                              : document._source.PoemName}
                          </Typography>
                          <Typography component="div">
                            Line of the Poem - {document._source.Line}
                          </Typography>
                          <Typography component="div">
                            Is there any metophores -{" "}
                            {document._source.MetaphorPresentOrNot === "yes"
                              ? "Yes"
                              : "No"}
                          </Typography>
                          {document._source.MetaphorPresentOrNot === "yes" && (
                            <>
                              <Typography component="div">
                                Metophore - {document._source.MetaphoricalTerms}
                              </Typography>
                              <Typography component="div">
                                Source Domain - {document._source.Source}
                              </Typography>
                              <Typography component="div">
                                Target Domain - {document._source.Target}
                              </Typography>
                              <Typography component="div">
                                Meaning - {document._source.Interpretation}
                              </Typography>
                            </>
                          )}
                        </CardContent>
                      </React.Fragment>
                    }
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        </div>
      )}
    </div>
  );
};

export default App;
