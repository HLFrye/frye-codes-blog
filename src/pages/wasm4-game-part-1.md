---
path: "/wasm4-game-part-1"
date: "2022-02-28T03:23:05Z"
title: "A Real Game for a Fake Console"
tags: ["wasm4", "rust", "python", "games"]
summary: "Building and releasing a game for the WASM-4 fantasy console in Rust"
headerImg: "lorenzo-herrera-p0j-mE6mGo4-unsplash.jpg"
---

Photo by <a href="https://unsplash.com/@lorenzoherrera?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Lorenzo Herrera</a> on <a href="https://unsplash.com/s/photos/game-boy?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a>
  
I've always had a fascination with building console games. Early on, video game consoles were some of my first introductions to the world of computers, and I've always been especially fascinated by the difficulties and limitations involved in writing a game for an older game console. Even with limited amounts of storage space, pixels, and even colors, consoles can still tell stories that bring whole worlds to life.

With this in mind, when I came across the [Wasm-4 Fantasy Console](https://wasm4.org/), I was immediately hooked. A similar concept to older consoles, but with an extremely easy to use build chain, support for several languages right out of the box, and the ability to run games on pretty much anything with a web browser? Sign me up.

If you're as interested as I am, hopefully this post will help you get started. If you want to skip ahead directly to the code, the source for the game itself is in [this GitHub repo](https://github.com/HLFrye/w4-gridgame), the source code for the Python tools I used to help out in development are in [this GitHub repo](https://github.com/HLFrye/gridgame-utils), and of course, if you just want to try out the game, check it out at **TODO**

Unlike programming for an actual console where documentation may be missing, incomplete, or otherwise painstakingly reverse engineered, working on a fantasy console like this gives one a single, consistent, well organized set of documentation describing the console. The docs for the Wasm-4 console can be found [here](https://wasm4.org/docs/). These docs do a great job covering the ins and outs of working with the fantasy console, including how to set up the tools and start a sample project. 

Of course, while this project is mostly an excuse to learn Rust and make a game for a fantasy console, there still has to be an actual game to implement! Scanning through the [games list](https://wasm4.org/play), I didn't see a 15-puzzle type game, and as I've written those a few times in the past, I figured I'd give it a go here.

Before we can get started working on the 15-puzzle game proper, however, there are a couple of things we need to do first. First we need to generate the sprites we're going to use for each tile, and then we need to determine how to make sure any random board we generate is actually solvable. For both of these tasks, I felt like Python was the best tool for the job.

Rather than automate the entire process, I wound up using a partially manual process for converting images into a set of tiles, using the [GNU Image Manipulation Program](https://www.gimp.org/). The conversion was a 5 step process:

1. Load the image, and crop it to a perfect square
2. Convert the image palette to grayscale
3. Convert the image palette to a custom one, with a maximum of 4 colors
4. Resize the image to 144x144
5. Export the image as a PNG file

The image size is important. Since we're dividing the image into 16 tiles, and 2bpp sprites must have a width divisible by 4, both dimensions of the image must be divisible by 16. Since I didn't want to use the screen all the way to the edge, the next size down was 144x144.

