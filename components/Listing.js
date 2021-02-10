var utc = require("dayjs/plugin/utc"); // dependent on utc plugin
var timezone = require("dayjs/plugin/timezone");
var relativeTime = require("dayjs/plugin/relativeTime");
import dayjs from "dayjs";
import sanitizeHtml from "sanitize-html";
import ReactHtmlParser from "react-html-parser";
import { decode } from "html-entities";
import Accordion from "../components/Accordion";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(relativeTime);
dayjs.extend(utc);
dayjs.extend(timezone);

const potentialTimezone = dayjs.tz.guess();

const Image = ({ url }) => {
  return (
    <a className="m-1 rounded-md" href={url} target="_blank">
      <img src={url} className="max-w-100 h-56" />
    </a>
  );
};

const Listing = ({ listing }) => {
  const {
    url,
    title,
    link_flair_text,
    author,
    selftext_html,
    created_utc,
    num_comments,
    imageUrls = [],
    ups,
  } = listing.data;

  const clean = sanitizeHtml(selftext_html);
  const parsedTime = dayjs.tz(dayjs.unix(created_utc), potentialTimezone);

  return (
    <Accordion
      header={(active) => (
        <div className="pt-6 px-8">
          <span className="absolute rounded-full -top-2 -right-4 bg-blue-600 text-white text-bold rounded-sm px-2 text-md">
            {active ? "↑" : "↓"}
          </span>
          <header className="flex  pb-4 justify-center items-center">
            <div className="w-3/4">
              <div className="flex">
                <div>
                  <span className="p-1.5 w-100 uppercase text-xs rounded-md border-solid bg-blue-200 text-blue-800 font-bold border-gray-200 mr-2">
                    {link_flair_text}
                  </span>
                </div>
                <a
                  href={url}
                  target="_blank"
                  className="w-5/6 text-sm text-base text-indigo-500"
                >
                  {title}
                </a>
              </div>
            </div>
            <div className="ml-auto w-1/4 text-right text-sm">
              <a
                href={`https://www.reddit.com/user/${author}`}
                target="_blank"
                className="text-red-600 font-semibold"
              >
                {author}
              </a>
              <div>
                <p>{parsedTime.format("D/M/YYYY h:mm:ss a")}</p>
                <p className="italic text-gray-500">{parsedTime.fromNow()}</p>
              </div>
            </div>
          </header>
        </div>
      )}
    >
      <div className="mt-8">
        <div className="listing-text">{ReactHtmlParser(decode(clean))}</div>
      </div>
      <div className="flex flex-wrap mt-6 mb-4 max-h-96 overflow-y-scroll">
        {imageUrls.map((image) => (
          <Image url={image} />
        ))}
      </div>
      <div>
        <span className="mt-2 text-sm text-green-700 font-semibold">
          {ups} upvote(s)
        </span>
        <span> -- </span>
        <span className="mt-2 text-sm text-green-700 font-semibold">
          {num_comments} comment(s)
        </span>
      </div>
    </Accordion>
  );
};

export default Listing;
