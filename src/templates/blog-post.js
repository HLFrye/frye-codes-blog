import React from "react";
import Helmet from "react-helmet";

const TagButton = (tagName) => (
  <span className="tag">{tagName}</span>
);

const TagContainer = ({tags}) => (
  <span className="article-tag-container">
    File under: {tags.map(TagButton)}
  </span>
)

export default function Template({
  data 
}) {
  const post = data.markdownRemark; 
  return (
    <div className="blog-post-container">
     <Helmet title={`frye.codes - ${post.frontmatter.title}`} />
      <div className="blog-post">
        <h1>{post.frontmatter.title}</h1>
        <div className="article-header">
          <TagContainer tags={post.frontmatter.tags} />
          <span className="article-publish-date">{post.frontmatter.date}</span>
        </div>
        <div
          className="blog-post-content"
          dangerouslySetInnerHTML={{ __html: post.html }}
        />
      </div>
    </div>
  );
}

export const pageQuery = graphql`
  query BlogPostByPath($path: String!) {
    markdownRemark(frontmatter: { path: { eq: $path } }) {
      html
      frontmatter {
        date(formatString: "MMMM DD, YYYY")
        path
        title
        tags
      }
    }
  }
`
;