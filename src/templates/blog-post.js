import React from "react";
import Helmet from "react-helmet";
import BlogHeader from "../components/blog-header";
import { DiscussionEmbed } from "disqus-react";

export default function Template({
  data 
}) {
  const post = data.markdownRemark; 
  const disqusShortname = "frye-codes";
  const disqusConfig = {
    identifier: post.id,
    title: post.frontmatter.title,
  };

  return (
    <div className="blog-post-container">
     <Helmet title={`frye.codes - ${post.frontmatter.title}`} />
      <div className="blog-post">
        <BlogHeader {...post.frontmatter} />
        <div
          className="blog-post-content"
          dangerouslySetInnerHTML={{ __html: post.html }}
        />
        <DiscussionEmbed shortname={disqusShortname} config={disqusConfig} />
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