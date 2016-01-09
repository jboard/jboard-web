$(document).ready(function() {

	function post_events(data) {
		$.post('php/post-events.php', data).done(function(data) {
			console.log(data);
		}).fail(function() {
			console.log("error to write new event");
		});
	}

	var postits_data = new Array();

	$('#calendar').fullCalendar({
		header : {
			left : 'prev,next today',
			center : 'title',
			right : 'month,agendaWeek,agendaDay'
		},
		defaultTimedEventDuration : '03:00:00',
		eventOrder : 'id',
		lang : 'pt-br',
		timezone : 'America/Sao_Paulo',
		editable : true,
		droppable : true,
		eventLimit : true, // allow "more" link when too many events
		/*
		 events: function () {

		 }*/
		events : {
			url : 'php/get-events.php',
			error : function() {
				$('#script-warning').show();
			}
		},
		loading : function(bool) {
			$('#loading').toggle(bool);
		},

		eventRender : function(event, element) {
			element.append("<span class='closeon' title='Retirar post-it'> &nbsp; X &nbsp; </span>");
			element.find(".closeon").click(function() {
				$.post('php/post-events.php', {
					id : event.id,
					delete : 1
				}).done(function(data) {
					$('#calendar').fullCalendar('removeEvents', event._id);
				}).fail(function() {
					console.log("error to delete a event");
				});

			});
		},

		/* Drag from external and drop in calendar */
		eventReceive : function(e) {
			e.id = $.now();
			obj = postits_data[e.title];
			obj.id = e.id;
			obj.start = e.start.format();
			post_events(obj);
		},

		/* Drag and drop into calendar */
		eventDrop : function(e, delta, revertFunc, jsEvent, ui, view) {
			obj = postits_data[e.title];
			obj.id = e.id;
			obj.start = e.start.format();
			console.log(obj);
			post_events(obj);
		},

		eventResize : function(e, delta, revertFunc, jsEvent, ui, view) {
			obj = postits_data[e.title];
			obj.id = e.id;
			obj.start = e.start.format();
			obj.end = e.end.format();
			post_events(obj);
		}
	});

	/* GET Projects - initialize the external events
	 -----------------------------------------------------------------*/
	$.get('php/get-projects.php').done(function(data, status) {
		$(data).each(function(k, v) {
			var el = $('<div class="fc-event post-it"> ' + v.title + ' </div>');
			$('#external-events').append(el);
			el.css('background-color', v.color);

			postits_data[v.title] = v;

			// store data so the calendar knows to render an event upon drop
			v.stick = false;
			v.textColor = '#383838';
			el.data('event', v);

			// make the event draggable using jQuery UI
			el.draggable({
				zIndex : 999,
				revert : true, // will cause the event to go back to its
				revertDuration : 0 //  original position after the drag
			});
		});
	}).fail(function() {
		console.log("error to read projects");
	});

}); 