## About the data

I was able to find [some JSON](https://gist.github.com/tdreyno/4278655) containing all the world's airports. I chose to go this route, rather than implement one of a few APIs I found, all of which seemed to offer Airport metadata.  Given the requirements and purpose of this project, it didn't make sense to me to spend time integrating with an API.

The above mentioned data is living here, in `airports.js`.  In order to extract only US airports from this data, I wrote a small node script.  This script iterates over the data, creates a new array of US airports, and writes them to a file.  Given the slim requirements of this project, I am also stripping unwanted metadata from the object, to keep the resulting data as small as possible.

Simply run `node clean-data` in this directory, and you'll find a file called `us-airports.js` is created.  This is the data I used in the applications.  You'll find that data exposed within the file `src/js/airport-data.js`.
