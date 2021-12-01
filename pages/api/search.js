// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

const https = require("https");

export default function handler(req, res) {
  const handleError = (errorMessage) => {
    console.error(errorMessage);
    res.status(400).json({ error: errorMessage });
  };

  const handleSuccess = (data) => {
    // console.log(data);
    res.status(200).json(data);
  };

  const postData = JSON.stringify({
    bestMatchEnabled: true,
    canChangeKeyword: false,
    count: 20,
    countryCode: "SG",
    countryId: "1880251",
    includeSuggestions: false,
    locale: "en",
    sortParam: {
      fieldName: "3",
    },
    ...req.body,
  });

  console.log(postData);

  const request = https.request(
    "https://www.carousell.sg/api-service/search/cf/4.0/search/",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(postData),
      },
    },
    (res) => {
      let raw = "";

      res.on("data", (d) => {
        raw += d;
      });
      res.on("end", () => {
        try {
          const json = JSON.parse(raw).data;
          handleSuccess({
            results: json.results
              .map((obj) => obj.listingCard)
              .sort(
                (a, b) =>
                  b.aboveFold[0].timestampContent.seconds.low -
                  a.aboveFold[0].timestampContent.seconds.low
              ),
            searchContext: json.searchContext,
            session: json.session,
          });
        } catch (e) {
          handleError("JSON parse error");
        }
      });
    }
  );

  request.on("error", (error) => {
    handleError(error.message);
  });
  request.write(postData);
  request.end();
}
