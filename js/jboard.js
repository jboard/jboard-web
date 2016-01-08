$(document).ready(function() {
	
	/* initialize the external events
	-----------------------------------------------------------------*/

	function prepare_postits() {
		$('#external-events .fc-event').each(function() {

			// store data so the calendar knows to render an event upon drop
			$(this).data('event', {
				title: $.trim($(this).text()), // use the element's text as the event title
				color: $(this).css('background-color'),
				stick: false // maintain when user navigates (see docs on the renderEvent method)
			});
	
			// make the event draggable using jQuery UI
			$(this).draggable({
				zIndex: 999,
				revert: true,      // will cause the event to go back to its
				revertDuration: 0  //  original position after the drag
			});
	
		});
	}
	
	function post_events(data) {
		$.post('php/post-events.php', data)
		.done(function(data){
			console.log(data);
		})
		.fail(function() {
		    console.log( "error to write new event" );
		});
	}
	
	$('#calendar').fullCalendar({
		header: {
			left: 'prev,next today',
			center: 'title',
			right: 'month,agendaWeek,agendaDay'
		},
		defaultTimedEventDuration: '03:00:00',
		eventOrder: 'id',
		lang: 'pt-br',
		timezone: 'America/Sao_Paulo',
		editable: true,
		droppable: true, // this allows things to be dropped onto the calendar
		eventRender: function(event, element) {
            element.append( "<span class='closeon' title='Retirar post-it'> &nbsp; X &nbsp; </span>" );
            element.find(".closeon").click(function() {
            	$.post('php/post-events.php', {id:event.id, delete:1})
            	.done(function(data){
					$('#calendar').fullCalendar('removeEvents',event._id);
				})
				.fail(function() {
				    console.log( "error to delete a event" );
				});
                
            });
        },
        eventReceive: function(e) {
			e.id = $.now();
			data = {
				title	:e.title,
				start	:e.start.format(),
				color	:e.color,
				id		:e.id
			};
			post_events(data);
		},
		eventDrop: function( e, delta, revertFunc, jsEvent, ui, view ) {
			data = {
				title:		e.title,
				start:		e.start.format(),
				color:		e.color,
				id:			e.id
			};
			post_events(data);
		},
		eventResize: function( e, delta, revertFunc, jsEvent, ui, view ) {
			data = {
				title:		e.title,
				start:		e.start.format(),
				end  : 		e.end.format(),
				color:		e.color,
				id:			e.id
			};
			post_events(data);
		},
		eventLimit: true, // allow "more" link when too many events
		events: {
			url: 'php/get-events.php',
			error: function() {
				$('#script-warning').show();
			}
		},
		loading: function(bool) {
			$('#loading').toggle(bool);
		}
	});
	
	/* GET Projects */
	$.get('php/get-projects.php', function(data,status){
		$(data).each(function(k,v){
			html = '<div class="fc-event post-it" style="background-color: ' + v.color + '"> ' + v.title + ' </div>';
			$('#external-events').append(html);
		});
	})
	.done(function(){
		prepare_postits();
	})
	.fail(function() {
	    console.log( "error to read projects" );
	});
	
});