import React, { useEffect, useMemo, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  CloudRain,
  Disc3,
  Heart,
  Library,
  ListMusic,
  Pause,
  Play,
  Settings,
  Share2,
  Shuffle,
  SkipBack,
  SkipForward,
  SlidersHorizontal,
  Sparkles,
  Volume2,
  Waves,
  Wind
} from "lucide-react";
import "./styles.css";

const YOUTUBE_API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;

const spaces = [
  {
    id: "balcony",
    name: "Sunset Balcony",
    time: "22:15",
    weather: "Partly Cloudy",
    track: "Midnight Reflection",
    artist: "Noctis Original Series",
    length: 282,
    color: "#a2c9ff",
    accent: "#ffb37c",
    background:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1800&q=80",
    cover:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=900&q=80",
    layers: [
      { id: "breeze", name: "Warm Breeze", icon: Wind, level: 58 },
      { id: "waves", name: "Distant Waves", icon: Waves, level: 35 },
      { id: "traffic", name: "Night Traffic", icon: Volume2, level: 18 }
    ],
    note:
      "The golden hour never truly ends here. Let the pulse of the coastal city sync with your breath."
  },
  {
    id: "greenhouse",
    name: "Rainy Greenhouse",
    time: "01:08",
    weather: "Heavy Rain",
    track: "Glasshouse Afterglow",
    artist: "Soul Test Archive",
    length: 318,
    color: "#b8dec0",
    accent: "#a2c9ff",
    background:
      "https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?auto=format&fit=crop&w=1800&q=80",
    cover:
      "https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&w=900&q=80",
    layers: [
      { id: "rain", name: "Rain Intensity", icon: CloudRain, level: 74 },
      { id: "leaves", name: "Leaf Drip", icon: Sparkles, level: 42 },
      { id: "glass", name: "Glass Resonance", icon: Disc3, level: 26 }
    ],
    note:
      "A quiet room of wet leaves, glass, and low synth bloom. Soft enough for thinking, alive enough to stay awake."
  },
  {
    id: "window",
    name: "Mood Mode",
    time: "03:33",
    weather: "City Rain",
    track: "Midnight Echoes",
    artist: "Lune Orchestral",
    length: 292,
    color: "#d6c7ff",
    accent: "#f5b36d",
    background:
      "https://images.unsplash.com/photo-1519608487953-e999c86e7455?auto=format&fit=crop&w=1800&q=80",
    cover:
      "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=900&q=80",
    layers: [
      { id: "rain", name: "Rain Intensity", icon: CloudRain, level: 68 },
      { id: "thunder", name: "Distant Thunder", icon: Sparkles, level: 20 },
      { id: "vinyl", name: "Vinyl Crackle", icon: Disc3, level: 45 }
    ],
    note:
      "A rain-streaked window, blurred lights, and one slow melody holding the room together."
  }
];

function formatTime(seconds) {
  const min = Math.floor(seconds / 60);
  const sec = Math.floor(seconds % 60);
  return `${min}:${sec.toString().padStart(2, "0")}`;
}

function useNoctisAudio(isPlaying, space, mix) {
  const audioRef = useRef(null);

  useEffect(() => {
    if (!isPlaying) {
      if (audioRef.current) {
        audioRef.current.master.gain.setTargetAtTime(0, audioRef.current.ctx.currentTime, 0.08);
      }
      return;
    }

    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;

    const ctx = audioRef.current?.ctx || new AudioContext();
    ctx.resume();

    if (!audioRef.current) {
      const master = ctx.createGain();
      master.gain.value = 0;
      master.connect(ctx.destination);

      const oscillators = [110, 165, 220].map((frequency, index) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = index === 1 ? "triangle" : "sine";
        osc.frequency.value = frequency;
        gain.gain.value = 0.045;
        osc.connect(gain);
        gain.connect(master);
        osc.start();
        return { osc, gain };
      });

      const noiseBuffer = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate);
      const channel = noiseBuffer.getChannelData(0);
      for (let i = 0; i < channel.length; i += 1) {
        channel[i] = Math.random() * 2 - 1;
      }
      const noise = ctx.createBufferSource();
      const noiseGain = ctx.createGain();
      const filter = ctx.createBiquadFilter();
      noise.buffer = noiseBuffer;
      noise.loop = true;
      filter.type = "lowpass";
      filter.frequency.value = 900;
      noiseGain.gain.value = 0.02;
      noise.connect(filter);
      filter.connect(noiseGain);
      noiseGain.connect(master);
      noise.start();

      audioRef.current = { ctx, master, oscillators, noiseGain, filter };
    }

    const engine = audioRef.current;
    const base = space.id === "greenhouse" ? 98 : space.id === "window" ? 82 : 110;
    engine.oscillators.forEach(({ osc, gain }, index) => {
      osc.frequency.setTargetAtTime(base * [1, 1.5, 2][index], ctx.currentTime, 0.12);
      gain.gain.setTargetAtTime(0.025 + mix[index % mix.length].level / 2600, ctx.currentTime, 0.2);
    });
    engine.noiseGain.gain.setTargetAtTime(0.01 + mix[0].level / 2400, ctx.currentTime, 0.2);
    engine.filter.frequency.setTargetAtTime(550 + mix[1].level * 12, ctx.currentTime, 0.2);
    engine.master.gain.setTargetAtTime(0.8, ctx.currentTime, 0.08);
  }, [isPlaying, space, mix]);
}

function App() {
  const [spaceIndex, setSpaceIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [elapsed, setElapsed] = useState(84);
  const [favorite, setFavorite] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [youtubeQuery, setYoutubeQuery] = useState("");
  const [youtubeResults, setYoutubeResults] = useState([]);
  const [youtubeStatus, setYoutubeStatus] = useState("idle");
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [mixes, setMixes] = useState(() =>
    Object.fromEntries(spaces.map((space) => [space.id, space.layers]))
  );

  const space = spaces[spaceIndex];
  const mix = mixes[space.id];
  const progress = Math.min(100, (elapsed / space.length) * 100);
  const visualStyle = useMemo(
    () => ({
      "--space-color": space.color,
      "--space-accent": space.accent,
      "--progress": `${progress}%`
    }),
    [space, progress]
  );

  useNoctisAudio(isPlaying, space, mix);

  useEffect(() => {
    setYoutubeQuery(`${space.track} ${space.artist} music`);
  }, [space]);

  useEffect(() => {
    if (!YOUTUBE_API_KEY || !youtubeQuery.trim()) {
      setYoutubeResults([]);
      setSelectedVideo(null);
      setYoutubeStatus(YOUTUBE_API_KEY ? "idle" : "missing-key");
      return undefined;
    }

    const controller = new AbortController();
    const timeout = window.setTimeout(async () => {
      setYoutubeStatus("loading");

      try {
        const params = new URLSearchParams({
          part: "snippet",
          maxResults: "5",
          q: youtubeQuery,
          type: "video",
          videoCategoryId: "10",
          key: YOUTUBE_API_KEY
        });
        const response = await fetch(
          `https://www.googleapis.com/youtube/v3/search?${params.toString()}`,
          { signal: controller.signal }
        );
        const payload = await response.json();

        if (!response.ok) {
          throw new Error(payload?.error?.message || "YouTube search failed");
        }

        const results = payload.items
          .filter((item) => item.id?.videoId)
          .map((item) => ({
            id: item.id.videoId,
            title: item.snippet.title,
            channel: item.snippet.channelTitle,
            thumb:
              item.snippet.thumbnails?.medium?.url ||
              item.snippet.thumbnails?.default?.url
          }));

        setYoutubeResults(results);
        setSelectedVideo((current) => current || results[0] || null);
        setYoutubeStatus(results.length ? "ready" : "empty");
      } catch (error) {
        if (error.name !== "AbortError") {
          setYoutubeStatus(error.message);
          setYoutubeResults([]);
        }
      }
    }, 350);

    return () => {
      window.clearTimeout(timeout);
      controller.abort();
    };
  }, [youtubeQuery]);

  useEffect(() => {
    if (!isPlaying) return undefined;
    const timer = window.setInterval(() => {
      setElapsed((current) => (current >= space.length ? 0 : current + 1));
    }, 1000);
    return () => window.clearInterval(timer);
  }, [isPlaying, space.length]);

  function chooseSpace(nextIndex) {
    setSpaceIndex(nextIndex);
    setElapsed(Math.round(spaces[nextIndex].length * 0.3));
    setSelectedVideo(null);
  }

  function skip(direction) {
    const next = (spaceIndex + direction + spaces.length) % spaces.length;
    chooseSpace(next);
  }

  function updateLayer(layerId, level) {
    setMixes((current) => ({
      ...current,
      [space.id]: current[space.id].map((layer) =>
        layer.id === layerId ? { ...layer, level: Number(level) } : layer
      )
    }));
  }

  return (
    <main className="app" style={visualStyle}>
      <div className="backdrop" aria-hidden="true">
        <img src={space.background} alt="" />
        <div className="backdropTint" />
      </div>

      <aside className="sidebar" aria-label="Primary">
        <div>
          <p className="brand">Noctis</p>
          <p className="eyebrow">Cinematic Audio</p>
        </div>
        <nav className="sideNav">
          <a className="sideLink" href="#library">
            <Library size={20} /> Library
          </a>
          <a className="sideLink active" href="#spaces">
            <Sparkles size={20} /> Spaces
          </a>
          <a className="sideLink" href="#settings">
            <Settings size={20} /> Settings
          </a>
        </nav>
        <div className="profile">
          <div className="avatar">N</div>
          <div>
            <strong>Alex Chen</strong>
            <span>Premium Member</span>
          </div>
        </div>
      </aside>

      <section className="shell">
        <header className="topbar">
          <div>
            <p className="eyebrow">Space</p>
            <h1>{space.name}</h1>
          </div>
          <div className="topActions">
            <span>
              {space.time} / {space.weather}
            </span>
            <button type="button" className="pillButton" onClick={() => setDrawerOpen(true)}>
              <SlidersHorizontal size={17} /> Mixer
            </button>
          </div>
        </header>

        <section className="contentGrid">
          <section className="playerStage" aria-label="Now playing">
            <div className="trackInfo">
              <p className="eyebrow">Now Introspecting</p>
              <h2>{space.track}</h2>
              <p>{space.artist}</p>
            </div>
            <div className="coverWrap">
              <img src={space.cover} alt={`${space.track} cover art`} className="cover" />
              <div className="coverReflection" />
            </div>
            {selectedVideo && (
              <div className="youtubePlayer" aria-label="YouTube player">
                <iframe
                  title={selectedVideo.title}
                  src={`https://www.youtube.com/embed/${selectedVideo.id}?rel=0&modestbranding=1&autoplay=${
                    isPlaying ? "1" : "0"
                  }`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              </div>
            )}
          </section>

          <aside className="infoRail" id="spaces">
            <section className="panel">
              <div className="panelHeader">
                <p className="eyebrow">Mood Selector</p>
                <Shuffle size={18} />
              </div>
              <div className="spaceList">
                {spaces.map((item, index) => (
                  <button
                    type="button"
                    key={item.id}
                    className={`spaceChoice ${index === spaceIndex ? "selected" : ""}`}
                    onClick={() => chooseSpace(index)}
                  >
                    <span>{item.name}</span>
                    <small>{item.track}</small>
                  </button>
                ))}
              </div>
            </section>

            <section className="panel">
              <p className="eyebrow">Ambience Layers</p>
              <div className="layerList">
                {mix.map((layer) => {
                  const Icon = layer.icon;
                  return (
                    <label className="layer" key={layer.id}>
                      <span>
                        <Icon size={19} /> {layer.name}
                      </span>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={layer.level}
                        onChange={(event) => updateLayer(layer.id, event.target.value)}
                        aria-label={layer.name}
                      />
                    </label>
                  );
                })}
              </div>
            </section>

            <section className="panel youtubePanel">
              <div className="panelHeader">
                <p className="eyebrow">YouTube Music</p>
                <Volume2 size={18} />
              </div>
              <label className="searchBox">
                <span>Search track</span>
                <input
                  type="search"
                  value={youtubeQuery}
                  onChange={(event) => setYoutubeQuery(event.target.value)}
                  placeholder="Search YouTube music"
                />
              </label>
              {youtubeStatus === "missing-key" && (
                <p className="youtubeMessage">Add VITE_YOUTUBE_API_KEY to enable search.</p>
              )}
              {youtubeStatus === "loading" && <p className="youtubeMessage">Searching...</p>}
              {youtubeStatus !== "missing-key" && youtubeResults.length > 0 && (
                <div className="videoList">
                  {youtubeResults.map((video) => (
                    <button
                      type="button"
                      key={video.id}
                      className={`videoChoice ${selectedVideo?.id === video.id ? "selected" : ""}`}
                      onClick={() => {
                        setSelectedVideo(video);
                        setIsPlaying(true);
                      }}
                    >
                      {video.thumb && <img src={video.thumb} alt="" />}
                      <span>
                        <strong>{video.title}</strong>
                        <small>{video.channel}</small>
                      </span>
                    </button>
                  ))}
                </div>
              )}
              {typeof youtubeStatus === "string" &&
                !["idle", "ready", "loading", "missing-key"].includes(youtubeStatus) && (
                  <p className="youtubeMessage">{youtubeStatus}</p>
                )}
            </section>

            <section className="quotePanel">
              <p>{space.note}</p>
            </section>
          </aside>
        </section>
      </section>

      <nav className="controls" aria-label="Playback controls">
        <div className="timeline">
          <button
            type="button"
            className="timelineTrack"
            aria-label="Seek track"
            onClick={(event) => {
              const rect = event.currentTarget.getBoundingClientRect();
              setElapsed(Math.round(((event.clientX - rect.left) / rect.width) * space.length));
            }}
          >
            <span />
          </button>
          <div className="timeRow">
            <span>{formatTime(elapsed)}</span>
            <span>{formatTime(space.length)}</span>
          </div>
        </div>
        <div className="controlButtons">
          <button type="button" aria-label="Queue">
            <ListMusic size={22} />
          </button>
          <button type="button" aria-label="Previous" onClick={() => skip(-1)}>
            <SkipBack size={25} />
          </button>
          <button
            type="button"
            className="playButton"
            aria-label={isPlaying ? "Pause" : "Play"}
            onClick={() => setIsPlaying((current) => !current)}
          >
            {isPlaying ? <Pause size={34} /> : <Play size={34} fill="currentColor" />}
          </button>
          <button type="button" aria-label="Next" onClick={() => skip(1)}>
            <SkipForward size={25} />
          </button>
          <button
            type="button"
            className={favorite ? "liked" : ""}
            aria-label="Favorite"
            onClick={() => setFavorite((current) => !current)}
          >
            <Heart size={22} fill={favorite ? "currentColor" : "none"} />
          </button>
        </div>
      </nav>

      <div className={`drawer ${drawerOpen ? "open" : ""}`} aria-hidden={!drawerOpen}>
        <div className="drawerHeader">
          <div>
            <p className="eyebrow">Live Mixer</p>
            <h3>{space.name}</h3>
          </div>
          <button type="button" onClick={() => setDrawerOpen(false)}>
            Close
          </button>
        </div>
        {mix.map((layer) => (
          <label className="drawerLayer" key={layer.id}>
            <span>
              {layer.name}
              <strong>{layer.level}%</strong>
            </span>
            <input
              type="range"
              min="0"
              max="100"
              value={layer.level}
              onChange={(event) => updateLayer(layer.id, event.target.value)}
            />
          </label>
        ))}
        <button
          type="button"
          className="resetButton"
          onClick={() =>
            setMixes((current) => ({
              ...current,
              [space.id]: spaces.find((item) => item.id === space.id).layers
            }))
          }
        >
          Reset Space
        </button>
        <button type="button" className="shareButton">
          <Share2 size={17} /> Share Mood
        </button>
      </div>
    </main>
  );
}

createRoot(document.getElementById("root")).render(<App />);
