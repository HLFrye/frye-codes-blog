
---
path: "/ipad-dev-environment"
date: "2022-08-22T07:38:11+00:00"
title: "Using my iPad as my development machine"
tags: ["Dev Tools", "iPad"]
summary: "An ultra portable dev environment on an iPad"
headerImg: "daniel-romero-Zq07dSZBTqg-unsplash.jpg"
---
![A great dev environment in a small package](daniel-romero-Zq07dSZBTqg-unsplash.jpg)
Photo by <a href="https://unsplash.com/@rmrdnl?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Daniel Romero</a> on <a href="https://unsplash.com/s/photos/ipad-keyboard?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a>
<!-- start -->
I generally prefer small, portable dev environments. The ability to pick up where I left off when I have a few minutes, or easily relocate to somewhere else, is extremely convenient. Plus, personally I find that the smaller screen on a laptop or iPad actually helps focus my work. With that in mind, I've long sought out smaller, lighter devices that I can work on. 

And that's how I wound up with my current setup, using my iPad as my preferred personal development machine, or rather, development front end. All of the actual files reside on my home server; but as long as I can connect to that, I have a pretty robust development environment I'm able to access anywhere.

To be clear, there are definitely limitations to this approach. This mainly works well for projects which either have a web front end, or run fully from the command line. That immediately rules out a lot of game development, mobile app development, and probably more that I'm not able to think of right now. However, given how much software is web based, this leaves a lot of possible projects that this environment works well for.

My setup, which I'll describe the setup for below, works as follows: First, if I'm not on my home network, I turn on my VPN connection. Once that's done, I use the WebSSH app on my iPad to connect. Usually at this point I'll start tmux, since more option than not I'll want multiple shells to switch between. After that is done, I'll decide on the project I'm interested in working on at the moment, and if I haven't worked on that one recently, use my `start-codeserver.sh` script (TODO: GitHub Gist), to start up the dev environment. This script takes care of creating a reverse proxy config file and restarting nginx, starting a docker container running `codercom/code-server:latest` and pointing toward my project directory. Then, using the wildcard DNS entry and certificate I previously set up, I'm able to access https://some-project.code.home.domain from Chrome, and get to work!

To get started with a setup like this, you'll need to get a few prerequisites set up first. You'll need nginx running on your machine, a wildcard SSL certificate covering *.code.yourdomain.com (and remember, a wildcard certificate covering *.yourdomain.com will **NOT** cover *.code.yourdomain.com), and you'll need to set up a wildcard DNS entry at your registrar or on your own DNS server.
