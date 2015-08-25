// ==UserScript==
// @name        Liquipedia Spoiler Hider
// @namespace   www.lux01.co.uk
// @description Hides tournament spoilers on the Liquipedia
// @include     http://wiki.teamliquid.net/*
// @version     1.0.1a
// @grant       none
// @copyright   2015, William Woodhead (www.lux01.co.uk)
// @license     MIT License
// @homepageURL https://github.com/lux01/liquipedia_spoilers
// ==/UserScript==

var matchWonFile = 'GreenCheck.png';

function hide_spoilers() {
  // Disable the bold winner names
  $('.bracket-team-top, .bracket-team-bottom, .bracket-player-top, .bracket-player-bottom').parent().each(function() {
    $(this).css('font-weight','normal').off();
  });
  
  // Disable the mouse over highlight events
  $('.bracket-team-top, .bracket-team-bottom, .bracket-player-top, .bracket-player-bottom').off();
  
  // Hide the match results in the popup
  $('.bracket-game-details .matches').hide();
  
  $('.bracket-team-top, .bracket-team-bottom').each(function() {
    $('.team-template-image', this).hide();
    $('.team-template-text', this).hide();
    $('.bracket-score', this).hide();
  });
  
  // SC2 doesn't use teams, it uses players
  $('.bracket-player-top, .bracket-player-bottom').each(function() {
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
    $(this).find('.icons .plainlinks:gt(0)').hide();
    var showSpoilersButton = $(document.createElement('button')).text('Show spoilers');
    
    showNext.click(function(evt) {
      var shown = $(evt.target).data('shown');
      $(evt.target).siblings('.plainlinks:lt(' + ($(evt.target).data('shown') + 1) + ')').show();
      $(evt.target).data('shown', shown + 1);
      
      var numLinks = $(evt.target).siblings('.plainlinks').length;
      if(shown + 1 > numLinks || shown + 1 == bestOf)
        $(evt.target).remove();
    });
    
    showSpoilersButton.click(function(evt) {
      $(evt.target).closest('.bracket-game-details').find('.matches').show();
      $(evt.target).closest('.bracket-game-details').find('.plainlinks').show();
      
      var game = $(evt.target).parent().parent().parent();
      console.log(game);
      $('.team-template-image, .team-template-text, .bracket-score', game).show();
      
      $(showNext).remove();
      $(showSpoilersButton).remove();
      
    });
    
    $(this).find('.icons').append(showNext).append(showSpoilersButton);
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
}

window.addEventListener('load', function() {
  console.log("Liquipedia spoiler hider: loading...");
  hide_spoilers();
  console.log("Liquipedia spoiler hider: loaded!");
}, false);
