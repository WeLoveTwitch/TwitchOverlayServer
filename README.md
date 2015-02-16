# TwitchOverlay

This is the frontend that displays the actual overlay.

Warning: Use node 0.10.36 because node-sass has problems with newer versions.
You can use a node version manager like `n` or `nvm` to change between node versions.

    npm install -g n
    n 0.10

## Setup

  1. `npm install -g bower gulp-cli nw`
  2. `npm install`
  3. `bower install`
  4. `gulp`

## Run

  1. Navigate to the project directory
  2. `npm start`

In the future we will provide precompiled executables for each platform.

## Gulp tasks

  - Run `gulp` to create a index.html with all js and css files included
  - Run `gulp watch` to watch for changes in sass files
  - Run `gulp sass` to compile sass files to css

## Contributing
  - Never commit files created by a gulp task (index.html, css files)

## License

The MIT License (MIT)

Copyright (c) 2015 WeLoveTwitch

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.