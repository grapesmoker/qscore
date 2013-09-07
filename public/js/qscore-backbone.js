$(function() {
	
	var PlayerScoreView = Backbone.View.extend({
		el: $('#score-table'),
		
		initialize: function() {
			_.bindAll(this, 'render', 'setScore');
			
			this.score = 0;
			this.render();
		},
		
		render: function() {
			$(this.el).append('<td>score</td>');
		},
		
		setScore: function(score) {
			this.score = score;
		}
	});
	
	var playerScoreView = new PlayerScoreView();
});