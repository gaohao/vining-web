define(function (require, exports, module) {
	var Backbone = require('backbone')
	,	io = require('socket.io');

	
	var videoModel = new (Backbone.Model.extend({

		initialize: function () {
			var socket = io.connect()
			,	that = this;

			socket.on('chat', function (data) {
				/*var data = {
					text: 'What the fuck, lkajfkldsaf',
					profile_image_url: 'http://a0.twimg.com/profile_images/3501181737/f0e28bc683249573dfdc0688fc1fac66_normal.jpeg',
					from_user: 'fuck.png',
					link: 'http://video-js.zencoder.com/oceans-clip.mp4'
				};*/

				// set video's latest information 
				// that get from server by `socket`
				that.set(data);

				// Trigger `video` event, in order to 
				// inform the view to render the lastest video
				that.trigger('video');
			});

			// When the video has ended, the view will
			// trigger this event, socket will emit server's `chat` event
			// and get new video from server
			this.on('videoEnd', function () {
				console.log('socket chat for video\' end');
				socket.emit('chat', 'ended');
			});
		}

	}));

	module.exports = videoModel;
});
