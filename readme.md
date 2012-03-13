# tweetyourbracket.com

## Moving Parts

### Bracket Validator [DONE]
Takes a formatted bracket string, validates it, and turns it into an object of regions and winners from each game.

### Bracket Scorer
Takes the object of regions/winners and compares it to the current correct bracket to produce a score and visual display;

### Bracket Display [DONE]
Takes a validated bracket and displays the results in a visual bracket.

### Bracket Saver [DONE]
Takes the selected games from the visual bracket and creates the formatted bracket string.

### Twitter Streaming API Watcher
Watches for #tybrkt tweets, if they contain a valid bracket hashtag then save it to a DB

### Mongo DB
Saves a users bracket from Twitter and their score after each game

### Sitemap

- / [DONE]
-- Modal message talking giving details
-- Blank bracket to fill out
-- Ends with tweet button (come up with different messages based on string length)

- /results
-- Show Top 100 scores
-- Updates after every game

- /rules
-- Show scoring rules

- /terms
-- Come up with some basic language saying that it might not work well, etc

- /user/USERNAME
-- Query bracket display to display bracket, score, rank
-- Link in nav is only available if twitter oauth validated
-- Editable if before first game and validated via oauth
