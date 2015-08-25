# Liquipedia Spoilers Hider
A simple userscript that attempts to hide spoilers about tournament results on [Liquipedia][liquipedia]. Requires the [Greasemonkey][greasemonkey] extension for [Mozilla Firefox](http://www.mozilla.org) to use. If you notice any bugs, or have any feature requests: create an issue!


## Installation Instructions

1. Download the [Greasemonkey][greasemonkey] addon for [Mozilla Firefox](http://www.mozilla.org)
2. Go to the [``Liquipedia_Spoilers_Hider.user.js``][file] file in this repository.
3. Peruse the source code so you're sure that you're not downloading malicious code.
4. Press the ``Raw`` button at the top of the file.
5. Click ``Install` when the prompt appears.

## Usage Instructions

The script should automatically load anytime you visit a [Liquipedia][liquipedia] page. It only runs once the page is fully loaded so if you're super worried about being spoiled then don't look at the page until the spinner in the address bar has gone.

* Playoff games have their team icon, team names, and scores hidden throughout. The hoverover effect that highlights a team's progression is also disabled.
* Click on a game block to show the details panel. This will show the team names, the play date, and the first VOD link.
* Press the "Show next VOD" button to reveal the link to the next VOD. If there are no more VODs left clicking it will remove the button.
* Pressing the "Show spoilers" button will reveal all the hidden information from that match.

## Known Issues/Wishlist

* Only hides spoiler information on playoff style results.
* If there are no VODs or live report thread for that game then the show spoilers button is not shown.
* Hearthstone wiki is currently disabled due to bugs.

[greasemonkey]: https://addons.mozilla.org/en-US/firefox/addon/greasemonkey/
[liquipedia]: http://wiki.teamliquid.net
[file]: https://github.com/lux01/liquipedia_spoilers/blob/master/Liquipedia_Spoilers_Hider.user.js
