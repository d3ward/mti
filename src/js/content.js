(function () {
	const rgb2hex = (rgb) => {
		rgb = rgb.match(/^rgba?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?/i);
		return (rgb && rgb.length === 4) ? "#" +
			("0" + parseInt(rgb[1], 10).toString(16)).slice(-2) +
			("0" + parseInt(rgb[2], 10).toString(16)).slice(-2) +
			("0" + parseInt(rgb[3], 10).toString(16)).slice(-2) : '';
	}
	const removeDup = (arr) => {
		let unique_array = Array.from(new Set(arr));
		return unique_array;
	}
	Array.prototype.remove = function () {
		var w, a = arguments,
			L = a.length,
			ax;
		while (L && this.length) {
			w = a[--L];
			while ((ax = this.indexOf(w)) != -1) {
				this.splice(ax, 1);
			}
		}
		return this;
	}

	const getCFromW = (z) => {
		var colors = [],gvc = document.elementsFromPoint(2, 1);
		gvc.forEach(el => {
			colors.push(getComputedStyle(el).backgroundColor);
			colors.push(el.style.backgroundColor);
		});
		if (colors.length > 0) {
			colors.push(document.body.style.backgroundColor);
			colors.push(getComputedStyle(document.body).backgroundColor);
		}
		colors = colors.filter(function (e) {
			return e
		}); //Remove empty ,null,undefined values
		colors = removeDup(colors); //Remove duplicates
		if (z==true) colors.remove('rgba(0, 0, 0, 0)', 'rgba(255, 255, 255, 0)', 'rgb(0, 0, 0)', 'rgb(255, 255, 255)'); //Remove white color
		return colors[0];
	}
	var bgColor;
	const injectC = () => {
		if (document.querySelectorAll('meta[name="theme-color"]').length > 0) {
			var metaThemeColor = document.querySelector("meta[name=theme-color]");
			metaThemeColor.setAttribute("content", bgColor);
		} else {
			var link = document.createElement('meta');
			link.setAttribute('name', 'theme-color');
			link.setAttribute('content', bgColor);
			document.getElementsByTagName('head')[0].appendChild(link);
		}
	}
	let dataStorage = new InjectedDataStorage(new DataStorage());
	dataStorage.load().then(injectionData => {
		console.log("injectionData:" + injectionData);

		//Check if blacklisted
		if (injectionData.bl==true) return;
		//Get custom options
		const optc = injectionData.opt;
		const customColor = injectionData.color;
		var opt, defaultColor;
		//Get global options
		chrome.storage.local.get({
			dfc: "#0878A5",
			opt: [true, true, false]
		}, function (items) {
			defaultColor = items.dfc;
			opt = items.opt;
		});

		document.addEventListener("DOMContentLoaded", function () {
			console.log("DOM loaded:");
			
			if (optc!=undefined && optc[0] == true) {
				bgColor = customColor;
				console.log(optc);
				if (optc[1]) {
					console.log("optc 1 is true ");
					bgColor = getCFromW(optc[2]);
					if(bgColor == undefined)bgColor=customColor;
					if (bgColor.indexOf("rgb") !== -1) bgColor = rgb2hex(bgColor);
					injectC();
					console.log(bgColor);
				}
				if (optc[3]) {
					window.setInterval(function () {
						console.log(bgColor);
						let bgc = getCFromW(optc[2]);
						if(bgc!=undefined){
							if (bgc.indexOf("rgb") !== -1 ) bgc = rgb2hex(bgc);
							if(bgColor != bgc){
								bgColor=bgc;
								console.log(bgColor);
								injectC();
							}
						}
					}, 600);
				}
			} else {
				console.log(opt);
				bgColor = defaultColor;
				console.log("Default color is enabled")
				if (opt[0]) {
					console.log("opt 0 is true ");
					bgColor = getCFromW(opt[1]);
					if(bgColor == undefined)bgColor=defaultColor;
					if (bgColor.indexOf("rgb") !== -1 ) bgColor = rgb2hex(bgColor);
					injectC();
					console.log(bgColor);
				}
				if (opt[2]) {
					window.setInterval(function () {
						console.log(bgColor);
						let bgc = getCFromW(opt[1]);
						if(bgc!=undefined){
							if (bgc.indexOf("rgb") !== -1 ) bgc = rgb2hex(bgc);
							if(bgColor != bgc){
								bgColor=bgc;
								console.log(bgColor);
								injectC();
							}
						}
					}, 600);
				}
			}
			/*
									//Save Data
									dataStorage.remove(injectionData.domain);
									let newData = new InjectedData(injectionData.domain, bgColor, [true, true, true, true]);
									dataStorage.save(newData);
									console.log(" Data saved ->> " + injectionData.toString());
									if (!bgColor) bgColor = items.dfc;
									*/
		});
	})
})()