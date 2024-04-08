module.exports = ({ env }) => ({
  // Sentry plugin configuration
  sentry: {
    enabled: true, // Enable Sentry integration
    config: {
      dsn: env("SENTRY_DSN"), // Set Sentry DSN from environment variable
      sendMetadata: true, // Enable sending metadata to Sentry
    },
  },
  // Documentation plugin configuration
  documentation: {
    enabled: true, // Enable the Documentation plugin
    config: {
      info: { version: "1.0.0" }, // Set the documentation version
      "x-strapi-config": {
        plugins: [], // Additional plugin configuration (currently empty)
      },
    },
  },
});
