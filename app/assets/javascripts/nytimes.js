console.log('nytimes.js running');

$(function(){
  var $formDiv = $('#user-click');

  // Pulls in results from NYTimes API through NYTimes controller
  function getResults() {

    $.ajax({
      url: '/nytimes_fetch',
      dataType: 'json',
      success: function(data) {
        data.forEach(function(article){
          renderResult(article)
        })
      }
    });
  };

  // Gets user's search results and renders to the page
  function getUserChoice() {
    var $form = $('#user-search');

    $form.on('submit', function(e){
      e.preventDefault();

      $.ajax({
        url: '/user_choice',
        dataType: 'json',
        data: $(this).serialize(),
        success: function(data){
          console.log(data[0])

          var $tw_ul = $("#my-twitter-search-result").append("<h2></h2>").text(data[3])
          data[0].forEach(function(tweet){
            $("<li></li>").append($("<a href='https://twitter.com/"+ tweet.user.screen_name + "/status/" + tweet.id_str + "' target='_blank'>"+tweet['text']+"</a>")).appendTo($tw_ul)
          })
          var $gs_ul = $("#my-guidestar-results").append("<h2></h2>").text(data[3]);
          if (data[1] != null){
            data[1].forEach(function(org){
              $("<li></li>").attr('id', "organization-" + org["organization_id"]).text(org["organization_name"]).appendTo($gs_ul).append($("<div></div>").text(org["mission"]))
            })        
          }
          if (data[4] != null){
            data[4].forEach(function(org){
            $('#organization-' + org['organization_id']).append($("<div></div>").text("Income Total: " + org["income_total"])).append($("<div></div>").text("Revenue Total: " + org["revenue_total"]))
            })
          } 
        }
      })
    })
  };

  function getUserClick() {
    $formDiv.on('submit', 'form', function(e){
      e.preventDefault();
      $.ajax({
        url: '/user_click',
        dataType: 'json',
        data: {
          topic: this.elements.topic.value
        },
        success: function(data){
          console.log(data[0]);
          var $tw_ul = $("#topic-twitter-search-result").append("<h2></h2>").text(data[2])
          data[0].forEach(function(tweet){
            $("<li></li>").append($("<a href='https://twitter.com/"+ tweet.user.screen_name + "/status/" + tweet.id_str + "' target='_blank'>"+tweet['text']+"</a>")).appendTo($tw_ul)
          })
          var $gs_ul = $("#topic-guidestar-results").append("<h2></h2>").text(data[2]);
          if (data[1] != null){
            data[1].forEach(function(org){
              $("<li></li>").attr('id', "organization-" + org["organization_id"]).text(org["organization_name"]).appendTo($gs_ul).append($("<div></div>").text(org["mission"]))
            })        
          }
          if (data[3] != null){
            data[3].forEach(function(org){
            $('#organization-' + org['organization_id']).append($("<div></div>").text("Income Total: " + org["income_total"])).append($("<div></div>").text("Revenue Total: " + org["revenue_total"]))
            })
          } 
        }
      })
    })
  };

  getUserChoice();
  getUserClick();
  
   // Renders results of NYTimes API pull
  function renderResult(article){
    var $topicOfChoice;

    if (article['des_facet'] != '' && article['geo_facet'] != '') {
      if (article['des_facet'][0].split(' ').length > 1) {
        if (article['geo_facet'][0].split(' ').length > 1) {
          $topicOfChoice = article['des_facet'][0].split(' ')[0] + ' ' + article['des_facet'][0].split(' ')[1] + ' ' + article['geo_facet'][0].split(' ')[0] + ' ' + article['geo_facet'][0].split(' ')[1];
        } else {
          $topicOfChoice = article['des_facet'][0].split(' ')[0] + ' ' + article['des_facet'][0].split(' ')[1] + ' ' + article['geo_facet'][0].split(' ')[0];
        }
      } else {
        if (article['geo_facet'][0].split(' ').length > 1) {
          $topicOfChoice = article['des_facet'][0].split(' ')[0] + ' ' + article['geo_facet'][0].split(' ')[0] + ' ' + article['geo_facet'][0].split(' ')[1];
        } else {
          $topicOfChoice = article['des_facet'][0].split(' ')[0] + ' ' + article['geo_facet'][0].split(' ')[0];
        }
      }
    } else if (article['des_facet'] != '' && article['geo_facet'] == '') {
      if (article['des_facet'][0].split(' ').length > 1) {
        $topicOfChoice = article['des_facet'][0].split(' ')[0] + ' ' + article['des_facet'][0].split(' ')[1]
      } else {
        $topicOfChoice = article['des_facet'][0].split(' ')[0]
      }
    } else if (article['des_facet'] == '' && article['geo_facet'] != '') {
      if (article['geo_facet'][0].split(' ').length > 1) {
        $topicOfChoice = article['geo_facet'][0].split(' ')[0] + ' ' + article['geo_facet'][0].split(' ')[1];
      } else {
        $topicOfChoice = article['geo_facet'][0].split(' ')[0];
      }
    } else {};

    var $text;
    if (article['des_facet'] != '' && article ['geo_facet'] != '') {
      $text = article['des_facet'] + ' in ' + article ['geo_facet'];
    } else if (article['des_facet'] != '' && article ['geo_facet'] == '') {
      $text = article['des_facet'];
    } else if (article['des_facet'] == '' && article ['geo_facet'] != '') {
      $text = article['geo_facet'];
    }

    var $form = $("<form>").attr("action", "/user_click").attr("method", "post").attr('class', 'nyt-topic');
    var $dataInput = $("<input type='hidden'>").attr('value', $topicOfChoice).attr('name','topic');
    // var $submitInput = $("<input type='submit'>").attr('value', article['des_facet'] + ' in ' + article['geo_facet']).attr('class', 'nyt-topic-btn');
    var $submitInput = $("<input type='submit'>").attr('value', $text).attr('class', 'nyt-topic-btn');


    $form.append($dataInput).append($submitInput);
    $formDiv.append($form);
  };

  getResults();

});