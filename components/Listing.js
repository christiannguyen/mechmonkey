var utc = require("dayjs/plugin/utc"); // dependent on utc plugin
var timezone = require("dayjs/plugin/timezone");
var relativeTime = require("dayjs/plugin/relativeTime");

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(relativeTime);
import dayjs from "dayjs";
import sanitizeHtml from "sanitize-html";
import ReactHtmlParser from "react-html-parser";
import { decode } from "html-entities";

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
    <div className="mt-8 mb-14 bg-white rounded-xl shadow-xl py-6 px-8 relative">
      <span className="absolute rounded-2xl -top-2 -left-4 py-1 px-3 bg-green-600 text-white text-sm">
        {ups}
      </span>
      <header className="flex border-b-2 border-indigo-400 pb-4 justify-center items-center">
        <div className="w-3/4">
          <div className="flex">
            <div>
              <span className="p-2 w-100 text-xs rounded-xl border-solid bg-blue-200 text-blue-700 font-semibold border-gray-200 mr-2">
                {link_flair_text}
              </span>
            </div>
            <a
              href={url}
              target="_blank"
              className="w-5/6 text-sm font-medium text-indigo-500"
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
      <div className="mt-8">
        <div className="listing-text">{ReactHtmlParser(decode(clean))}</div>
      </div>
      <div className="flex flex-wrap mt-6 mb-4 max-h-96 overflow-y-scroll">
        {imageUrls.map((image) => (
          <Image url={image} />
        ))}
      </div>

      <p className="mt-2 text-sm text-green-700 font-semibold">
        {num_comments} Comment(s)
      </p>
    </div>
  );
};

export default Listing;
