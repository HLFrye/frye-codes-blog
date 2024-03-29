const _ = require('lodash')
const path = require('path');

exports.onCreateNode = ({ node, actions }) => {
  const { createNodeField } = actions
  if (node.internal.type === 'MarkdownRemark') {
    let fixed_path = node.frontmatter.path.substring(0, node.frontmatter.path.length - 11);
    createNodeField({
      node,
      name: 'slug',
      value: path.basename(fixed_path, '.md'),
    });
  }
}

exports.createPages = ({ actions, graphql }) => {
  const { createPage } = actions;
    const blogPostTemplate = path.resolve(`src/templates/blog-post.js`);
    const tagTemplate = path.resolve(`src/templates/tags.js`);
    return graphql(`{
    allMarkdownRemark(
      sort: { order: DESC, fields: [frontmatter___date] }
      limit: 1000
    ) {
      edges {
        node {
          excerpt(pruneLength: 250)
          html
          id
          frontmatter {
            date
            path
            title
            tags
          }
        }
      }
    }
  }`)
    .then(result => {
      if (result.errors) {
        return Promise.reject(result.errors);
      }
      const posts = result.data.allMarkdownRemark.edges
      posts.forEach(({ node }) => {
          createPage({
            path: `${node.frontmatter.path}`,
            component: blogPostTemplate,
            context: {
              postPath: node.frontmatter.path
            } // additional data can be passed via context
          });
        });
  
      // Tag pages:
      let tags = [];
      
      // Iterate through each post, putting all found tags into `tags`
      _.each(posts, edge => {
        if (_.get(edge, "node.frontmatter.tags")) {
          tags = tags.concat(edge.node.frontmatter.tags);
        }
      });

      // Eliminate duplicate tags
      tags = _.uniq(tags);

      // Make tag pages
      tags.forEach(tag => {
        createPage({
          path: `/tags/${_.kebabCase(tag)}/`,
          component: tagTemplate,
          context: {
            tag,
          },
        });
      });
    });
}

