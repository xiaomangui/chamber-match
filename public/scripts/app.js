$(document).ready(function() {
    console.log("app.js is loaded");
    $form = $("#user_profile_form");
    //handlebars
    var source = $("#event_template").html();
    event_template = Handlebars.compile(source);
    getAllEvents();
    //load event list right away

    function getAllEvents() {

        $.ajax({
            method: "GET",
            url: '/api/events',
            success: handleGetAllEvents,
            error: getAllError
        });
    }



    //Update user profile data
    $form.on("submit", function(e) {
      e.preventDefault();
      $.get('/api/me', function getUserData(user) {
          data = $form.serializeArray();
          $.ajax({
            method: "PUT",
            data: data,
            url: "/api/users/"+user._id,
            success: updateUserSuccess,
            error: updateUserError
          });
        });
      });




    // when the edit button for an event is clicked

    $('#events').on('click', '.edit-event', function(event) {

      $.get('/api/me', function getUserData(user) {
        console.log("1", user)
        var $eventRow = $(event.target).closest('.event');
        var event_id = $eventRow.attr("data-event-id");
        var $eventForm = $("#newEventForm");
        $eventForm.data("user_id", user.id);

    //  /  $.data.val()
        console.log('/api/events/' + event_id);
        $.ajax({
            method: "GET",
            url: '/api/events/' + event_id,
            success: handleEditEvent,
            error: editEventError
        });
      });
    });

    $('#searchButton').on('click', function(e) {
        // window.open ("/views/search.html");
         window.location.href = "http//:localhost:3000/search"


    });




    $('#newEventButton').on('click', function(e) {
      $('#eventModal').modal();
    });

    //Create new event
    $('#saveEvent').on('click', function(e) {
        e.preventDefault();
        $.get('/api/me', function getUserData(user){
            var url = "/api/events/" + user._id;
            $.ajax({
                method: 'POST',
                data: $("#newEventForm").serializeArray(),
                url: url,
                success: handlePostEventSuccess,
                error: newPostEventError,
            });
            $('#eventModal').modal('hide');
        });
      });

    // End of Document Ready
});

function renderEvent(event) {

    var eventHtml = event_template(event);
    $("#events").prepend(eventHtml);
}

function handleGetAllEvents(json) {
    json.forEach(function(event) {
        renderEvent(event);
    });
}

function handleEventEditClick(e) {
  var $eventRow = $(this).closest('.event');
  var eventId = $eventRow.attr("data-event-id");
  console.log('edit event', eventId);
}


function getAllError(err) {
    console.log("get all events error");
}

function addUserSuccess(json) {
    console.log("added User", json);
}

function addUserError(err) {
    console.log("add User error");
}

function handlePostEventSuccess(json) {
    console.log("added Event", json);
}

function newPostEventError(err) {
    console.log("add Event error");
}
function  updateUserSuccess(json) {
}

function updateUserError(err) {
    console.log("update user error");
}

function  loginSuccess(json) {
  window.open ("./index.html");
}

function loginError(err) {
    alert("User/Password not found");
}

function   handleEditEvent(json) {
  $('#eventModal').modal();
  $("#edit_date").val(json.date);
  $("#edit_level").val(json.minimum_level);
}

function editEventError(err) {
    console.log("open edit event error");
}
