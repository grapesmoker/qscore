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
		
		if (!$.isEmptyObject($(this).data()) && typeof $(this).data('score') != 'undefined') {
			
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
					
					if (!$.isEmptyObject(player_score_obj.data()) && typeof player_score_obj.data('score') != 'undefined') {
						row_score += player_score_obj.data()['score'];
					}
				}
				
				if (!$.isEmptyObject(bonus_score_obj.data()) && typeof bonus_score_obj.data('score') != 'undefined') {
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
		
		if (!$.isEmptyObject($(this).data()) && typeof $(this).data('score') != 'undefined') {
			
			var current_score = $(this).data('score') || $(this).attr('data-score');
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
			
			console.log(current_score);
			console.log(new_score);
			
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
					
					if (!$.isEmptyObject(player_score_obj.data()) && typeof player_score_obj.data('score') != 'undefined') {
						row_score += player_score_obj.data()['score'];
					}
				}
				
				if (!$.isEmptyObject(bonus_score_obj.data()) && typeof bonus_score_obj.data('score') != 'undefined') {
					row_score += bonus_score_obj.data('score');
					//console.log(bonus_score_obj.data()['score']);
				}
				
				total_score += row_score;

				if (row_score > 0) {
					running_score_obj.data('score', total_score);
					running_score_obj.html(total_score);
				}
			}
			
		});
	});
	
	$('#savegame').click(function() {
		var player_scores = [];
		var team_scores = [];
		var game_id = $(this).data('gameId');
		
		console.log(game_id);
		
		$('.user-name').each(function(user_index) {
			var score_entry = {};
			var id = $(this).data('userId');
			$('.player-id-' + id).each(function(question_index) {
				var question_num = $(this).data('questionNum');
				var score = $(this).data('score');
				score_entry = {playerId: id,
							   score: score,
							   questionNum: question_num,
							   gameId: game_id};
				player_scores.push(score_entry);
			});
		});
		
		$('.team-name').each(function(team_index) {
			var score_entry = {};
			var id = $(this).data('teamId');
			
			$('.team-id-' + id).each(function(question_index) {
				var question_num = $(this).data('questionNum');
				var score = $(this).data('score');
				
				score_entry = {teamId: id,
							   score: score,
							   questionNum: question_num,
							   gameId: game_id};
				team_scores.push(score_entry);
			});
		});
		
		console.log(game_id);
		console.log(player_scores);
		
		$.post('/savegame', {teamScores: team_scores, playerScores: player_scores, gameId: game_id}, function(data) {
			console.log(data);
		});
	});
	
	
	/* functions for handling the addition and removal of players on a roster */
	
	$('#add-player-to-roster').click(function () {
		
		console.log('clicked');
		var num_players = $('.player-block').size();
		var new_player_num = { player: num_players };
		
		var new_player_block = sprintf('<p id="player-block-%(player)d" class="player-block"> \
										<input type="text" id="first-name-%(player)d" name="first-name-%(player)d" placeholder="First name"> \
										<input type="text" id="last-name-%(player)d" name="last-name-%(player)d" placeholder="Last name"> \
										<i class="icon-minus-sign" id="delete-player-%(player)d"></i> \
									</p>', new_player_num);
		
		console.log(new_player_block);
		
		$(sprintf('#player-block-%(player)d', { player: num_players - 1})).after(new_player_block);
		
		$('#num-players').val(num_players + 1);
	});
	
	$('#team-roster-form').on('submit', function(event) {
		console.log(event);
		event.preventDefault();
		console.log($('#team-roster-form').serialize());
		$.post("/saveteam",
			$('#team-roster-form').serialize(),
			function(result) {
				console.log('form saved');
			},
			'json'
		);
	});
	
	$('.delete-player').click(function() {
		console.log("foo");
		var player_num = $(this).attr('data-player-num');
		var player_id = $('#player-id-' + player_num).val();
		var team_id = $('#team-id').val();
		console.log(team_id);
		$.post("/deleteplayer",
			{'player-id': player_id, 'team-id': team_id},
			function(result) {
				console.log('player deleted');
			},
			'json');
		
		$('#player-block-' + player_num).remove();
		
		var num_players = $('.player-block').size();
		$('#num-players').val(num_players);
	});

});

