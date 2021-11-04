import React, { useRef, useState } from "react";

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [field, setField] = useState(null);
  const [minPrice, setMinPrice] = useState(null);
  const [maxPrice, setMaxPrice] = useState(null);
  const [filterBoosted, setFilterBoosted] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [category, setCategory] = useState({
    label: "All Categories",
    id: null,
  });
  const sessionRef = useRef(null);
  const searchContextRef = useRef(null);

  const fetchData = () => {
    let postData = {
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
              value: maxPrice ?? 1000000,
            },
          },
        },
      ],
    };

    if (sessionRef.current && searchContextRef.current) {
      postData = {
        ...postData,
        session: sessionRef.current,
        searchContext: searchContextRef.current,
      };
    }
    if (category.id) {
      postData.filters.push({
        fieldName: "collections",
        idsOrKeywords: {
          value: [`${category.id}`],
        },
      });
    }
    console.log(postData);

    return fetch("/api/search", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(postData),
    })
      .then((res) => res.json())
      .then(({ session, searchContext, results }) => {
        sessionRef.current = session;
        searchContextRef.current = searchContext;
        setLoading(false);
        return results;
      });
  };

  const handleSubmit = (e) => {
    setLoading(true);
    e.preventDefault();
    sessionRef.current = null;
    searchContextRef.current = null;
    fetchData().then(setSearchResults);
  };

  const loadMore = () => {
    fetchData().then((results) => {
      setSearchResults([...searchResults, ...results]);
    });
  };

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

  const categories = [
    { label: "All Categories", id: null },
    { label: "Cars", id: 32 },
    { label: "Home Services", id: 1306 },
    { label: "Property", id: 102 },
    { label: "Computers And Tech", id: 213 },
    { label: "Mobile Phones and Gadgets", id: 215 },
    { label: "Women's Fashion", id: 4 },
    { label: "Men's Fashion", id: 3 },
    { label: "Beauty & Personal Care", id: 11 },
    { label: "Luxury", id: 20 },
    { label: "Video Gaming", id: 264 },
    { label: "Audio", id: 207 },
    { label: "Photography", id: 6 },
    { label: "Furniture and Home", id: 13 },
    { label: "Car Accessories", id: 109 },
    { label: "TV & Home Applicances", id: 30 },
    { label: "Babies & Kids", id: 19 },
    { label: "Motorcycles", id: 108 },
    { label: "Hobbies & Toys", id: 5934 },
    { label: "Health & Nutrition", id: 5953 },
    { label: "Sports & Equipment", id: 10 },
    { label: "Food and Drinks", id: 196 },
    { label: "Pet Supplies", id: 29 },
    { label: "Tickets Vouchers", id: 18 },
    { label: "Learning & Enrichment", id: 1742 },
    { label: "Lifestyle Services", id: 1916 },
    { label: "Lifestyle Services", id: 1916 },
    { label: "Business Services", id: 1747 },
    { label: "Jobs", id: 1305 },
  ];

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
                      className="p-3 w-full active:bg-gray-100 hover:bg-gray-100 outline-none border"
                      placeholder="search"
                      type="text"
                      value={field}
                      onChange={(e) => setField(e.target.value || null)}
                    />
                  </div>
                  <div className="flex w-full py-2">
                    <div className="w-full">
                      <input
                        className="p-3 w-full active:bg-gray-100 hover:bg-gray-100 outline-none border"
                        placeholder="min $"
                        type="number"
                        value={minPrice}
                        onChange={(e) => setMinPrice(e.target.value)}
                      />
                    </div>
                    <div className="w-full">
                      <input
                        className="p-3 w-full active:bg-gray-100 hover:bg-gray-100 outline-none border"
                        placeholder="max $"
                        type="number"
                        value={maxPrice}
                        onChange={(e) => setMaxPrice(e.target.value)}
                      />
                    </div>
                  </div>
                  <div
                    className="relative py-2 ml-0 md:ml-3 cursor-pointer"
                    style={{ minWidth: "200px" }}
                  >
                    {showDropdown && (
                      <div
                        className="absolute bg-white border inset-x-0 rounded-lg"
                        style={{
                          maxHeight: "calc(3.25rem * 10)",
                          top: "3.25rem",
                          overflowY: "scroll",
                          overflowX: "hidden",
                        }}
                        onClick={() => setShowDropdown(!showDropdown)}
                      >
                        {categories.map(({ label, id }) => (
                          <div
                            className="hover:bg-gray-100 p-3"
                            key={id}
                            onClick={() => setCategory({ label, id })}
                          >
                            {label}
                          </div>
                        ))}
                      </div>
                    )}
                    <div
                      className="w-full bg-gray-200 hover:bg-gray-300 py-3 px-6 rounded-lg text-center z-50"
                      onClick={() => setShowDropdown(!showDropdown)}
                    >
                      {category?.label} ▼
                    </div>
                  </div>
                  <div className="py-2 ml-0 md:ml-3">
                    <button className="bg-red-400 hover:bg-red-500 font-semibold rounded-lg py-3 px-12 w-full md:w-max">
                      SEARCH
                    </button>
                  </div>
                </div>
              </form>
            </div>
            <div className="flex-grow" />
            <div className="inline-flex items-center">
              <input
                type="checkbox"
                checked={!filterBoosted}
                onClick={() => setFilterBoosted(!filterBoosted)}
              />
              &nbsp;⚡
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 justify-items-center">
            {searchResults
              .filter(({ aboveFold }) =>
                filterBoosted ? aboveFold[0].component == "time_created" : true
              )
              .map(
                (
                  {
                    id,
                    seller,
                    photoUrls,
                    aboveFold,
                    likesCount,
                    price,
                    title,
                  },
                  i
                ) => {
                  return (
                    <div
                      key={i}
                      style={{ maxWidth: "232px", height: "418px" }}
                      className="border p-3 rounded-md hover:bg-gray-100"
                    >
                      <a
                        href={`https://carousell.com/p/${title
                          .toLowerCase()
                          .replace(/ /g, "-")
                          .replace(/[^a-z0-9-_]/g, "")}-${id}`}
                      >
                        <div className="flex flex-col h-full">
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
                          <div className="pt-1">{title.substring(0, 30)}</div>
                          <div className="pt-1 font-semibold">{price}</div>
                          <div className="flex-grow" />
                          <div className="flex">
                            <div>💗 {likesCount}</div>
                            <div className="flex-grow" />
                            <div className="text-gray-400">
                              {Math.round(
                                (likesCount * 3600 * 100) /
                                  (Date.now() / 1000 -
                                    aboveFold[0].timestampContent.seconds.low)
                              ) / 100}
                              /hr
                            </div>
                          </div>
                        </div>
                      </a>
                    </div>
                  );
                }
              )}

            {loading && <div className="text-center">Loading</div>}
          </div>
          <div className="flex flex-col items-center">
            {!!searchResults.length && searchResults.length % 20 === 0 ? (
              <button
                onClick={loadMore}
                className="my-3 border hover:bg-gray-100 rounded-lg py-3 px-6 w-full md:w-max"
              >
                Load More
              </button>
            ) : (
              <div className="my-3">&nbsp;</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
