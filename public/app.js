function refreshPage(){
  window.parent.location = window.parent.location.href;;
} 

$.getJSON("/articles", function(data) {
  $("#articles").empty();
  for (var i = 0; i < data.length; i++) {
    $("#articles").append("<p data-id='" + data[i]._id + "'>" + data[i].title + "<br />" + data[i].link + "</p>");
    var button = $("<button class=savedModal data-toggle=modal data-target=#noteModal1>Save Article</button>");
    button.data({ article: data[i]})

    $("#articles").append(button);
  }
});

$(document).on("click", "#myBtn", function() {
  $("#articles").empty();
  $.ajax({
    method: "GET",
    url: "/scrape"
  });
});

$(document).on("click", ".savedModal", function() {
  console.log($(this).data())
  $.ajax({
    method: "POST",
    url: "/saved",
    data: $(this).data().article
  })
})

