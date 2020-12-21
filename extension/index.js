'use strict';

const fs = require('fs');
const getJSON = require('get-json');
const request = require('request');
const download = require('image-downloader')

let responsecode = null;

module.exports = function (nodecg) {
	nodecg.log.info('Most Wanted Layout loaded.');

	const player1src = nodecg.Replicant('player1src');
	const player2src = nodecg.Replicant('player2src');

	const player1pb = nodecg.Replicant('player1pb');
	const player2pb = nodecg.Replicant('player2pb');

	const player1avatar = nodecg.Replicant('player1avatar');
	const player2avatar = nodecg.Replicant('player2avatar');

	let pb1_string = null;
	let pb2_string = null;

	player1src.on('change', (newValue) => {
		getJSON(`https://www.speedrun.com/api/v1/users?lookup=${newValue}`, function(error, response) {
			if (error) {
				return nodecg.log.info(error);
			}
			if (!fs.existsSync(`./bundles/mwtourney/graphics/img/avatars/${newValue}.png`)) {
				download.image(`https://www.speedrun.com/themes/user/${newValue}/image.png`, `./bundles/mwtourney/graphics/img/avatars/${newValue}.png`) 
				.then(({ filename }) => {
					player1avatar.value = `img/avatars/${newValue}.png`;
				})
				.catch((err) => player1avatar.value = `img/avatars/noavatar.jpg`)
			}
			else if (fs.existsSync(`./bundles/mwtourney/graphics/img/avatars/${newValue}.png`)) {
				player1avatar.value = `img/avatars/${newValue}.png`;
			}
			
 			let stringified = (JSON.stringify(response));
			let parsed = (JSON.parse(stringified));
			//nodecg.log.info(parsed.data[0].id);
			getJSON(`https://www.speedrun.com/api/v1/users/` + parsed.data[0].id + `/personal-bests`, function(error, response) {
				if (error) {
					return nodecg.log.info(error);
				};
				stringified = (JSON.stringify(response));
				parsed = (JSON.parse(stringified));
				let x = null;
				let nopb = true;
				for (let i = 0; i < parsed.data.length; i++) {
					x += parsed.data[i];
					if (parsed.data[i].run.category === 'jdz8m6dv'){
						var time = format(parsed.data[i].run.times.realtime_t);
						nopb = false;
						if (parsed.data[i].place === 1) {
							pb1_string = `PB: ` + time + ` (` + parsed.data[i].place + `st)`;
						}
						else if (parsed.data[i].place === 2) {
							pb1_string = `PB: ` + time + ` (` + parsed.data[i].place + `nd)`;
						}
						else if (parsed.data[i].place === 3) {
							pb1_string = `PB: ` + time + ` (` + parsed.data[i].place + `rd)`;
						}
						else {
							pb1_string = `PB: ` + time + ` (` + parsed.data[i].place + `th)`;
						};
						player1pb.value = pb1_string;
					}
					else if (nopb) {
						player1pb.value = "PB: N/A"
					};
				};
			});
		});
	});

	player2src.on('change', (newValue) => {
		getJSON(`https://www.speedrun.com/api/v1/users?lookup=${newValue}`, function(error, response) {
			if (error) {
				return nodecg.log.info(error);
			}
 			let stringified = (JSON.stringify(response));
			let parsed = (JSON.parse(stringified));
			if (!fs.existsSync(`./bundles/mwtourney/graphics/img/avatars/${newValue}.png`)) {
				download.image(`https://www.speedrun.com/themes/user/${newValue}/image.png`, `./bundles/mwtourney/graphics/img/avatars/${newValue}.png`) 
				.then(({ filename }) => {
					//nodecg.log.info('downloaded avatar');
					player2avatar.value = `img/avatars/${newValue}.png`;
				})
				.catch((err) => player2avatar.value = `img/avatars/noavatar.jpg`)
			}
			else if (fs.existsSync(`./bundles/mwtourney/graphics/img/avatars/${newValue}.png`)) {
				player2avatar.value = `img/avatars/${newValue}.png`;
			}
			//nodecg.log.info(parsed.data[0].id);
			getJSON(`https://www.speedrun.com/api/v1/users/` + parsed.data[0].id + `/personal-bests`, function(error, response) {
				if (error) {
					return nodecg.log.info(error);
				};
				stringified = (JSON.stringify(response));
				parsed = (JSON.parse(stringified));
				let x = null;
				let nopb = true;
				for (let i = 0; i < parsed.data.length; i++) {
					x += parsed.data[i];
					if (parsed.data[i].run.category === 'jdz8m6dv'){
						var time = format(parsed.data[i].run.times.realtime_t);
						nopb = false;
						if (parsed.data[i].place === 1) {
							pb2_string = `PB: ` + time + ` (` + parsed.data[i].place + `st)`;
						}
						else if (parsed.data[i].place === 2) {
							pb2_string = `PB: ` + time + ` (` + parsed.data[i].place + `nd)`;
						}
						else if (parsed.data[i].place === 3) {
							pb2_string = `PB: ` + time + ` (` + parsed.data[i].place + `rd)`;
						}
						else {
							pb2_string = `PB: ` + time + ` (` + parsed.data[i].place + `th)`;
						};
						player2pb.value = pb2_string;
					}
					else if (nopb) {
						player2pb.value = "PB: N/A"
					};
				};
			});
		});
	});

	// yoinked from stackoverflow
	function format(time) {   
		// Hours, minutes and seconds
		var hrs = ~~(time / 3600);
		var mins = ~~((time % 3600) / 60);
		var secs = ~~time % 60;
	
		// Output like "1:01" or "4:03:59" or "123:03:59"
		var ret = "";
		if (hrs > 0) {
			ret += "" + hrs + ":" + (mins < 10 ? "0" : "");
		}
		ret += "" + mins + ":" + (secs < 10 ? "0" : "");
		ret += "" + secs;
		return ret;
	}

};
