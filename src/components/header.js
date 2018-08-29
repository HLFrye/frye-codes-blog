import React from 'react'
import Link from 'gatsby-link'
import SocialButton from './social-contact'

const Header = ({ siteTitle, socialLinks }) => (
  <div className="header">
    <span className="title">
      <Link to="/" className="home-link">
        {siteTitle}
      </Link>
    </span>
    <span className="fa-2x social-container">
      {socialLinks.map(SocialButton)}
    </span>
  </div>
)

export default Header
