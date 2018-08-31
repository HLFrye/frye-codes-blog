import React from "react";
import Link from "gatsby-link"

export default function About() {
  return (
    <div>
      <h1>About me</h1>
      <p>
        I'm a software developer in Dallas, TX.  For over a decade, I've worked on projects spanning multiple a wide variety of environments, including Windows desktop applications, mobile applications, Point of Sale terminals, and web applications. 
      </p>   
      <p>
        My current development stack mostly centers around the .NET ecosystem, using both C# and F# for day to day work.  I have experience in a wide variety of languages, including C++, Python, and Typescript, to name a few.  I also enjoy learning new languages and frameworks, with a particular interest in functional languages.
      </p>
      <p>
        I'm a senior software developer working on the <Link to="https://ihsmarkit.com/products/wso-software.html">WSO Software Suite</Link> at <Link to="https://ihsmarkit.com">IHS Markit</Link>.  Opinions are my own.
      </p>
    </div>
  )
}