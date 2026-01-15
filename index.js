import * as dotenv from "dotenv";
import chalk from "chalk";
import * as fsPromises from "fs/promises"

try {
  dotenv.config();
} catch (error) {
  console.warn(
    "dotenv is not available. Continuing without loading environment variables from .env file."
  );
}

const apiKey = process.env.YOUTUBE_API_KEY;
const handle = process.env.YOUTUBE_HANDLE;

if(!apiKey || !handle){
  console.log(chalk.red("API key or Handle missing!"));
  process.exit(1)
}

async function getVideoDetails(video) {
  const videoId = video["resourceId"]["videoId"]
  const thumbnails = video.thumbnails;
  const thumbnailUrl =
    (thumbnails.maxres && thumbnails.maxres.url) ||
    (thumbnails.standard && thumbnails.standard.url) ||
    (thumbnails.high && thumbnails.high.url) ||
    (thumbnails.medium && thumbnails.medium.url) ||
    thumbnails.default.url;

  return {
    title: video.title,
    embedLink: `https://www.youtube.com/embed/${videoId}`,
    thumbnailUrl: thumbnailUrl,
    publishedAt: video.publishedAt,
    description: video.description
  }
}

async function listAllVideos(apiKey, handle) {
  const plURL = `https://www.googleapis.com/youtube/v3/channels?part=contentDetails&forHandle=${handle}&key=${apiKey}`;
  const plResponse = await fetch(plURL);
  const plResponseDecoded = await plResponse.json();
  let allVideos = [];
  if (plResponseDecoded && plResponse.ok) {
    const relatedPlaylist = plResponseDecoded.items?.[0]?.contentDetails?.relatedPlaylists?.uploads;
    if (relatedPlaylist) {
      let nextPageToken = "";
      do {
        const vlURL = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet%2CcontentDetails&maxResults=50&playlistId=${relatedPlaylist}&key=${apiKey}&pageToken=${nextPageToken}`;
        const vlResponse = await fetch(vlURL);
        const vlResponseDecoded = await vlResponse.json();
        const items = vlResponseDecoded["items"];
        for (const video of items) {
          const videoData = await getVideoDetails(video["snippet"])
          allVideos.push(videoData);
        }

        if(nextPageToken){
          console.log(chalk.green(`NEXT PAGE TOKEN: ${nextPageToken}`))
        }

        nextPageToken = vlResponseDecoded["nextPageToken"];
        
        
      } while(nextPageToken);

    } else {
      console.log(chalk.redBright("relatedPlaylist not found."));
    }
  }else{
    console.log(plResponseDecoded.status);
  }

  return allVideos;
}

(async () =>{
  const data = await listAllVideos(apiKey, handle);
  await fsPromises.writeFile("./output.json", JSON.stringify(data,null,2), {encoding:'utf-8'});
})();