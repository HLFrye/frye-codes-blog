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
        My current development stack mostly centers around Python and PostgreSQL.  I have experience in a wide variety of languages, including F#, C#, C++, and Typescript, to name a few.  I also enjoy learning new languages and frameworks, with a particular interest in functional languages.
      </p>
      <p>
        I'm a Director of Engineering at <a href="https://apkudo.com">Apkudo</a>. We're building tools and services for the connected device ecosystem, helping our customers answer the question "What do I do with this device, right now?"
      </p>
    </div>
  )
}