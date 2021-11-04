// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

const https = require("https");

export default function handler(req, res) {
  console.log(req.body);

  const handleError = (errorMessage) => {
    console.error(errorMessage);
    res.status(400).json({ error: errorMessage });
  };

  const handleSuccess = (data) => {
    // console.log(data);
    res.status(200).json(data);
  };

  const data = JSON.stringify({
    bestMatchEnabled: true,
    canChangeKeyword: false,
    ccid: "1997",
    count: 100,
    countryCode: "SG",
    countryId: "1880251",
    includeSuggestions: false,
    locale: "en",
    ...req.body,
  });

  const request = https.request(
    "https://www.carousell.sg/api-service/search/cf/4.0/search/",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(data),
        // host: "www.carousell.sg",
      },
    },
    (res) => {
      let raw = "";

      res.on("data", (d) => {
        raw += d;
      });
      res.on("end", () => {
        handleSuccess(
          JSON.parse(raw).data.results.map((obj) => obj.listingCard)
        );
      });
    }
  );

  request.on("error", (error) => {
    handleError(error.message);
  });
  request.write(data);
  request.end();
}