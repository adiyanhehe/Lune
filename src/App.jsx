import React, { useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  BookOpen,
  Building2,
  CloudRain,
  Compass,
  Droplets,
  Flame,
  Heart,
  Home,
  Library,
  Mountain,
  Pause,
  Play,
  Search,
  Settings,
  ShipWheel,
  SkipBack,
  SkipForward,
  SlidersHorizontal,
  Snowflake,
  Sparkles,
  Train,
  TreePine,
  Volume2,
  Waves,
  Wind
} from "lucide-react";
import "./styles.css";

const YOUTUBE_API_KEY =
  import.meta.env.VITE_YOUTUBE_API_KEY || "AIzaSyD5c_RfbdsYFgTjGJ81ZAaHWRI58nE-_2w";

const spaceData = [
  {
    id: "sunset",
    title: "Sunset Balcony",
    track: "Midnight Reflection",
    artist: "Noctis Original Series",
    video: "jfKfPfyJRdk",
    icon: Wind,
    palette: ["#a2c9ff", "#ffb37c", "#10141a"],
    bg: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1800&q=80",
    cover: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=900&q=80",
    weather: "22:15 / Partly Cloudy",
    quote: "The golden hour never truly ends here. Let the coastal city sync with your breath.",
    layers: ["Warm Breeze", "Distant Waves", "Night Traffic"],
    layout: "classic"
  },
  {
    id: "greenhouse",
    title: "Rainy Greenhouse",
    track: "Petrichor Dreams",
    artist: "Soul Test Archive",
    video: "5qap5aO4i9A",
    icon: CloudRain,
    palette: ["#b8dec0", "#a2c9ff", "#0e1712"],
    bg: "https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?auto=format&fit=crop&w=1800&q=80",
    cover: "https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&w=900&q=80",
    weather: "01:08 / Heavy Rain",
    quote: "Wet leaves, softened glass, and slow synth bloom under the roof.",
    layers: ["Rain Intensity", "Leaf Drip", "Glass Resonance"],
    layout: "greenhouse"
  },
  {
    id: "train",
    title: "Midnight Train",
    track: "Nocturnal Transit",
    artist: "Lune Rail Sessions",
    video: "4xDzrJKXOOY",
    icon: Train,
    palette: ["#ffd49a", "#8ab4ff", "#11131c"],
    bg: "https://images.unsplash.com/photo-1474487548417-781cb71495f3?auto=format&fit=crop&w=1800&q=80",
    cover: "https://images.unsplash.com/photo-1519003722824-194d4455a60c?auto=format&fit=crop&w=900&q=80",
    weather: "00:42 / Window Fog",
    quote: "A private cabin moving through blue-black country and amber station lights.",
    layers: ["Rhythmic Tracks", "Cabin Hum", "Distant Whistle"],
    layout: "bento"
  },
  {
    id: "cabin",
    title: "Mountain Cabin",
    track: "Winter Nocturne",
    artist: "Frostline Ensemble",
    video: "hHW1oY26kxQ",
    icon: Mountain,
    palette: ["#d3e4ff", "#cec6b7", "#10141a"],
    bg: "https://images.unsplash.com/photo-1482192505345-5655af888cc4?auto=format&fit=crop&w=1800&q=80",
    cover: "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=900&q=80",
    weather: "23:04 / Snowfall",
    quote: "A fire, a ridge line, and piano notes disappearing into timber.",
    layers: ["Fireplace", "Snowfall", "Pine Wind"],
    layout: "hero"
  },
  {
    id: "sea",
    title: "Deep Sea Submarine",
    track: "Bathyal Signals",
    artist: "Abyss Choir",
    video: "DWcJFNfaw9c",
    icon: ShipWheel,
    palette: ["#7fd7ff", "#48a0a8", "#061018"],
    bg: "https://images.unsplash.com/photo-1518837695005-2083093ee35b?auto=format&fit=crop&w=1800&q=80",
    cover: "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=900&q=80",
    weather: "Depth 420m / Silent",
    quote: "Sonar rings pulse through dark water while the hull sings low.",
    layers: ["Sonar Pulse", "Hull Pressure", "Distant Whale"],
    layout: "deep"
  },
  {
    id: "kyoto",
    title: "Kyoto Spring Drizzle",
    track: "Tea Steam Reverie",
    artist: "Garden House",
    video: "lTRiuFIWV54",
    icon: Droplets,
    palette: ["#ffd7df", "#b8dec0", "#15130f"],
    bg: "https://images.unsplash.com/photo-1528360983277-13d401cdc186?auto=format&fit=crop&w=1800&q=80",
    cover: "https://images.unsplash.com/photo-1545569341-9eb8b30979d9?auto=format&fit=crop&w=900&q=80",
    weather: "16:20 / Light Drizzle",
    quote: "Tatami quiet, wet stone, and one kettle singing behind paper doors.",
    layers: ["Kettle Steam", "Garden Rain", "Bamboo Knock"],
    layout: "minimal"
  },
  {
    id: "neon",
    title: "Neon Rainfall",
    track: "Wet Asphalt Bloom",
    artist: "Afterimage FM",
    video: "MYPVQccHhAQ",
    icon: Building2,
    palette: ["#f0a7ff", "#58a6ff", "#0c0b15"],
    bg: "https://images.unsplash.com/photo-1519608487953-e999c86e7455?auto=format&fit=crop&w=1800&q=80",
    cover: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=900&q=80",
    weather: "02:17 / Neon Rain",
    quote: "City color spills across glass, and every drop becomes a tiny screen.",
    layers: ["Rain Streaks", "Traffic Wash", "Electric Buzz"],
    layout: "neon"
  },
  {
    id: "glacial",
    title: "Glacial Drift",
    track: "Blue Hour Icefield",
    artist: "Northing",
    video: "2OEL4P1Rz04",
    icon: Snowflake,
    palette: ["#e2f3ff", "#83b4cf", "#0b1218"],
    bg: "https://images.unsplash.com/photo-1480497490787-505ec076689f?auto=format&fit=crop&w=1800&q=80",
    cover: "https://images.unsplash.com/photo-1517783999520-f068d7431a60?auto=format&fit=crop&w=900&q=80",
    weather: "05:50 / Whiteout",
    quote: "A cold expanse where strings move slowly under aurora light.",
    layers: ["Ice Crackle", "Aurora Static", "Distant Wind"],
    layout: "hero"
  },
  {
    id: "desert",
    title: "Desert Oasis",
    track: "Mirage Letters",
    artist: "Dune Parlour",
    video: "rUxyKA_-grg",
    icon: Flame,
    palette: ["#ffcf8f", "#7fd7ff", "#1b120b"],
    bg: "https://images.unsplash.com/photo-1509316785289-025f5b846b35?auto=format&fit=crop&w=1800&q=80",
    cover: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=900&q=80",
    weather: "18:03 / Dry Heat",
    quote: "A pool of shade, distant bells, and low percussion over warm air.",
    layers: ["Palm Leaves", "Water Lapping", "Distant Bells"],
    layout: "minimal"
  },
  {
    id: "study",
    title: "The Alchemist's Study",
    track: "Library of Echoes",
    artist: "Noctis Chamber",
    video: "n61ULEU7CO0",
    icon: BookOpen,
    palette: ["#ffd7a8", "#a2c9ff", "#140f0b"],
    bg: "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=1800&q=80",
    cover: "https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&w=900&q=80",
    weather: "20:44 / Candlelit",
    quote: "Dust, vellum, ink, and a melody turning pages by itself.",
    layers: ["Page Turns", "Candle Noise", "Clockwork"],
    layout: "bento"
  },
  {
    id: "cloud",
    title: "Cloud City Lounge",
    track: "Stratosphere Velvet",
    artist: "Skyline Trio",
    video: "7NOSDKb0HlU",
    icon: Compass,
    palette: ["#f7f1ff", "#a2c9ff", "#111827"],
    bg: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1800&q=80",
    cover: "https://images.unsplash.com/photo-1493246507139-91e8fad9978e?auto=format&fit=crop&w=900&q=80",
    weather: "Above 40,000ft",
    quote: "A lounge suspended over evening cloud, weightless and bright.",
    layers: ["Soft Turbulence", "Glass Clink", "Skyline Bass"],
    layout: "classic"
  },
  {
    id: "temple",
    title: "The Silent Temple",
    track: "Stone Lanterns",
    artist: "Still Bell",
    video: "Na0w3Mz46GA",
    icon: TreePine,
    palette: ["#cec6b7", "#b8dec0", "#0f1210"],
    bg: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1800&q=80",
    cover: "https://images.unsplash.com/photo-1528360983277-13d401cdc186?auto=format&fit=crop&w=900&q=80",
    weather: "04:10 / Incense",
    quote: "Bells arrive slowly. Silence has architecture here.",
    layers: ["Incense Air", "Bell Tail", "Stone Courtyard"],
    layout: "minimal"
  }
];

const libraryRows = [
  "Songs played during rainy nights",
  "Your winter favorites",
  "Midnight Echoes",
  "Recent Library",
  "Recent Playlists"
];

function App() {
  const [view, setView] = useState("spaces");
  const [activeId, setActiveId] = useState(spaceData[0].id);
  const [playing, setPlaying] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [liked, setLiked] = useState(false);
  const [mix, setMix] = useState([68, 42, 23]);

  const active = spaceData.find((space) => space.id === activeId) || spaceData[0];
  const Icon = active.icon;
  const visibleSpaces = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return spaceData;
    return spaceData.filter(
      (space) =>
        space.title.toLowerCase().includes(q) ||
        space.track.toLowerCase().includes(q) ||
        space.artist.toLowerCase().includes(q)
    );
  }, [query]);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return undefined;
    }
    const controller = new AbortController();
    const timer = window.setTimeout(async () => {
      try {
        const params = new URLSearchParams({
          part: "snippet",
          maxResults: "5",
          q: `${query} ambient music`,
          type: "video",
          videoCategoryId: "10",
          key: YOUTUBE_API_KEY
        });
        const response = await fetch(`https://www.googleapis.com/youtube/v3/search?${params}`, {
          signal: controller.signal
        });
        const payload = await response.json();
        if (!response.ok) throw new Error("search failed");
        setResults(
          payload.items
            .filter((item) => item.id?.videoId)
            .map((item) => ({
              id: item.id.videoId,
              title: item.snippet.title.replaceAll("&amp;", "&"),
              artist: item.snippet.channelTitle,
              cover: item.snippet.thumbnails?.medium?.url || item.snippet.thumbnails?.default?.url
            }))
        );
      } catch (error) {
        if (error.name !== "AbortError") setResults([]);
      }
    }, 450);
    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [query]);

  function openSpace(space) {
    setActiveId(space.id);
    setView("player");
    setPlaying(true);
    setLiked(false);
    setMix([68, 42, 23]);
  }

  function skip(direction) {
    const index = spaceData.findIndex((space) => space.id === active.id);
    openSpace(spaceData[(index + direction + spaceData.length) % spaceData.length]);
  }

  const style = {
    "--primary": active.palette[0],
    "--accent": active.palette[1],
    "--base": active.palette[2],
    "--bg": `url(${active.bg})`
  };

  return (
    <main className={`luneApp layout-${active.layout}`} style={style}>
      <div className="cinemaBg" />
      <aside className="sideNav" aria-label="Lune navigation">
        <button className="brandButton" type="button" onClick={() => setView("intro")}>
          LUNE
          <span>Cinematic Audio</span>
        </button>
        <button className={view === "spaces" ? "navActive" : ""} onClick={() => setView("spaces")} type="button">
          <Home size={20} /> Spaces
        </button>
        <button className={view === "library" ? "navActive" : ""} onClick={() => setView("library")} type="button">
          <Library size={20} /> Library
        </button>
        <button className={view === "player" ? "navActive" : ""} onClick={() => setView("player")} type="button">
          <Sparkles size={20} /> Now Playing
        </button>
        <button className={view === "customize" ? "navActive" : ""} onClick={() => setView("customize")} type="button">
          <Settings size={20} /> Customization
        </button>
        <div className="memberBadge">
          <div>A</div>
          <span>Alex Chen</span>
          <small>Premium Member</small>
        </div>
      </aside>

      <section className="screenShell">
        <header className="topBar">
          <label className="searchPill">
            <Search size={18} />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search spaces, songs, atmospheres"
            />
          </label>
          <button className="moodButton" type="button" onClick={() => setView("mood")}>
            <SlidersHorizontal size={18} /> Mood Selector
          </button>
        </header>

        {view === "intro" && <IntroScreen onEnter={() => setView("spaces")} />}
        {view === "spaces" && <SpacesScreen spaces={visibleSpaces} openSpace={openSpace} />}
        {view === "library" && <LibraryScreen openSpace={openSpace} />}
        {view === "customize" && <CustomizeScreen active={active} mix={mix} setMix={setMix} />}
        {view === "mood" && <MoodScreen spaces={spaceData} active={active} openSpace={openSpace} />}
        {view === "player" && (
          <PlayerScreen
            active={active}
            Icon={Icon}
            liked={liked}
            mix={mix}
            setMix={setMix}
            setLiked={setLiked}
            results={results}
            openSpace={openSpace}
          />
        )}
      </section>

      <footer className="bottomPlayer">
        <img src={active.cover} alt="" />
        <div className="miniTitle">
          <strong>{active.track}</strong>
          <span>{active.artist}</span>
        </div>
        <div className="transport">
          <button type="button" onClick={() => skip(-1)} aria-label="Previous space">
            <SkipBack size={22} />
          </button>
          <button className="playCore" type="button" onClick={() => setPlaying((value) => !value)} aria-label="Play">
            {playing ? <Pause size={25} fill="currentColor" /> : <Play size={25} fill="currentColor" />}
          </button>
          <button type="button" onClick={() => skip(1)} aria-label="Next space">
            <SkipForward size={22} />
          </button>
        </div>
        <div className="volume">
          <Volume2 size={18} />
          <span />
        </div>
      </footer>

      <iframe
        className="audioOnly"
        title={active.track}
        src={`https://www.youtube.com/embed/${active.video}?autoplay=${playing ? "1" : "0"}&rel=0&modestbranding=1`}
        allow="autoplay; encrypted-media"
      />
    </main>
  );
}

function IntroScreen({ onEnter }) {
  return (
    <section className="introScreen">
      <h1>LUNE</h1>
      <p>Cinematic audio spaces for focus, memory, weather, and night travel.</p>
      <button type="button" onClick={onEnter}>
        Enter Spaces
      </button>
    </section>
  );
}

function SpacesScreen({ spaces, openSpace }) {
  return (
    <section className="spacesScreen">
      <div className="screenHeading">
        <p>Spaces</p>
        <h1>Choose a room for the sound.</h1>
      </div>
      <div className="spaceGrid">
        {spaces.map((space) => {
          const Icon = space.icon;
          return (
            <button className={`spaceCard ${space.layout}`} key={space.id} type="button" onClick={() => openSpace(space)}>
              <img src={space.cover} alt="" />
              <span className="spaceGlow" />
              <strong>{space.title}</strong>
              <small>{space.track}</small>
              <Icon size={22} />
            </button>
          );
        })}
      </div>
    </section>
  );
}

function LibraryScreen({ openSpace }) {
  return (
    <section className="libraryScreen">
      <div className="screenHeading">
        <p>Library</p>
        <h1>Library of Echoes</h1>
      </div>
      <div className="libraryHero">
        <div>
          <h2>Songs played during rainy nights</h2>
          <p>Recent spaces, saved moods, and session collections from the Noctis archive.</p>
        </div>
        <BookOpen size={72} />
      </div>
      <div className="libraryRows">
        {libraryRows.map((row, index) => (
          <button key={row} type="button" onClick={() => openSpace(spaceData[index % spaceData.length])}>
            <span>{String(index + 1).padStart(2, "0")}</span>
            <strong>{row}</strong>
            <small>{spaceData[index % spaceData.length].title}</small>
          </button>
        ))}
      </div>
    </section>
  );
}

function CustomizeScreen({ active, mix, setMix }) {
  const settings = ["Visual Atmosphere", "Theme", "Typography", "Experience", "Live Wallpapers"];
  return (
    <section className="customizeScreen">
      <div className="screenHeading">
        <p>Settings</p>
        <h1>Customization</h1>
      </div>
      <div className="settingsGrid">
        {settings.map((setting, index) => (
          <div className="settingPanel" key={setting}>
            <h2>{setting}</h2>
            <p>{active.title} profile {index + 1}</p>
            <input
              type="range"
              min="0"
              max="100"
              value={mix[index % mix.length]}
              onChange={(event) =>
                setMix((current) =>
                  current.map((value, valueIndex) =>
                    valueIndex === index % current.length ? Number(event.target.value) : value
                  )
                )
              }
            />
          </div>
        ))}
      </div>
    </section>
  );
}

function MoodScreen({ spaces, active, openSpace }) {
  return (
    <section className="moodScreen">
      <div className="screenHeading">
        <p>Mood Mode</p>
        <h1>{active.track}</h1>
      </div>
      <div className="moodOrb">
        <img src={active.cover} alt="" />
      </div>
      <div className="moodRail">
        {spaces.slice(0, 6).map((space) => (
          <button key={space.id} type="button" onClick={() => openSpace(space)}>
            {space.title}
          </button>
        ))}
      </div>
    </section>
  );
}

function PlayerScreen({ active, Icon, liked, mix, setMix, setLiked, results, openSpace }) {
  return (
    <section className="playerScreen">
      <div className="nowPanel">
        <div className="panelCopy">
          <p>{active.weather}</p>
          <h1>{active.title}</h1>
          <h2>{active.track}</h2>
          <span>{active.artist}</span>
        </div>
        <div className="coverStack">
          <img src={active.cover} alt="" />
          <Icon size={42} />
        </div>
      </div>

      <aside className="ambiencePanel">
        <h3>Ambience Layers</h3>
        {active.layers.map((layer, index) => (
          <label key={layer}>
            <span>{layer}</span>
            <input
              type="range"
              min="0"
              max="100"
              value={mix[index]}
              onChange={(event) =>
                setMix((current) =>
                  current.map((value, valueIndex) => (valueIndex === index ? Number(event.target.value) : value))
                )
              }
            />
          </label>
        ))}
      </aside>

      <section className="infoPanel">
        <p>{active.quote}</p>
        <button type="button" className={liked ? "liked" : ""} onClick={() => setLiked((value) => !value)}>
          <Heart size={18} fill={liked ? "currentColor" : "none"} /> Favorite
        </button>
      </section>

      <section className="historyPanel">
        <h3>Up Next</h3>
        {spaceData.slice(0, 5).map((space) => (
          <button key={space.id} type="button" onClick={() => openSpace(space)}>
            <img src={space.cover} alt="" />
            <span>{space.track}</span>
          </button>
        ))}
      </section>

      {results.length > 0 && (
        <section className="searchResultsPanel">
          <h3>YouTube Search</h3>
          {results.map((result) => (
            <button
              key={result.id}
              type="button"
              onClick={() =>
                openSpace({
                  ...active,
                  id: `yt-${result.id}`,
                  title: "YouTube Selection",
                  track: result.title,
                  artist: result.artist,
                  video: result.id,
                  cover: result.cover
                })
              }
            >
              <img src={result.cover} alt="" />
              <span>{result.title}</span>
            </button>
          ))}
        </section>
      )}
    </section>
  );
}

createRoot(document.getElementById("root")).render(<App />);
