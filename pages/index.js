import Head from "next/head";
import Image from "next/image";
import React, { useEffect, useState } from "react";

export default function Home() {
  const [searchResults, setSearchResults] = useState([]);
  const [searchResultsFiltered, setSearchResultsFiltered] = useState([]);
  const [field, setField] = useState("");
  const [loading, setLoading] = useState(false);
  const [minPrice, setMinPrice] = useState(null);
  const [maxPrice, setMaxPrice] = useState(null);
  const [filterBoosted, setFilterBoosted] = useState(false);

  const handleSubmit = (e) => {
    setLoading(true);
    e.preventDefault();
    fetch("/api/search", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: field,
        sortParam: { fieldName: 3 },
        filters: [
          {
            fieldName: "price",
            rangedFloat: {
              start: {
                value: minPrice ?? 0,
              },
              end: {
                value: maxPrice ?? 10000,
              },
            },
          },
        ],
      }),
    })
      .then((res) => res.json())
      .then((searchResults) => {
        setSearchResults(searchResults);
        setLoading(false);
      });
  };

  useEffect(() => {
    if (filterBoosted) {
      console.log("remove boosted");
      setSearchResultsFiltered(
        searchResults
          .slice()
          .filter(({ aboveFold }) => aboveFold[0].component == "time_created")
      );
    } else {
      console.log("add boosted");
      setSearchResultsFiltered(searchResults);
    }
  }, [searchResults, filterBoosted]);

  const convertTime = (timestamp) => {
    const seconds = Math.round(Date.now() / 1000 - timestamp);
    return seconds > 604800
      ? `${Math.round(seconds / 604800)}w ago`
      : seconds > 86400
      ? `${Math.round(seconds / 86400)}d ago`
      : seconds > 3600
      ? `${Math.round(seconds / 3600)}h ago`
      : seconds > 60
      ? `${Math.round(seconds / 60)}m ago`
      : `${seconds}s ago`;
  };

  const icon = (status) => {
    switch (status) {
      case "expired_bump":
        return "⚡";
      case "active_bump":
        return "⚡⚡";
      case "time_created":
        return "";
      default:
        return status;
    }
  };
  return (
    <div className="text-sm">
      <div className="flex flex-col mx-auto" style={{ maxWidth: "1000px" }}>
        <div className="mx-3">
          <div className="flex flex-col md:flex-row my-3 items-center">
            <div className="text-xl font-bold p-3">CAROUSEARCH</div>
            <div className="w-full">
              <form className="mx-3 " onSubmit={handleSubmit}>
                <div className="flex flex-col md:flex-row w-full">
                  <div className="w-full py-2">
                    <input
                      className="p-3 w-full bg-gray-100 outline-none border"
                      placeholder="search"
                      type="text"
                      value={field}
                      onChange={(e) => setField(e.target.value)}
                    />
                  </div>
                  <div className="flex w-full py-2">
                    <div className="w-full">
                      <input
                        className="p-3 w-full bg-gray-100 outline-none border"
                        placeholder="min price"
                        type="number"
                        value={minPrice}
                        onChange={(e) => setMinPrice(e.target.value)}
                      />
                    </div>
                    <div className="w-full">
                      <input
                        className="p-3 w-full bg-gray-100 outline-none border"
                        placeholder="max price"
                        type="number"
                        value={maxPrice}
                        onChange={(e) => setMaxPrice(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="py-2 w-full ml-0 md:ml-3">
                    <button className="bg-blue-500 rounded-lg py-3 px-6 w-full md:w-max">
                      Search
                    </button>
                  </div>
                </div>
              </form>
            </div>
            <div className="flex-grow" />
            <div>
              <input
                type="checkbox"
                checked={filterBoosted}
                onClick={() => setFilterBoosted(!filterBoosted)}
              />{" "}
              Hide Boosted
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 justify-items-center">
            {loading && <div>loading</div>}
            {!loading &&
              searchResultsFiltered.map(
                (
                  { seller, photoUrls, aboveFold, likesCount, price, title },
                  i
                ) => {
                  return (
                    <div
                      key={i}
                      style={{ maxWidth: "232px", height: "418px" }}
                      className="flex flex-col border p-3 rounded-md hover:bg-gray-100"
                    >
                      <div className="flex items-center pb-3">
                        <img
                          className="rounded-full h-10 "
                          src={seller?.profilePicture}
                        />
                        <div className="flex flex-col px-3">
                          <div className="">{seller?.username}</div>
                          <div className="text-gray-400">
                            {convertTime(
                              aboveFold[0].timestampContent.seconds.low
                            )}
                          </div>
                        </div>
                        <div className="flex-grow" />
                        <div>{icon(aboveFold[0].component)}</div>
                      </div>
                      <img
                        className="rounded-md"
                        style={{
                          width: "216px",
                          height: "216px",
                          objectFit: "cover",
                        }}
                        src={photoUrls[0]}
                      />
                      <div>{title.substring(0, 30)}</div>
                      <div className="font-semibold">{price}</div>
                      <div className="flex-grow" />
                      <div>{likesCount}💗</div>
                    </div>
                  );
                }
              )}
          </div>
        </div>
      </div>
    </div>
  );
}
