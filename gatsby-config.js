const process = require('process');

const commitId = process.env.BUILD_SOURCEVERSION ?
  process.env.BUILD_SOURCEVERSION.substring(0,8) :
  "Development";

module.exports = {
  siteMetadata: {
    title: 'frye.codes',
    description: "Harvey Frye's coding blog",
    siteUrl: "https://frye.codes",
    commitId,
    buildDate: new Date().toISOString().replace(/T/, ' ').replace(/\..+/, ''),
    social: [
      {name: "GitHub", icon: "fa-github", url: "https://github.com/HLFrye"},
      {name: "Linked In", icon: "fa-linkedin-square", url: "https://www.linkedin.com/in/harvey-frye-codes"},
      {name: "Twitter", icon: "fa-twitter", url: "https://twitter.com/Frye"},
//      {name: "Email", icon: "fa-envelope", url: "mailto:harvey@frye.codes"},
    ]
  },
  plugins: [
    'gatsby-plugin-layout',
    'gatsby-plugin-react-helmet',
    `gatsby-plugin-catch-links`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/src/pages`,
        name: 'pages'
      }
    },
    `gatsby-plugin-sharp`,
    'gatsby-transformer-sharp',
    {
      resolve: `gatsby-transformer-remark`,
      options: {
        plugins: [
          {
            resolve: `gatsby-remark-images`,
            options: {
              // It's important to specify the maxWidth (in pixels) of
              // the content container as this plugin uses this as the
              // base for generating different widths of each image.
              maxWidth: 1150,
            },
          },
          {
            resolve: `gatsby-remark-prismjs`,
            options: {
              classPrefix: "language-",
              inlineCodeMarker: null,
              aliases: {}
            }
          }
        ]
      }
    }
  ],
}
