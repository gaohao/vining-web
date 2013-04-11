define(function (require, exports, module) {
	var $ = require('jquery')
	,	videoModel = require('models/video.js')
	,	Backbone = require('backbone')
	,	profileTpl = require('templates/profile.tpl')
	,	_ = require('underscore');

	var VideoView =  Backbone.View.extend({

		el: '#profile',

		model: videoModel,

		template: _.template(profileTpl),

		_video: null,

		initialize: function () {
			var that = this;

			// initialize the video throught video.js  
			this._video = _V_('#display');

			// When the video's model get data from server
			// immediatly render the video 
			this.listenTo(this.model, 'video', this.render);

			// When the video has ended, 
			// trigger the video model's `videoEnd` 
			// the model will inform the socket object to 
			// get anther video from server
			this._video.addEvent('ended', function () {
				console.log('ended');
				that.model.trigger('videoEnd');
			});
		},

		render: function () {
			var videoModel = this.model
			,	_video = this._video
			,	that = this;

			// Set user's profile
			this.$el.html(this.template(videoModel.toJSON()));

			// Rendering the video means to rewrite the 
			// video's src attribute and 
			// play the video immediately
			_video.src(videoModel.get('link'));
			_video.ready(function () {
				
				// I don't want to add this dirty code,
				// But Firefox really drive me crazy,
				// set duration 100ms to check if the video's 
				// current time is 0, if does, try to play it 
				// else clear the time, cuz there is no reason to check anymore 
				var timer = setInterval(function () {
					if(_video.currentTime() == 0) {
						_video.play();
					} else {
						clearInterval(timer);
					} 
				}, 100);
			});
		}
	});

	module.exports = VideoView;
});
