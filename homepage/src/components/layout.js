/**
 * Layout component that queries for data
 * with Gatsby's useStaticQuery component
 *
 * See: https://www.gatsbyjs.org/docs/use-static-query/
 */

import React from "react"
import PropTypes from "prop-types"
import { useStaticQuery, graphql } from "gatsby"

import Header from "./header"
import "./layout.css"
import css from "./layout.module.css"

const Layout = ({ children }) => {
  const data = useStaticQuery(graphql`
    query SiteTitleQuery {
      site {
        siteMetadata {
          title
        }
      }
    }
  `)

  return (
    <>
      <Header siteTitle={data.site.siteMetadata.title} />
      <main className={css.main}>{children}</main>
      <footer className={css.footer}>
        <ul>
          <li>Twitter</li>
          <li>Patreon</li>
          <li>Github</li>
        </ul>
        <p>
          © {new Date().getFullYear()} Justin Silvestre{" "}
          <a href="http://whoisjust.in">www.whoisjust.in</a>
        </p>
      </footer>
    </>
  )
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
}

export default Layout
