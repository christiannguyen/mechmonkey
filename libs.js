import { parse } from "node-html-parser";
import { decode } from "html-entities";
import request from "superagent";

const retrieveImgUrls = (string) => {
  const parser = parse(decode(string));
  const urls = [];

  parser.querySelectorAll("a").forEach((x) => {
    if (x.attributes.href.includes(".com")) {
      urls.push(x.attributes.href);
    }
  });

  return urls;
};

export const fetchImages = async (listing, clientId) => {
  const urls = retrieveImgUrls(listing.data.selftext_html);
  const imageUrls = [];

  return await Promise.all(
    urls.map(async (x) => {
      const urlData = new URL(x);
      if (!urlData.host.includes("imgur")) {
        return;
      }

      const pathname = urlData.pathname.split("/");

      if (pathname.length < 2) {
        return;
      }

      const type = pathname[1];
      const id = pathname[pathname.length - 1];

      try {
        if (type === "a") {
          const response = await request
            .get(`https://api.imgur.com/3/album/${id}/images`)
            .set({ Authorization: `Client-Id ${clientId}` });

          response.body.data.forEach((x) => imageUrls.push(x.link));
        } else if (type === "gallery") {
          const response = await request
            .get(`https://api.imgur.com/3/gallery/${id}/images`)
            .set({ Authorization: `Client-Id ${clientId}` });

          response.body.data.forEach((x) => imageUrls.push(x.link));
        } else {
          imageUrls.push(urlData.href + ".jpg");
        }

        listing.data.imageUrls = imageUrls;
      } catch (err) {
        console.log("err", err);
      }
    })
  );
};
