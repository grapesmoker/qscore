/**
 * New node file
 */

function setRunningTotals(index) {
	console.log('foo')
	var team = $(this).attr('id').split('_')[2];
	var row = $(this).attr('id').split('_')[3];
	var col = $(this).attr('id').split('_')[4];
	
	console.log(team + ' ' + row + ' ' + col)
	
	var total_score = 0;
	for (var i = 1; i <= parseInt(row); i++) {
		var row_score = 0;
		var running_score_obj = $('#running_total_' + team + '_' + row);
		
		for (var j = 1; j <= parseInt(col); j++) {
			var player_score_obj = $('#player_score_' + team + '_' + row + '_' + col);
			var bonus_score_obj = $('#bonus_score_' + team + '_' + row + '_' + col);
			
			if (!$.isEmptyObject(player_score_obj.data())) {
				row_score += player_score_obj.data()['score'];
			}
			
			if (!$.isEmptyObject(bonus_score_obj.data())) {
				row_score += player_score_obj.data()['score'];
			}
			
			console.log(row_score);
		}
		
		console.log(total_score);
		
		total_score += row_score;
		running_score_obj.data('score', total_score);
		running_score_obj.html(total_score);
	}
	
}


$(function () {
	
	$('.player-score').mouseenter(function () {
		$(this).css('cursor', 'pointer');
	});
	
	$('.player-score').mouseout(function () {
		$(this).css('cursor', 'default');
	});
	
	$('.bonus-score').mouseenter(function () {
		$(this).css('cursor', 'pointer');
	});
	
	$('.bonus-score').mouseout(function () {
		$(this).css('cursor', 'default');
	});
	
	
	$('.player-score').click(function() {
		
		var team = $(this).attr('id').split('_')[2];
		var row = 20; //$(this).attr('id').split('_')[3];
		var col = $(this).attr('id').split('_')[4];
		
		if (!$.isEmptyObject($(this).data())) {
			
			var current_score = $(this).data()['score'];
			var new_score = 0;
			
			if (current_score == 10) {
				new_score = 15;
			}
			else if (current_score == 15) {
				new_score = -5;
			}
			else if (current_score == -5) {
				new_score = 0;
			}
			else if (current_score == 0) {
				new_score = 10;
			}
			
			$(this).data('score', new_score);
			$(this).html(new_score);
		}
		else {
			$(this).data('score', 10);
			$(this).html($(this).data('score'));
		}
		
		$('.running-total').each(function(index) {			
			
			var total_score = 0;
			for (var i = 1; i <= parseInt(row); i++) {
				var row_score = 0;
				var running_score_obj = $('#running_total_' + team + '_' + i);
				var bonus_score_obj = $('#bonus_score_' + team + '_' + i);
				
				for (var j = 1; j <= parseInt(col); j++) {
					var player_score_obj = $('#player_score_' + team + '_' + i + '_' + j);	
					
					if (!$.isEmptyObject(player_score_obj.data())) {
						row_score += player_score_obj.data()['score'];
					}
				}
				
				if (!$.isEmptyObject(bonus_score_obj.data())) {
					row_score += bonus_score_obj.data()['score'];
				}
				
				//console.log(row_score);
				
				total_score += row_score;
				if (row_score > 0) {
					running_score_obj.data('score', total_score);
					running_score_obj.html(total_score);
				}
			}
		});
	});
	
	$('.bonus-score').click(function() {
		
		var team = $(this).attr('id').split('_')[2];
		var row = 20;
		var col = 10;
		
		if (!$.isEmptyObject($(this).data())) {
			
			var current_score = $(this).data()['score'];
			var new_score = 0;
			
			if (current_score == 10) {
				new_score = 20;
			}
			else if (current_score == 20) {
				new_score = 30;
			}
			else if (current_score == 30) {
				new_score = 0;
			}
			else if (current_score == 0) {
				new_score = 10;
			}
			
			$(this).data('score', new_score);
			$(this).find('p').html(new_score);
		}
		else {
			$(this).data('score', 10);
			$(this).append('<p>' + $(this).data('score') + '</p>');
		}
		
		$('.running-total').each(function(index) {
			
			var total_score = 0;
			for (var i = 1; i <= parseInt(row); i++) {
				var row_score = 0;
				var running_score_obj = $('#running_total_' + team + '_' + i);
				var bonus_score_obj = $('#bonus_score_' + team + '_' + i);
				
				for (var j = 1; j <= parseInt(col); j++) {
					var player_score_obj = $('#player_score_' + team + '_' + i + '_' + j);	
					
					if (!$.isEmptyObject(player_score_obj.data())) {
						row_score += player_score_obj.data()['score'];
					}
				}
				
				if (!$.isEmptyObject(bonus_score_obj.data())) {
					row_score += bonus_score_obj.data()['score'];
					console.log(bonus_score_obj.data()['score']);
				}
				
				total_score += row_score;
				if (row_score > 0) {
					running_score_obj.data('score', total_score);
					running_score_obj.html(total_score);
				}
			}
			
		});
	});
	
});