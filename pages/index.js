import React, { useState, useEffect, useRef } from "react";
import Listing from "../components/Listing";
import Search from "../components/Search";
import Filters from "../components/Filters";
import InfiniteScroll from "react-infinite-scroll-component";
import request from "superagent";
import { fetchImages, addLocaleOnFlair } from "../libs";
import Toggle from "react-toggle";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSun, faMoon, faArrowUp } from "@fortawesome/free-solid-svg-icons";
import Loader from "react-loader-spinner";
import Image from "next/image";
import useLocalStorage from "../hooks/useLocalStorage";

const RESULTS_LIMIT = 5;
const LINK = "https://www.reddit.com/r/mechmarket/search.json";
const INITIAL_FLAIR = "selling";

export default function Home({ clientId }) {
  const [currentQuery, setCurrentQuery] = useState("");
  const [listings, setListings] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [currentFlair, setCurrentFlair] = useState(INITIAL_FLAIR);
  const [darkModeLocalStorage, setDarkModeLocalStorage] = useLocalStorage(
    "darkMode",
    "false"
  );

  const [darkMode, setDarkMode] = useState(darkModeLocalStorage);
  console.log("hmm", darkModeLocalStorage, darkMode);
  const [hasMoreResults, setHasMoreResults] = useState(true);
  const searchRef = useRef(null);

  useEffect(async () => {
    await retrieveFreshData();
  }, []);

  const retrieveFreshData = async (flair = "") => {
    setLoading(true);

    const response = await request.get(LINK).query({
      q: `${addLocaleOnFlair(flair || currentFlair)} flair:${
        flair || currentFlair
      } ${currentQuery}`,
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

    setHasMoreResults(true);
    setListings(response.body.data);
    setLoading(false);
  };

  const searchListings = async (e) => {
    e.preventDefault();

    setLoading(true);

    const response = await request.get(LINK).query({
      q: `${addLocaleOnFlair(currentFlair)} flair:${currentFlair} ${
        searchRef.current.value
      }`,
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

    setHasMoreResults(true);
    setCurrentQuery(searchRef.current.value);
    setListings(response.body.data);
    setLoading(false);
  };

  const fetchData = async () => {
    try {
      const response = await request.get(LINK).query({
        q: `${addLocaleOnFlair(
          currentFlair
        )} flair:${currentFlair} ${currentQuery}`,
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

      if (!response.body.data.after) {
        setHasMoreResults(false);
      } else {
        setTimeout(() => {
          setListings({
            ...listings,
            after: response.body.data.after,
            children: [...listings.children, ...response.body.data.children],
          });
        }, 1000);
      }
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

  const renderListings = () => {
    if (listings.children?.length === 0) {
      return (
        <div className="flex flex-col items-center mt-12">
          <Image src="/crying-face-img.png" alt="me" width="64" height="64" />
          <p className="mt-4 font-bold text-lg dark:text-gray-200">
            No results found
          </p>
        </div>
      );
    }

    return (
      <InfiniteScroll
        className="overflow-visible"
        dataLength={listings.children?.length || 0} //This is important field to render the next data
        next={fetchData}
        hasMore={hasMoreResults}
        loader={<h4>Loading...</h4>}
        endMessage={
          <p className="mt-4 font-bold text-lg text-center dark:text-gray-200">
            Yay! You have seen it all{" "}
            <Image
              src="/partying-face-img.png"
              alt="me"
              width="48"
              height="48"
            />
          </p>
        }
      >
        {listings.children?.map((listing) => (
          <Listing key={listing.data.id} listing={listing} dark={dark} />
        ))}
      </InfiniteScroll>
    );
  };

  const dark = darkMode ? "dark" : "";
  console.log("dark is", dark);

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
                onChange={() => {
                  setDarkModeLocalStorage(!darkMode);
                  setDarkMode(!darkMode);
                }}
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
            renderListings()
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
