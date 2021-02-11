import React, { useState, useEffect } from "react";
import Listing from "../components/Listing";
import Search from "../components/Search";
import InfiniteScroll from "react-infinite-scroll-component";
import request from "superagent";
import { fetchImages } from "../libs";
import Loader from "react-loader-spinner";

const RESULTS_LIMIT = 5;

export default function Home({ clientId }) {
  const [listings, setListings] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [query, setQuery] = useState("");

  useEffect(async () => {
    const link = "https://www.reddit.com/r/mechmarket/search.json";

    const response = await request.get(link).query({
      q: `title:("[US-") flair:selling`,
      restrict_sr: "on",
      sort: "new",
      limit: RESULTS_LIMIT,
      t: "all",
    });

    await Promise.all(
      response.body.data.children.map(async (listing) => {
        await fetchImages(listing, clientId);
      })
    );

    setListings(response.body.data);
    setLoading(false);
  }, []);

  const searchListings = async (e) => {
    e.preventDefault();
    const link = "https://www.reddit.com/r/mechmarket/search.json";

    setLoading(true);
    const response = await request.get(link).query({
      q: `flair:selling ${query}`,
      restrict_sr: "on",
      sort: "new",
      limit: RESULTS_LIMIT,
      t: "all",
    });

    setListings(response.body.data);
    setLoading(false);
  };

  const fetchData = async () => {
    const link = "https://www.reddit.com/r/mechmarket/search.json";

    try {
      const response = await request.get(link).query({
        q: `title:("[US-") flair:selling ${query}`,
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
          <h2 className="text-5xl mb-10 text-gray-800 font-light">
            mechm🙈nkey.
          </h2>
          <Search query={query} setQuery={setQuery} handler={searchListings} />
        </div>
        {isLoading ? (
          <div className="absolute top-1/4 left-1/2">
            <Loader type="TailSpin" color="#00BFFF" height={50} width={50} />
          </div>
        ) : (
          <InfiniteScroll
            className="overflow-visible"
            dataLength={listings.children.length || 0} //This is important field to render the next data
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
        )}
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
  return {
    props: {
      clientId: process.env.IMG_CLIENT,
    },
  };
}
