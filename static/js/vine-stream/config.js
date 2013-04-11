seajs.config({

	plugins: ['noCache', 'text', 'shim'],

	alias: {

		'jquery': {
			src: 'lib/jquery-1.9.1.min.js',
			exports: 'jQuery'
		},

		'underscore': {
			src: 'lib/underscore.js',
			exports: '_'
		},

		'backbone': {
			src: 'lib/backbone.js',
			deps: ['underscore', 'jquery'],
			exports: 'Backbone'
		},

		'backbone.localStorage': {
			src: 'lib/backbone.localStorage.js',
			deps: ['backbone']
		},

		'video-js': {
			src: 'video-js/video.min.js',
			exports: '_V_'
		},

		'socket.io': {
			src: '/socket.io/socket.io.js',
			exports: 'io'
		}

	},

	paths: {

		'collections': 'vine-stream/collections',

		'models': 'vine-stream/models',

		'routers': 'vine-stream/routers',

		'templates': 'vine-stream/templates',
			
		'views': 'vine-stream/views'

	}

});
