// js/modules/api.js — pemanggilan API publik (async/await)
const URLS = {
  weather: "https://api.open-meteo.com/v1/forecast?latitude=-5.36&longitude=105.31&current_weather=true",
  quote: "https://dummyjson.com/quotes/random",
  todos: "https://jsonplaceholder.typicode.com/todos?_limit=5",
};

const getJSON = async (url) => {
  const res = await fetch(url, { signal: AbortSignal.timeout(8000) });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
};

export const fetchWeather = async () => {
  const { current_weather: { temperature, windspeed, weathercode } } = await getJSON(URLS.weather);
  return { temperature, windspeed, weathercode };
};

export const fetchQuote = async () => {
  const { quote, author } = await getJSON(URLS.quote);
  return { quote, author };
};

export const fetchSeedTodos = async () => {
  const todos = await getJSON(URLS.todos);
  return todos.map(({ title, completed }) => ({ title, done: completed }));
};

export const weatherLabel = (code) => {
  if (code === 0) return "Cerah";
  if (code <= 3) return "Berawan";
  if (code <= 48) return "Berkabut";
  if (code <= 67) return "Hujan";
  if (code <= 82) return "Hujan deras";
  return "Badai petir";
};
