import React, { useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  Heart,
  Home,
  Library,
  ListMusic,
  Pause,
  Play,
  Search,
  Shuffle,
  SkipBack,
  SkipForward,
  Volume2
} from "lucide-react";
import "./styles.css";

const YOUTUBE_API_KEY =
  import.meta.env.VITE_YOUTUBE_API_KEY || "AIzaSyD5c_RfbdsYFgTjGJ81ZAaHWRI58nE-_2w";

const featuredTracks = [
  {
    id: "jfKfPfyJRdk",
    title: "lofi hip hop radio",
    artist: "Lofi Girl",
    album: "beats to relax/study to",
    duration: "LIVE",
    image: "https://i.ytimg.com/vi/jfKfPfyJRdk/hqdefault.jpg"
  },
  {
    id: "4xDzrJKXOOY",
    title: "synthwave radio",
    artist: "ThePrimeThanatos",
    album: "beats to chill/game to",
    duration: "LIVE",
    image: "https://i.ytimg.com/vi/4xDzrJKXOOY/hqdefault.jpg"
  },
  {
    id: "5qap5aO4i9A",
    title: "lofi hip hop beats",
    artist: "ChilledCow",
    album: "classic radio",
    duration: "LIVE",
    image: "https://i.ytimg.com/vi/5qap5aO4i9A/hqdefault.jpg"
  },
  {
    id: "DWcJFNfaw9c",
    title: "jazzhop cafe",
    artist: "Cafe Music BGM",
    album: "night playlist",
    duration: "3:02:20",
    image: "https://i.ytimg.com/vi/DWcJFNfaw9c/hqdefault.jpg"
  },
  {
    id: "hHW1oY26kxQ",
    title: "ambient study music",
    artist: "Quiet Quest",
    album: "deep focus",
    duration: "2:59:33",
    image: "https://i.ytimg.com/vi/hHW1oY26kxQ/hqdefault.jpg"
  }
];

function cleanText(value) {
  const div = document.createElement("div");
  div.innerHTML = value;
  return div.textContent || value;
}

function App() {
  const [query, setQuery] = useState("lofi night drive");
  const [tracks, setTracks] = useState(featuredTracks);
  const [current, setCurrent] = useState(featuredTracks[0]);
  const [isPlaying, setIsPlaying] = useState(true);
  const [liked, setLiked] = useState(false);
  const [status, setStatus] = useState("Ready");

  const queue = useMemo(
    () => tracks.filter((track) => track.id !== current.id).slice(0, 8),
    [tracks, current]
  );

  useEffect(() => {
    if (!query.trim()) {
      setTracks(featuredTracks);
      setStatus("Ready");
      return undefined;
    }

    const controller = new AbortController();
    const timer = window.setTimeout(async () => {
      setStatus("Searching YouTube");
      try {
        const params = new URLSearchParams({
          part: "snippet",
          maxResults: "12",
          q: `${query} music`,
          type: "video",
          videoCategoryId: "10",
          key: YOUTUBE_API_KEY
        });
        const response = await fetch(
          `https://www.googleapis.com/youtube/v3/search?${params.toString()}`,
          { signal: controller.signal }
        );
        const payload = await response.json();
        if (!response.ok) throw new Error(payload?.error?.message || "YouTube search failed");

        const nextTracks = payload.items
          .filter((item) => item.id?.videoId)
          .map((item) => ({
            id: item.id.videoId,
            title: cleanText(item.snippet.title),
            artist: cleanText(item.snippet.channelTitle),
            album: "YouTube Music",
            duration: "--:--",
            image:
              item.snippet.thumbnails?.medium?.url ||
              item.snippet.thumbnails?.high?.url ||
              item.snippet.thumbnails?.default?.url
          }));

        setTracks(nextTracks.length ? nextTracks : featuredTracks);
        setStatus(nextTracks.length ? "YouTube results" : "No results, showing featured");
      } catch (error) {
        if (error.name !== "AbortError") {
          setTracks(featuredTracks);
          setStatus("Search failed, showing featured");
        }
      }
    }, 450);

    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [query]);

  function playTrack(track) {
    setCurrent(track);
    setIsPlaying(true);
    setLiked(false);
  }

  function skip(direction) {
    const list = tracks.length ? tracks : featuredTracks;
    const index = list.findIndex((track) => track.id === current.id);
    const next = list[(index + direction + list.length) % list.length] || list[0];
    playTrack(next);
  }

  return (
    <main className="spotifyApp">
      <aside className="spotifySidebar">
        <div className="logo">Lune</div>
        <nav>
          <a className="navItem active" href="#home">
            <Home size={22} /> Home
          </a>
          <a className="navItem" href="#search">
            <Search size={22} /> Search
          </a>
          <a className="navItem" href="#library">
            <Library size={22} /> Your Library
          </a>
        </nav>
        <div className="playlistBox">
          <strong>Playlists</strong>
          <span>Noctis Mix</span>
          <span>Late Night Drive</span>
          <span>Focus Radio</span>
          <span>Soul Test Archive</span>
        </div>
      </aside>

      <section className="spotifyMain" id="home">
        <header className="spotifyTop">
          <label className="searchBar" id="search">
            <Search size={19} />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="What do you want to play?"
              type="search"
            />
          </label>
          <span className="status">{status}</span>
        </header>

        <section className="heroPlayer">
          <img src={current.image} alt="" />
          <div>
            <span className="label">Now playing from YouTube</span>
            <h1>{current.title}</h1>
            <p>{current.artist}</p>
            <div className="heroButtons">
              <button className="greenButton" onClick={() => setIsPlaying(true)} type="button">
                <Play size={20} fill="currentColor" /> Play
              </button>
              <button className="ghostButton" onClick={() => setLiked((value) => !value)} type="button">
                <Heart size={20} fill={liked ? "currentColor" : "none"} /> Save
              </button>
            </div>
          </div>
        </section>

        <section className="contentSplit">
          <section>
            <div className="sectionHeader">
              <h2>Good evening</h2>
              <span>{tracks.length} tracks</span>
            </div>
            <div className="trackGrid">
              {tracks.slice(0, 6).map((track) => (
                <button
                  key={track.id}
                  className={`trackCard ${current.id === track.id ? "selected" : ""}`}
                  onClick={() => playTrack(track)}
                  type="button"
                >
                  <img src={track.image} alt="" />
                  <span>
                    <strong>{track.title}</strong>
                    <small>{track.artist}</small>
                  </span>
                  <Play className="cardPlay" size={18} fill="currentColor" />
                </button>
              ))}
            </div>

            <div className="sectionHeader tableTitle">
              <h2>Search results</h2>
              <span>Click any row to play</span>
            </div>
            <div className="trackTable">
              {tracks.map((track, index) => (
                <button
                  className={`trackRow ${current.id === track.id ? "selected" : ""}`}
                  key={`${track.id}-${index}`}
                  onClick={() => playTrack(track)}
                  type="button"
                >
                  <span className="rowIndex">{index + 1}</span>
                  <img src={track.image} alt="" />
                  <span className="rowTitle">
                    <strong>{track.title}</strong>
                    <small>{track.artist}</small>
                  </span>
                  <span>{track.album}</span>
                  <span>{track.duration}</span>
                </button>
              ))}
            </div>
          </section>

          <aside className="queuePanel">
            <h2>Up next</h2>
            {queue.map((track) => (
              <button className="queueItem" key={track.id} onClick={() => playTrack(track)} type="button">
                <img src={track.image} alt="" />
                <span>
                  <strong>{track.title}</strong>
                  <small>{track.artist}</small>
                </span>
              </button>
            ))}
          </aside>
        </section>
      </section>

      <footer className="spotifyPlayer">
        <div className="miniTrack">
          <img src={current.image} alt="" />
          <span>
            <strong>{current.title}</strong>
            <small>{current.artist}</small>
          </span>
          <button className={liked ? "liked iconButton" : "iconButton"} onClick={() => setLiked((value) => !value)} type="button">
            <Heart size={18} fill={liked ? "currentColor" : "none"} />
          </button>
        </div>

        <div className="centerControls">
          <div className="buttonRow">
            <button className="iconButton" type="button">
              <Shuffle size={18} />
            </button>
            <button className="iconButton" onClick={() => skip(-1)} type="button">
              <SkipBack size={21} />
            </button>
            <button className="roundPlay" onClick={() => setIsPlaying((value) => !value)} type="button">
              {isPlaying ? <Pause size={22} fill="currentColor" /> : <Play size={22} fill="currentColor" />}
            </button>
            <button className="iconButton" onClick={() => skip(1)} type="button">
              <SkipForward size={21} />
            </button>
            <button className="iconButton" type="button">
              <ListMusic size={18} />
            </button>
          </div>
          <div className="progressLine">
            <span>0:00</span>
            <div>
              <i />
            </div>
            <span>{current.duration}</span>
          </div>
        </div>

        <div className="volumeBox">
          <Volume2 size={18} />
          <div className="volumeLine">
            <i />
          </div>
        </div>
      </footer>

      <div className="youtubeFrame" aria-hidden={!isPlaying}>
        <iframe
          title={current.title}
          src={`https://www.youtube.com/embed/${current.id}?autoplay=${
            isPlaying ? "1" : "0"
          }&rel=0&modestbranding=1&playsinline=1`}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      </div>
    </main>
  );
}

createRoot(document.getElementById("root")).render(<App />);
