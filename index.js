require("dotenv").config();

const express = require("express");
const axios = require("axios");

const app = express();
const PORT = 3000;

const HUBSPOT_ACCESS_TOKEN = process.env.HUBSPOT_ACCESS_TOKEN;

const CUSTOM_OBJECT = "2-267792298";

app.set("view engine", "pug");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static("public"));

const hubspot = axios.create({
  baseURL: "https://api.hubapi.com",
  headers: {
    Authorization: `Bearer ${HUBSPOT_ACCESS_TOKEN}`,
    "Content-Type": "application/json"
  }
});

app.get("/", async (req, res) => {
  try {
    const response = await hubspot.get(
      `/crm/v3/objects/${CUSTOM_OBJECT}`,
      {
        params: {
          properties: "name,author,genre"
        }
      }
    );

    res.render("homepage", {
      title: "Books | Integrating With HubSpot I Practicum",
      books: response.data.results
    });

  } catch (error) {
    console.error(
      "Error retrieving books:",
      error.response?.data || error.message
    );

    res.status(500).send("Unable to retrieve books from HubSpot.");
  }
});

app.get("/update-cobj", (req, res) => {
  res.render("updates", {
    title: "Update Custom Object Form | Integrating With HubSpot I Practicum"
  });
});


app.post("/update-cobj", async (req, res) => {
  try {
    const { name, author, genre } = req.body;

    await hubspot.post(
      `/crm/v3/objects/${CUSTOM_OBJECT}`,
      {
        properties: {
          name,
          author,
          genre
        }
      }
    );

    res.redirect("/");
  } catch (error) {
    console.error(
      "Error creating book:",
      error.response?.data || error.message
    );

    res.status(500).send("Unable to create the book.");
  }
});


app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});