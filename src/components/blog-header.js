import React from "react";
import Link from "gatsby-link";
import _ from "lodash"

const TagButton = (tagName) => {
  const tagLink = `/tags/${_.kebabCase(tagName)}`;

  return (
    <span className="tag">
      <Link to={tagLink} className="tagLink">
        {tagName}
      </Link>    
    </span>
  );
}

const TagContainer = ({tags}) => (
  <span className="article-tag-container">
    File under: {tags.map(TagButton)}
  </span>
)

const TitleLink = (title, link) => (
  <Link className="blog-post-preview-title" to={link}>{title}</Link>
)

export default function BlogHeader({title, tags, date, link}) {
  if (link) {
    title = TitleLink(title, link);
  }

  return (
    <div>
      <h1>{title}</h1>
      <div className="article-header">
        <TagContainer tags={tags} />
        <span className="article-publish-date">{date}</span>
      </div>
    </div>
  )
}