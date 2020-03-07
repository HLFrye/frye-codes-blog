import React from 'react'
import Link from 'gatsby-link'
import SocialButton from './social-contact'

const Header = ({ siteTitle, socialLinks }) => (
  <div className="header">
    <div className="title">
      <Link to="/" className="home-link">
        Hi, I'm Frye
      </Link>
    </div>
    <div className="about">
      Blogging about programming
    </div>
    <div className="headerLink">
      <Link to="/" className="home-link">
        Home
      </Link>
    </div>
    <hr className="headerDivider" />
    <div className="headerLink">
      <Link to="/about" className="home-link">
        About Me
      </Link>
    </div>
    <hr className="headerDivider" />
    <div className="headerLink">
      <Link to="/tags" className="home-link">
        Tagged Posts
      </Link>
    </div>
    <hr className="headerDivider" />        
    <div className="fa-2x social-container">
      {socialLinks.map(SocialButton)}
    </div>
  </div>
)

export default Header
