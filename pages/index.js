import Head from "next/head";
import React, { useState } from "react";
import styles from "../styles/Home.module.css";
import Listing from "../components/Listing";
import InfiniteScroll from "react-infinite-scroll-component";

export default function Home({ _listings, clientId }) {
  const [listings, setListings] = useState(_listings);
  console.log("listing", clientId, listings);

  const fetchData = async () => {
    const baseUrl = `https://www.reddit.com/r/mechmarket/search.json?q=flair%3Aselling&restrict_sr=on&sort=new&limit=10&t=all&after=${listings.after}`;

    console.log("base", baseUrl);

    const res = await fetch(baseUrl);
    const json = await res.json();

    console.log("data", json);

    setTimeout(() => {
      setListings({
        ...listings,
        after: json.data.after,
        children: [...listings.children, ...json.data.children],
      });
    }, 1000);

    // setListings({
    //   ...listings,
    //   after: json.data.after,
    //   children: [...listings.children, ...json.data.children],
    // });
  };

  return (
    <div className="md:w-48 lg:w-1/2 m-auto">
      <InfiniteScroll
        dataLength={listings.children.length} //This is important field to render the next data
        next={fetchData}
        hasMore={true}
        loader={<h4>Loading...</h4>}
        endMessage={
          <p style={{ textAlign: "center" }}>
            <b>Yay! You have seen it all</b>
          </p>
        }
        // below props only if you need pull down functionality
        refreshFunction={fetchData}
        pullDownToRefresh={true}
        pullDownToRefreshThreshold={200}
        pullDownToRefreshContent={
          <h3 style={{ textAlign: "center" }}>&#8595; Pull down to refresh</h3>
        }
        releaseToRefreshContent={
          <h3 style={{ textAlign: "center" }}>&#8593; Release to refresh</h3>
        }
      >
        {listings.children.map((listing) => (
          <Listing key={listing.data.id} listing={listing} />
        ))}
      </InfiniteScroll>
    </div>
  );
}

// {
//   headers: {
//     Accept: "application/json",
//     Authorization: `Client-ID `,
//     // 'Content-Type': 'application/json'
//   },
// });

export async function getStaticProps(context) {
  // const clientId = "ec4e747787dd72a";
  const link =
    "https://www.reddit.com/r/mechmarket/search.json?q=flair%3Aselling&restrict_sr=on&sort=new&limit=10&t=all";
  const res = await fetch(link);
  const data = await res.json();

  if (!data) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      _listings: data.data,
      clientId: process.env.IMG_CLIENT,
    }, // will be passed to the page component as props
  };
}
