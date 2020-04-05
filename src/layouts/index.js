import React from 'react'
import PropTypes from 'prop-types'
import Helmet from 'react-helmet'

import Header from '../components/header'
import './index.css'
import '../../styles/layout-override.css';
import '../../styles/font-awesome.css';
import "prismjs/themes/prism-dark.css";
import "../../styles/hamburger.css";

import icon16 from "./favicon-16x16.png";
import icon32 from './favicon-32x32.png';
//import manifest from './site.webmanifest';
import maskIcon from "./safari-pinned-tab.svg"; 
import appleTouchIcon from "./apple-touch-icon.png";

import { StaticQuery, graphql } from "gatsby"

const query = graphql`
  query SiteTitleQuery {
    site {
      siteMetadata {
        title
        commitId
        buildDate
        social {
          name
          url
          icon
        }
      }
    }
  }
`


const Layout = ({ children }) => (
  <StaticQuery
    query={query}
    render={data => (
  <div>
    <Helmet
      title={data.site.siteMetadata.title}
      meta={[
        { name: 'description', content: 'Sample' },
        { name: 'keywords', content: 'sample, something' },
        { name: "msapplication-TileColor", content: "#da532c"},
        { name: "theme-color", content: "#ffffff"}, 
      ]}
    >
      <link rel="apple-touch-icon" sizes="180x180" href={`${appleTouchIcon}`} />
      <link rel="icon" type="image/png" sizes="32x32" href={`${icon32}`} />
      <link rel="icon" type="image/png" sizes="16x16" href={`${icon16}`} />
      {/* <link rel="manifest" href={`${manifest}`} /> */}
      <link rel="mask-icon" href={`${maskIcon}`} color="#5bbad5" />
    </Helmet>
    <Header siteTitle={data.site.siteMetadata.title} socialLinks={data.site.siteMetadata.social} />
    <div className="bodyWrapper">
      <div className="body">
        {children}
      </div>
    </div>
  </div>
    )}
  />
)

Layout.propTypes = {
  children: PropTypes.func,
}

export default Layout
