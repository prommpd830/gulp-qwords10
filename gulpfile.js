const gulp = require('gulp')
const fileinclude = require('gulp-file-include')
const server = require('browser-sync').create()
const { watch, series } = require('gulp')
const sass = require('gulp-sass') (require('sass'));
sass.compiler = require('node-sass')
const paths = {
	scripts: {
		src: './',
		dest: './build/',
	},
}

async function includeHTML() {
	return gulp
		.src([
			'*.html',
			'!header.html', // ignore
			'!footer.html', // ignore
		])
		.pipe(
			fileinclude({
				prefix: '@@',
				basepath: '@file',
			})
		)
		.pipe(gulp.dest(paths.scripts.dest))
}

// Sass compiler
async function compileSass() {
	gulp
		.src('./src/assets/sass/**/*.scss')
		.pipe(sass().on('error', sass.logError))
		.pipe(gulp.dest('src/assets/css'))
}

// Reload Server
async function reload() {
	server.reload()
}

// Copy assets after build
async function copyAssets() {
	gulp.src(['src/**/*']).pipe(gulp.dest(paths.scripts.dest))
}

async function buildAndReload() {
	await includeHTML()
	await copyAssets()
	reload()
}

exports.includeHTML = includeHTML
exports.default = async function () {
	// Init serve files from the build folder
	server.init({
		server: {
			baseDir: paths.scripts.dest,
		},
	})
	
	watch('./src/assets/sass/**/*.scss', series(compileSass))
	// Build and reload at the first time
	buildAndReload()
	// Watch task
	watch(['*.html', 'src/assets/**/*', 'partials/**'], series(buildAndReload))
}
