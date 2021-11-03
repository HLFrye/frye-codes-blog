import React from "react";
import Link from "gatsby-link";
import BlogHeader from "../components/blog-header";
import { graphql } from "gatsby"
import Img from "gatsby-image"

//import '../styles/blog-listing.css';

function FormatExcerpt(excerpt, html) {
  const startToken = "<!-- start -->"

  // look for the <!-- start --> token
  const startAt = html.indexOf(startToken);
  if (startAt === -1) return excerpt;

  // Find the text after the start token
  // Note: This is rather ugly, I'd like to find a better way to do this in the future
  // This relies on assuming that the next thing after the start comment will be a newline and a <p> tag
  const startText = html.substring(startAt + startToken.length + 4, startAt + startToken.length + 9);

  const startOfExcerpt = excerpt.indexOf(startText);
  return excerpt.substring(startOfExcerpt);
}

export default function Index({ data }) {
  const { edges: posts } = data.allMarkdownRemark;

  return (
    <div className="blog-posts">
      <div className="posts-container">
        {
          posts
            .filter(post => post.node.frontmatter.title.length > 0)
            .map(({ node: post }) => {
              return (
                <div className="blog-post-preview" key={post.id}>
                  <Link to={post.frontmatter.path}>
                    <Img fluid={post.frontmatter.headerImg.childImageSharp.fluid} />
                    <h1>{post.frontmatter.title}</h1>
                  </Link>
                  <p className="blog-post-preview-text">{FormatExcerpt(post.excerpt, post.html)}</p>
                </div>
              );
            })
        }
      </div>
    </div>
  );
}

export const pageQuery = graphql`
  query IndexQuery {
    allMarkdownRemark(sort: { order: DESC, fields: [frontmatter___date] }) {
      edges {
        node {
          excerpt(pruneLength: 280)
          id
          html
          frontmatter {
            title
            date(formatString: "MMMM DD, YYYY")
            path
            tags
            headerImg {
              childImageSharp {
                fixed(width: 125, height: 125) {
                  ...GatsbyImageSharpFixed
                }
                fluid(maxWidth: 700) {
                  ...GatsbyImageSharpFluid_noBase64
                }
              }  
            }
          }
        }
      }
    }
  }
`;