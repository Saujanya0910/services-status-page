const connectEventSource = () => new EventSource(`${import.meta.env.VITE_API_DOMAIN}/api/events`);
export default connectEventSource;