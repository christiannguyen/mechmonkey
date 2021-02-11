var utc = require("dayjs/plugin/utc"); // dependent on utc plugin
var timezone = require("dayjs/plugin/timezone");
var relativeTime = require("dayjs/plugin/relativeTime");
import dayjs from "dayjs";
import sanitizeHtml from "sanitize-html";
import ReactHtmlParser from "react-html-parser";
import { decode } from "html-entities";
import Accordion from "../components/Accordion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faMinus } from "@fortawesome/free-solid-svg-icons";

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

const Listing = ({ listing, dark }) => {
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
          <span className="absolute rounded-full -top-2 -right-3 bg-blue-600 text-white text-bold rounded-sm py-1 px-2 text-xs dark:bg-blue-500">
            {active ? (
              <FontAwesomeIcon icon={faMinus} />
            ) : (
              <FontAwesomeIcon icon={faPlus} />
            )}
          </span>
          <header className="flex pb-4 justify-center items-center">
            <div className="w-3/4">
              <div className="flex">
                <div>
                  <span className="p-1.5 w-100 uppercase text-xs rounded-md border-solid bg-blue-200 text-blue-800 font-bold border-gray-200 mr-2 dark:text-blue-300 dark:bg-blue-900">
                    {link_flair_text}
                  </span>
                </div>
                <div>
                  <a
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                    href={url}
                    target="_blank"
                    className="w-5/6 text-sm text-base text-blue-600 dark:text-indigo-200"
                  >
                    {title}
                  </a>
                </div>
              </div>
            </div>
            <div className="ml-auto w-1/4 text-right">
              <a
                href={`https://www.reddit.com/user/${author}`}
                target="_blank"
                className="text-red-600 font-semibold text-base dark:text-red-300"
              >
                {author}
              </a>
              <div>
                <p className="text-sm dark:text-gray-100 dark:text-opacity-90">
                  {parsedTime.format("M/D/YYYY h:mm a")}
                </p>
                <p className="italic text-gray-500 text-sm dark:text-gray-400">
                  {parsedTime.fromNow()}
                </p>
              </div>
            </div>
          </header>
        </div>
      )}
    >
      <div className="mt-8">
        <div className={`listing-text dark:text-gray-200 ${dark}`}>
          {ReactHtmlParser(decode(clean))}
        </div>
      </div>
      <div className="flex flex-wrap mt-6 mb-4 max-h-96 overflow-y-scroll">
        {imageUrls.map((image) => (
          <Image url={image} />
        ))}
      </div>
      <div className="ext-sm text-green-700 font-semibold dark:text-green-400">
        <span className="mt-2">{ups} upvote(s)</span>
        <span> – </span>
        <span className="mt-2">{num_comments} comment(s)</span>
      </div>
    </Accordion>
  );
};

export default Listing;
