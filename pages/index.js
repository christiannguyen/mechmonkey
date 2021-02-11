import React, { useState, useEffect, useRef } from "react";
import Listing from "../components/Listing";
import Search from "../components/Search";
import Filters from "../components/Filters";
import InfiniteScroll from "react-infinite-scroll-component";
import request from "superagent";
import { fetchImages } from "../libs";
import Toggle from "react-toggle";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSun, faMoon, faArrowUp } from "@fortawesome/free-solid-svg-icons";
import Loader from "react-loader-spinner";
import Image from "next/image";

const RESULTS_LIMIT = 5;
const LINK = "https://www.reddit.com/r/mechmarket/search.json";
const INITIAL_FLAIR = "selling";

export default function Home({ clientId }) {
  const [currentQuery, setCurrentQuery] = useState("");
  const [listings, setListings] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [currentFlair, setCurrentFlair] = useState(INITIAL_FLAIR);
  const [darkMode, setDarkMode] = useState(false);
  const [hasMoreResults, setHasMoreResults] = useState(false);
  const searchRef = useRef(null);

  useEffect(async () => {
    await retrieveFreshData();
  }, []);

  const retrieveFreshData = async (flair = "") => {
    setLoading(true);
    const response = await request.get(LINK).query({
      q: `title:("[US-") flair:${flair || currentFlair} ${currentQuery}`,
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
  };

  const searchListings = async (e) => {
    e.preventDefault();

    setLoading(true);
    const response = await request.get(LINK).query({
      q: `title:("[US-") flair:${currentFlair} ${searchRef.current.value}`,
      restrict_sr: "on",
      sort: "new",
      limit: RESULTS_LIMIT,
      t: "all",
    });

    setCurrentQuery(searchRef.current.value);
    setListings(response.body.data);
    setLoading(false);
  };

  const fetchData = async () => {
    try {
      const response = await request.get(LINK).query({
        q: `title:("[US-") flair:${currentFlair} ${currentQuery}`,
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

  const handleFlairChange = async (flair) => {
    await retrieveFreshData(flair);
    setCurrentFlair(flair);
  };

  const scrollToTop = () => {
    window.scroll({ top: 0, behavior: "smooth" });
  };

  const dark = darkMode ? "dark" : "";

  return (
    <div id="page" className={`${dark}`}>
      <div className="py-10 bg-gray-50 h-full min-h-screen transition-colors duration-300 ease-in-out dark:bg-gray-900 ">
        <div className="sm:w-5/6 md:w2/3 lg:w-1/2 m-auto">
          <header className="text-left">
            <div className="flex mb-10 relative justify-between items-center">
              <h2 className="text-5xl  text-gray-800 font-light dark:text-blue-50">
                mechm
                <Image src="/monkey-img.png" alt="me" width="48" height="48" />
                nkey.
              </h2>
              <Toggle
                defaultChecked={darkMode}
                icons={{
                  checked: (
                    <FontAwesomeIcon
                      icon={faMoon}
                      className="text-yellow-400"
                    />
                  ),
                  unchecked: (
                    <FontAwesomeIcon icon={faSun} className="text-yellow-400" />
                  ),
                }}
                onChange={() => setDarkMode(!darkMode)}
              />
            </div>
            <Filters handler={handleFlairChange} />
            <Search ref={searchRef} handler={searchListings} />
          </header>
          {isLoading ? (
            <div className="absolute top-1/4 left-1/2">
              <Loader type="TailSpin" color="#00BFFF" height={50} width={50} />
            </div>
          ) : (
            <InfiniteScroll
              className="overflow-visible"
              dataLength={listings.children?.length || 0} //This is important field to render the next data
              next={fetchData}
              hasMore={true}
              loader={<h4>Loading...</h4>}
              endMessage={
                <p style={{ textAlign: "center" }}>
                  <b>Yay! You have seen it all</b>
                </p>
              }
            >
              {listings.children?.map((listing) => (
                <Listing key={listing.data.id} listing={listing} dark={dark} />
              ))}
            </InfiniteScroll>
          )}
        </div>
        <span
          onClick={scrollToTop}
          className="fixed cursor-pointer rounded-full bottom-12 right-12 bg-blue-500 text-white text-bold py-2 px-4 text-3xl transition duration-300 ease-in-out transform hover:-translate-y-0.5 hover:scale-105"
        >
          <FontAwesomeIcon icon={faArrowUp} />
        </span>
      </div>
    </div>
  );
}

export async function getStaticProps(context) {
  return {
    props: {
      clientId: process.env.IMG_CLIENT,
    },
  };
}
