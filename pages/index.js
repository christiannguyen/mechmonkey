import React, { useState, useEffect } from "react";
import Listing from "../components/Listing";
import Search from "../components/Search";
import InfiniteScroll from "react-infinite-scroll-component";
import request from "superagent";
import { fetchImages } from "../libs";
import parse from "node-html-parser";

const RESULTS_LIMIT = 5;

export default function Home({ _listings, clientId }) {
  const [listings, setListings] = useState(_listings);
  const [query, setQuery] = useState("");

  console.log("listing", listings);
  const searchListings = async () => {
    const link = "https://www.reddit.com/r/mechmarket/search.json";

    const response = await request.get(link).query({
      q: `flair:selling ${query}`,
      restrict_sr: "on",
      sort: "new",
      limit: RESULTS_LIMIT,
      t: "all",
    });

    setListings(response.body.data);
  };

  const fetchData = async () => {
    const link = "https://www.reddit.com/r/mechmarket/search.json";

    try {
      const response = await request.get(link).query({
        q: `flair:selling ${query}`,
        restrict_sr: "on",
        sort: "new",
        limit: RESULTS_LIMIT,
        t: "all",
        after: listings.after,
      });

      await Promise.all(
        response.body.data.children.map(async (listing) => {
          await fetchImages(listing, clientId);
        })
      );

      setTimeout(() => {
        setListings({
          ...listings,
          after: response.body.data.after,
          children: [...listings.children, ...response.body.data.children],
        });
      }, 1000);
    } catch (err) {
      console.log("err", err);
    }
  };

  const scrollToTop = () => {
    window.scroll({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <div className="sm:w-5/6 md:w2/3 lg:w-1/2 m-auto">
        <div className="text-center">
          <Search query={query} setQuery={setQuery} />
          <button
            onClick={searchListings}
            className="ml-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Search
          </button>
        </div>
        <InfiniteScroll
          className="overflow-visible"
          dataLength={listings.children.length} //This is important field to render the next data
          next={fetchData}
          hasMore={true}
          loader={<h4>Loading...</h4>}
          endMessage={
            <p style={{ textAlign: "center" }}>
              <b>Yay! You have seen it all</b>
            </p>
          }
        >
          {listings.children.map((listing) => (
            <Listing key={listing.data.id} listing={listing} />
          ))}
        </InfiniteScroll>
      </div>
      <span
        onClick={scrollToTop}
        className="fixed cursor-pointer rounded-full bottom-12 right-12 bg-blue-500 text-white text-bold py-2 px-4 text-3xl transition duration-300 ease-in-out transform hover:-translate-y-0.5 hover:scale-105"
      >
        ☝️
      </span>
    </>
  );
}

export async function getStaticProps(context) {
  const link = "https://www.reddit.com/r/mechmarket/search.json";

  const response = await request.get(link).query({
    q: "flair:selling",
    restrict_sr: "on",
    sort: "new",
    limit: RESULTS_LIMIT,
    t: "all",
  });

  if (!response.body) {
    return {
      notFound: true,
    };
  }

  await Promise.all(
    response.body.data.children.map(async (listing) => {
      await fetchImages(listing, process.env.IMG_CLIENT);
    })
  );

  return {
    props: {
      _listings: response.body.data,
      clientId: process.env.IMG_CLIENT,
    }, // will be passed to the page component as props
  };
}
