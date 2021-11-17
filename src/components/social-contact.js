import React from 'react'
import Link from 'gatsby-link'


const SocialButton = ({ name, icon, url }) => (
  <a
    href={url}
    className="social-link"
    >
    <span className="fa-stack social-button">
      <i className="fa fa-circle fa-stack-2x social-button-background" aria-hidden="true"></i>
      <i className={`fa fa-stack-1x ${icon}`} aria-hidden="true"></i>
    </span>
  </a>
)

export default SocialButton