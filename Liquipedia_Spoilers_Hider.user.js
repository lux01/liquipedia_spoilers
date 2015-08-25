// ==UserScript==
// @name        Liquipedia Spoiler Hider
// @namespace   www.lux01.co.uk
// @description Hides tournament spoilers on the Liquipedia
// @include     http://wiki.teamliquid.net/*
// @exclude     http://wiki.teamliquid.net/hearthstone/*
// @version     1.0.1a
// @grant       none
// @copyright   2015, William Woodhead (www.lux01.co.uk)
// @license     MIT License
// @homepageURL https://github.com/lux01/liquipedia_spoilers
// ==/UserScript==

var matchWonFile = 'GreenCheck.png';

function hide_spoilers() {
  // Disable the bold winner names
  $('.bracket-team-top, .bracket-team-middle, .bracket-team-bottom, .bracket-player-top, .bracket-player-bottom').parent().each(function() {
    $(this).css('font-weight','normal').off();
  });
  
  // Disable the mouse over highlight events
  $('.bracket-team-top, .bracket-team-middle, .bracket-team-bottom, .bracket-player-top, .bracket-player-bottom').off();
  
  // Hide the match results in the popup
  $('.bracket-game-details .matches').hide();
  
  // Not all the wikis use .matches so we have got to improvise
  $('.bracket-game-details').children('div:not(:first-child):not(:last-child)').hide();
  
  // Hide spoiler team names, icons and scores on the playoff tables
  $('.bracket-team-top, .bracket-team-middle, .bracket-team-bottom').each(function() {
    $('.team-template-image', this).hide();
    $('.team-template-text', this).hide();
    $('.bracket-score', this).hide();
  });
  
  // SC2 doesn't use teams, it uses players
  $('.bracket-player-top, .bracket-team-middle, .bracket-player-bottom').each(function() {
    $(this).data('old-color', $(this).css('background-color'));
    $(this).css('background-color','rgb(242,232,184)');
    $('span, img, .bracket-score', this).hide();
  });
  
  // Calculate how many "watch" icons are shown and generate dummy ones
  $('.bracket-game-details').each(function() {
    // Since we can't rely on there being the right number of vods not to spoil things
    // or the vod might not be split into game parts, we will just individually reveal vod
    // links on demand.
    
    // First we work out how many games there might be
    var lefties = $(this).find('.matches .left .check').filter(function(index) {
      return $('img', this).attr('src').endsWith(matchWonFile);
    }).length;
    var righties = $(this).find('.matches .right .check').filter(function(index) {
      return $('img', this).attr('src').endsWith(matchWonFile);
    }).length;
    
    var bestOf = 2 * Math.max(lefties, righties) - 1;
    
    var showNext = $(document.createElement('button')).text('Show next VOD').data('shown', 1);
    $(this).find('.icons .plainlinks:gt(0), .bracket-icons .plainlinks:gt(0)').hide();
    $(this).find('.bracket-icons > :not(a, .plainlinks), .bracket-icons > a[href^="http://www.hltv.org/"], .bracket-icons > a[href^="https://www.hltv.org/""]').hide();
    var showSpoilersButton = $(document.createElement('button')).text('Show spoilers');
    
    showNext.click(function(evt) {
      var shown = $(evt.target).data('shown');
      var parent = $(evt.target).closest('.bracket-game-details');
      
      $('span.plainlinks:lt(' + ($(evt.target).data('shown') + 1) + ')', parent).show();
      $(evt.target).data('shown', shown + 1);
      var numLinks = $('span.plainlinks', parent).length;

      if(shown + 1 > numLinks || (bestOf > 0 && shown + 1 == bestOf))
        $(evt.target).remove();
    });
    
    showSpoilersButton.click(function(evt) {
      var bgds = $(evt.target).closest('.bracket-game-details');
      $('.matches', bgds).show();
      $('.plainlinks', bgds).show();
      $('.icons .plainlinks:gt(0), .bracket-icons .plainlinks:gt(0)', bgds).show();
      $('.bracket-icons > :not(.plainlinks)', bgds).show();

      var game = $(evt.target).parent().parent().parent();
      $('.team-template-image, .team-template-text, .bracket-score', game).show();
      $('.bracket-player-top, .bracket-player-bottom', game).show()
      $('img, span, .bracket-score', game).show();
      $('.bracket-player-top, .bracket-player-bottom', game).each(function () {
        $(this).css('background-color', $(this).data('old-color'));
      });
      $('.bracket-game-details', game).children('div').show();
      $(showNext).remove();
      $(showSpoilersButton).remove();
    });
    
    var showSpoilersDiv = $(document.createElement('div'));
    showSpoilersDiv.append(showNext);
    showSpoilersDiv.append(showSpoilersButton);
    showSpoilersDiv.insertAfter($('div:last', this));
  });

  // Remove the click behaviour from the info button and make the entire
  // panel do its job instead
  $('.bracket-game .icon').off();
  $('.bracket-game').each(function() {
    var parent = this;
    $(this).click(function (evt) {
      // Hide all the rest
      $('.bracket-game-details').hide();
      // Find ours
      var ourDetails = $('.bracket-game-details', parent);
      if(ourDetails.data('visible')) {
        ourDetails.hide();
        ourDetails.data('visible', false);
      } else {
        ourDetails.show();
        ourDetails.data('visible', true);
      }
    });
  });
  
  // Tournament info box spoilers
  $('.infobox-center span[title="First Place"]').parent().hide();
  $('.infobox-center span[title="Second Place"]').parent().hide();
  $('.infobox-center span[title="Third Place"]').parent().hide();
  $('.infobox-center span[title="Fourth Place"]').parent().hide();
  $('.infobox-center span[title="Semifinalist(s)"]').parent().hide();
  
  // Create the show spoilers button for the infobox
  var showSpoilersInfoBoxContainer = $(document.createElement('div')).css('text-align', 'center');
  var showSpoilersInfoBoxDiv = $(document.createElement('div')).attr('class', 'infobox-center');
  var showSpoilersInfoBoxButton = $(document.createElement('button')).text('Show spoilers');
  showSpoilersInfoBoxButton.click(function () {
    $('.infobox-center span[title="First Place"]').parent().show();
    $('.infobox-center span[title="Second Place"]').parent().show();
    $('.infobox-center span[title="Third Place"]').parent().show();
    $('.infobox-center span[title="Fourth Place"]').parent().show();
    $('.infobox-center span[title="Semifinalist(s)"]').parent().show();
    showSpoilersInfoBoxContainer.remove();
  });
  showSpoilersInfoBoxDiv.append(showSpoilersInfoBoxButton);
  showSpoilersInfoBoxContainer.append(showSpoilersInfoBoxDiv);
  $('.infobox-center span[title="First Place"]').parent().parent().append(showSpoilersInfoBoxContainer);
  
  // Hide the prizepool table
  $('table.prizepooltable').hide();
  var showSpoilersPrizePool = $(document.createElement('button')).text('Show prize pool');
  showSpoilersPrizePool.click(function() {
    $('table.prizepooltable').show();
    showSpoilersPrizePool.remove();
  });
  showSpoilersPrizePool.insertAfter($('table.prizepooltable'));
}

window.addEventListener('load', function() {
  console.log("Liquipedia spoiler hider: loading...");
  hide_spoilers();
  console.log("Liquipedia spoiler hider: loaded!");
}, false);
