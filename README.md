# YouTube Channel Scraper (Handle-based)

## Overview

**YouTube Channel Scraper** is a Node.js script that retrieves **all videos from a YouTube channel using its handle** and saves the results into a JSON file.

For each video, the script collects:

* Video title
* Embed link
* Best available thumbnail
* Publish date
* Full description

This repository is a **fork of `mitcdh/youtube-channel-scraper`**, modified to:

* Use **channel handles instead of channel IDs**
* Reduce **YouTube Data API quota usage**
* Provide a **simpler and more budget-friendly implementation**
* Output results directly to a JSON file

---

## Requirements

* **Node.js** (v18 or newer recommended)
* A valid **YouTube Data API v3 key**
* The **handle of the YouTube channel** (without `@`)

---

## Installation

1. Clone the repository:

```sh
git clone https://github.com/Glitch-Herobrine/youtube-channel-scraper.git
cd youtube-channel-scraper
```

2. Install dependencies:

```sh
npm install
```

3. Create a `.env` file in the project root and define the following variables:

```env
YOUTUBE_API_KEY=your_youtube_api_key
YOUTUBE_HANDLE=channel_handle
```

## Usage

### Run as a standalone script

Execute the script using Node.js:

```sh
node index.js
```

After execution, the script will generate an `output.json` file containing all fetched video data.

---

## Output Format

The `output.json` file contains an array of objects in the following format:

```json
{
  "title": "Video title",
  "videoId": "VIDEO_ID",
  "thumbnailUrl": "https://i.ytimg.com/...",
  "publishedAt": "2026-01-01T12:00:00Z",
  "description": "Full video description"
}
```

---

## Notes

* The highest available thumbnail resolution is selected automatically.
* Be mindful of YouTube Data API quota limits.