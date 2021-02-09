var utc = require("dayjs/plugin/utc"); // dependent on utc plugin
var timezone = require("dayjs/plugin/timezone");
dayjs.extend(utc);
dayjs.extend(timezone);
import dayjs from "dayjs";
import sanitizeHtml from "sanitize-html";
import ReactHtmlParser from "react-html-parser";
import { decode } from "html-entities";

dayjs.extend(utc);
dayjs.extend(timezone);

const potentialTimezone = dayjs.tz.guess();

const Listing = ({ listing }) => {
  const {
    url,
    selftext,
    title,
    link_flair_text,
    author,
    selftext_html,
    created_utc,
    created,
  } = listing.data;

  const fetchImages = async () => {
    const link = "https://api.imgur.com/3/album/MM013po/images";
    const res = await fetch(link, {
      headers: {
        Accept: "application/json",
        Authorization: `Client-ID`,
        // 'Content-Type': 'application/json'
      },
      // mode: "no-cors",
    });

    console.log("res", res);

    const data = await res.json();
    console.log(data);
  };

  const clean = sanitizeHtml(selftext_html);

  // fetchImages();

  // https://www.reddit.com/r/mechmarket/comments/lfts2q/usal_h_black_idobao_id80_w_plate_foam_w_paypal.json

  return (
    <div className="mt-8 mb-8 bg-white rounded-xl border-solid shadow-xl p-5">
      <header className="flex border-b-2  border-indigo-400 pb-4">
        <div className="w-3/4 flex">
          <div>
            <span className="p-2 w-100 text-xs rounded-xl border-solid bg-blue-200 text-blue-700 font-semibold border-gray-200 mr-2">
              {link_flair_text}
            </span>
          </div>
          <a
            href={url}
            target="_blank"
            className="w-2/3 text-sm font-medium text-indigo-500"
          >
            {title}
          </a>
        </div>
        <div className="ml-auto text-right text-sm">
          <a
            href={`https://www.reddit.com/user/${author}`}
            target="_blank"
            className="text-red-600 font-semibold"
          >
            {author}
          </a>
          <p>
            {dayjs
              .tz(
                dayjs.unix(created_utc).format("YYYY-MM-DD h:mm"),
                potentialTimezone
              )
              .format("YYYY-MM-DD h:mm:ss a")}
          </p>
        </div>
      </header>
      <div className="my-8">
        <div>{ReactHtmlParser(decode(clean))}</div>
      </div>
    </div>
  );
};

export default Listing;
