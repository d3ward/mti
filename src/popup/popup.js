function alert(options) {
	var t = this;
	if (!options) options = [];
	t.count = 0;
	t.timeout = (options.timeout) ? options.timeout : 3000;
	t.autoClose = (options.autoClose) ? options.autoClose : true;
	const close = '<svg class="_icon" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>';
	t.container = document.querySelector("#nt1");
	t.close = ($el) => {
		$el.classList.add("animate-out");
		setTimeout(() => {
			$el.remove();
			t.count--;
		}, 300);
	}
	t.setCloseOnClick = ($el) => {
		$el.addEventListener("click", function () {
			t.close($el);
		});
	}
	t.setAutocloseTimeout = ($el, timeout) => {
		setTimeout(() => {
			t.close($el);
		}, timeout);
	}
	t.createItem = (message, type) => {
		var $item = document.createElement("div");
		$item.classList.add("alert-item");
		$item.classList.add(type);
		$item.innerHTML = "<span>" + message + "</span>" + close;
		t.count++;
		return $item;
	}

	t.error = (txt) => {
		t.showA(t.createItem(txt, "error"));
	}
	t.warn = (txt) => {
		t.showA(t.createItem(txt, "warn"));
	}
	t.info = (txt) => {
		var l = t.createItem(txt, "info");
		t.showA(l);
	}
	t.success = (txt) => {
		var l = t.createItem(txt, "success");
		t.showA(l);
	}
	t.show = (txt) => {
		var l = t.createItem(txt, "");
		t.showA(l);
	}
	t.showA = (l) => {
		if (t.autoClose == true)
			t.setAutocloseTimeout(l, t.timeout);
		t.setCloseOnClick(l);
		t.container.append(l);
	}

}

function modal(id) {
	var t = this;
	t.m = document.querySelector((id) ? id : '.modal');
	if (t.m) {
		t.bdy = document.body.classList;
		t.targets = document.querySelectorAll('[data-toggle="' + t.m.id + '"]');
		t.closebtns = t.m.querySelectorAll('.close-modal');
	}
	t.show = function () {
		t.bdy.add('_overflowhidden');
		t.m.classList.add('_show-modal');
	}
	t.hide = function () {
		t.m.classList.remove('_show-modal');
		t.bdy.remove('_overflowhidden');
	}
	t.listeners = function () {
		t.targets.forEach(el => {
			el.addEventListener('click', function (e) {
				t.show();
			});
		});
		t.closebtns.forEach(function (item) {
			item.addEventListener('click', function (e) {
				t.hide();
			});
		});
	}
	if (t.m)
		t.listeners();
}

function themeManager() {
	const t = this;
	t.toggles = document.getElementsByClassName("theme-toggle");
	t.activeTheme = "light";
	t.setTheme = (theme) => {
		t.activeTheme = theme;
		document.documentElement.setAttribute('data-theme', theme)
		localStorage.setItem('theme', theme);
	}
	t.dark = () => {
		t.setTheme("dark");
	}
	t.light = () => {
		t.setTheme("light");
	}
	if (window.CSS && CSS.supports("color", "var(--bg)") && t.toggles) {
		var storedTheme = localStorage.getItem('theme') || (window.matchMedia("(prefers-color-scheme: dark)").matches ?
			"dark" : "light");
		if (storedTheme)
			document.documentElement.setAttribute('data-theme', storedTheme)
		for (var i = 0; i < t.toggles.length; i++) {
			t.toggles[i].onclick = function () {
				if (document.documentElement.getAttribute("data-theme") === "light") t.dark();
				else t.light();
			};
		}
	}
}

function gotop() {
	var t = this;
	t.gt = document.getElementById('gt-link');
	t.scrollToTop = function () {
		window.scroll({
			top: 0,
			left: 0,
			behavior: 'smooth'
		});
	}
	t.listeners = function () {
		window.addEventListener("scroll", () => {
			let y = window.scrollY;
			if (y > 0) {
				t.gt.classList.remove("hidden");
			} else {
				t.gt.classList.add("hidden");
			}
		});
		t.gt.onclick = function (e) {
			e.preventDefault();
			if (document.documentElement.scrollTop || document.body.scrollTop > 0) {
				t.scrollToTop();
			}
		}
	}
	if (t.gt) {
		t.listeners();
	}
}

let dmn_inp = document.getElementById("dmn");
let chk_st = document.getElementById("st_bl");
let opt0c = document.getElementById("opt0c");
let opt1c = document.getElementById("opt1c");
let opt2c = document.getElementById("opt2c");
let opt0 = document.getElementById("opt0");
let opt1 = document.getElementById("opt1");
let opt2 = document.getElementById("opt2");
let metaThemeColor = document.querySelector("meta[name=theme-color]");
let dataStorage = new InjectedDataStorage(new DataStorage());
let currentInjectionData;
let hue = 0,
	sat = 0,
	light = 0;
var defaultColor, hexValue, customChanged = false,
	currentisdefault = false;
const hueInput = document.getElementById("hue");
const satInput = document.getElementById("sat");
const lightInput = document.getElementById("light");
const swatch = document.querySelector('.swatch');
const hexInput = document.getElementById("hex_in");
const hexInput_g = document.getElementById("hex_global");
const hexInput_c = document.getElementById("hex_custom");
const hex_gcl = document.getElementById("hex_global_cl");
const hex_ccl = document.getElementById("hex_custom_cl");
let lrtStatus = 0;
const hslToHex = (h, s, l) => {
	h /= 360, s /= 100, l /= 100;
	let r, g, b;
	if (s === 0) {
		r = g = b = l; // achromatic
	} else {
		const hue2rgb = (p, q, t) => {
			if (t < 0) t += 1;
			if (t > 1) t -= 1;
			if (t < 1 / 6) return p + (q - p) * 6 * t;
			if (t < 1 / 2) return q;
			if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
			return p;
		};
		const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
		const p = 2 * l - q;
		r = hue2rgb(p, q, h + 1 / 3);
		g = hue2rgb(p, q, h);
		b = hue2rgb(p, q, h - 1 / 3);
	}
	const toHex = x => {
		const hex = Math.round(x * 255).toString(16);
		return hex.length === 1 ? '0' + hex : hex;
	};
	return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}
const hexToHsl = (hex) => {
	hexInput.value = hex;
	var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
	var r = parseInt(result[1], 16);
	var g = parseInt(result[2], 16);
	var b = parseInt(result[3], 16);
	r /= 255, g /= 255, b /= 255;
	var max = Math.max(r, g, b),
		min = Math.min(r, g, b);
	var h, s, l = (max + min) / 2;
	if (max == min) {
		h = s = 0;
	} else {
		var d = max - min;
		s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
		switch (max) {
			case r:
				h = (g - b) / d + (g < b ? 6 : 0);
				break;
			case g:
				h = (b - r) / d + 2;
				break;
			case b:
				h = (r - g) / d + 4;
				break;
		}
		h /= 6;
	}
	s = s * 100;
	sat = Math.round(s);
	l = l * 100;
	light = Math.round(l);
	hue = Math.round(360 * h);
}
const hslToColor = () => {
	swatch.style.backgroundColor = getHSL();
	hexValue = getHEX();
	swatch.value = hexInput.value = satInput.style.backgroundColor = hexValue;
	metaThemeColor.setAttribute("content", hexValue);
}
const hexToColor = () => {
	hueInput.value = hue;
	satInput.value = sat;
	lightInput.value = light;
	swatch.style.backgroundColor = getHSL();
	satInput.style.backgroundColor = getHEX();
}
const getHEX = () => {
	return hslToHex(hue, sat, light);
};
const getHSL = () => {
	return `hsl(${hue}, ${sat}%, ${light}%)`;
};
const evList = () => {

	hueInput.addEventListener('input', () => {
		hue = hueInput.value;
		hslToColor();
	});
	satInput.addEventListener('input', () => {
		sat = satInput.value;
		hslToColor();
	});
	lightInput.addEventListener('input', () => {
		light = lightInput.value;
		hslToColor();
	});
	hexInput.addEventListener('input', () => {
		hexV = hexInput.value;
		if (hexV.length == 7) {
			hexToHsl(hexV);
			hexToColor();
		}
	});
	hslToColor();
	document.querySelector("#save_btn").addEventListener("click", () => {
		saveEditorContent();
	})
	document.querySelector("#exp_btn").addEventListener("click", () => {
		exportData()
	});
	document.querySelector("#res2_btn").addEventListener("click", () => {
		show_lrt(1);
	});
	document.querySelector("#imp_btn").addEventListener("click", () => {
		document.querySelector("#imp_f").click()
	});
	document.querySelector("#imp_f").addEventListener("change", () => {
		importData()
	}, false);
	chk_st.addEventListener("change",()=>{
		customChanged = true;
	});
	optc.addEventListener("change", () => {
		customChanged = true;
		let ch = optc.checked;
		opt1c.disabled = (ch) ? false : true;
		opt2c.disabled = (ch) ? false : true;
		hex_ccl.style.pointerEvents = (ch) ? "unset" : "none";
		opt0c.disabled = (ch) ? false : true;
	});
	opt0c.addEventListener("change", () => {
		customChanged = true;
		let ch = opt0c.checked;
		opt1c.checked = opt2c.checked = ch;
		opt1c.disabled = (ch) ? false : true;
		opt2c.disabled = (ch) ? false : true;
	});
	opt0.addEventListener("change", () => {
		let ch = opt0.checked;
		opt1.checked = opt2.checked = ch;
		opt1.disabled = (ch) ? false : true;
		opt2.disabled = (ch) ? false : true;
	});
	document.getElementById("can_lrt").onclick = () => {
		document.getElementById("mylrt").style.display = "none";
	}
	// When the user clicks on the button, open the lrt
	document.getElementById("ok_lrt").onclick = () => {

		
				chrome.storage.local.clear();
				location.reload();
				dialog.hide();
	}
	document.getElementById("clrp_apply").onclick = () => {
		if (currentisdefault)
			setInputColor(hexValue);
		else
			setInputColor(hexValue, true);
		clrp.hide();
	}
	document.getElementById("clrp_cancel").onclick = () => {
		if (currentisdefault)
			metaThemeColor.setAttribute("content", hexInput_g.value);
		else
			metaThemeColor.setAttribute("content", hexInput_c.value);
		clrp.hide();
	}
	document.getElementById("hex_global_cl").onclick = () => {
		currentisdefault = true;
		clrp.show();
		hexToHsl(hexInput_g.value);
		hexToColor();
	}
	document.getElementById("hex_custom_cl").onclick = () => {
		customChanged = true;
		currentisdefault = false;
		clrp.show();
		hexToHsl(hexInput_c.value);
		hexToColor();
	}
}
let messages = ["Reset color to default one on current website<br> You can edit below and change default color ,then click ok to confirm change<input class='_mt1' id='def_inp' type='text' maxlength='7'/>",
	"Are you sure you want to reset ? ( you will lose all extension data like colors per hosts)",
]
const show_lrt = (l) => {
	document.querySelector("#dialog>div>div").innerHTML = messages[l];
	if (l == 0) document.getElementById("def_inp").value = defaultColor;
	dialog.show();
}

const exportData = () => {
	chrome.storage.local.get(null, function (items) {
		var result = JSON.stringify(items);
		var url = 'data:application/json;base64,' + btoa(result);
		var date = new Date();
		var le = document.createElement('a');
		le.setAttribute('href', url);
		le.setAttribute('download', 'mti_' + (date.getUTCMonth() + 1) + '' + date.getUTCDate() + '_' +
			date.getHours() + '-' + date.getMinutes() + '.json');
		le.click();
	});
}
const importData = () => {
	chrome.storage.local.clear();
	var file = document.querySelector("#imp_f").files[0];
	var reader = new FileReader();
	reader.onload = function (progressEvent) {
		var test = this.result;
		var test2 = JSON.parse(test);
		chrome.storage.local.set(test2, function () {
			alert("MTI data imported .")
		});
	}
	reader.readAsText(file);
	location.reload();
}
const setInputColor = (c, l) => {
	if (!l) {
		hexInput_g.value = c;
		hex_gcl.style.backgroundColor = c;
	} else {
		hexInput_c.value = c;
		hex_ccl.style.backgroundColor = c;
	}
}
const getCurrentDomain = () => {
	var url = window.location.href;
	if (window.tab && window.tab.url) url = tab.url;
	console.log(url);
	if (url.match(/[^\/]+\/\/[^\/]+/) != undefined)
		return url.match(/[^\/]+\/\/[^\/]+/)[0];
}
const loadEditorContent = () => {
	return dataStorage.load().then(function (injectionData) {
		console.log("Injection data " + injectionData);

		chrome.storage.local.get({
			dfc: "#0878A5",
			opt: [true, true, false]
		}, function (items) {
			//Set domain
			dmn_inp.value = getCurrentDomain();
			//Set color
			let dfcolor = items.dfc;
			setInputColor(dfcolor);
			hexToHsl(dfcolor);
			hexToColor();
			metaThemeColor.setAttribute("content", dfcolor);
			//Set options
			let opt = items.opt;
			opt0.checked = opt[0], opt1.checked = opt[1], opt2.checked = opt[2];

			console.log(injectionData);
			if (injectionData) {
				customChanged=true;
				console.log("injectionData found");
				//alert(Object.values(injectionData) + " |\n "+ Object.keys(injectionData) +" |\n "+chk_st.checked +" |\n"+Array.isArray(injectionData.opt));
				let color = injectionData.color;
				if (!color) color = dfcolor;
				setInputColor(color, true);
				hexToHsl(color);
				hexToColor();
				metaThemeColor.setAttribute("content", color);
				let o = injectionData.opt;
				console.log(o[0]);
				optc.checked=o[0],opt0c.checked = o[1], opt1c.checked = o[2], opt2c.checked = o[3];
				chk_st.checked = !injectionData.bl;
				currentInjectionData = injectionData;
			} else {
				chk_st.checked= true;
				optc.checked = false;
				setInputColor(dfcolor, true);
				//Disable custom checkboxes
				opt0c.disabled = true, opt1c.disabled = true, opt2c.disabled = true;
				//Disable custom color input
				hex_ccl.style.pointerEvents = "none";
			}
		});


	});
}
const saveEditorContent = () => {
	ntoast.success('Options saved. Reload the website page to apply changes');
	chrome.storage.local.set({
		dfc: hexInput_g.value,
		opt: [opt0.checked, opt1.checked, opt2.checked]
	})
	if (customChanged) {
		let newDomain = dmn_inp.value;
		if (currentInjectionData && currentInjectionData.domain !== newDomain)
			dataStorage.remove(currentInjectionData.domain);
		let injectionData = new InjectedData(newDomain, hexInput_c.value, [optc.checked, opt0c.checked, opt1c.checked, opt2c.checked], (!chk_st.checked));
		currentInjectionData = injectionData;
		console.log(injectionData);
		//alert(Object.values(injectionData) + " |\n "+ Object.keys(injectionData) +" |\n "+chk_st.checked);
		dataStorage.save(injectionData);
	}


}
const dismBox = () => {
	document.getElementById("mylrt").style.display = "none";
}
var clrp, dialog;
var ntoast = new alert({
	timeout: 60000,
	autoClose: false
});
document.addEventListener("DOMContentLoaded", () => {
	chrome.tabs.query({
		currentWindow: true,
		active: true
	}, function (tabs) {
		window.tab = tabs[0];
		loadEditorContent().then(() => {
			evList();
		});
	});
	new themeManager();
	clrp = new modal("#clrp");

	dialog = new modal("#dialog");
})